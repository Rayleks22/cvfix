import { MAX_CV_CHARS, MAX_FILE_BYTES, MAX_PDF_PAGES, MIN_CV_CHARS } from './constants.ts';
import { normaliseCV } from './review.ts';

export function validateFile(file: Pick<File, 'name' | 'size'>): 'pdf' | 'docx' | 'txt' {
  if (file.size > MAX_FILE_BYTES)
    throw new Error('This file is over 5 MB. Please upload a smaller version.');
  if (file.size === 0) throw new Error('This file is empty. Please choose your CV again.');
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension === 'doc')
    throw new Error(
      'Older .doc files are not supported. Save it as .docx or PDF, or paste your CV text.',
    );
  if (!['pdf', 'docx', 'txt'].includes(extension || ''))
    throw new Error('Please choose a PDF, DOCX, or TXT file.');
  return extension as 'pdf' | 'docx' | 'txt';
}

/** Reject encrypted, malformed, very large expanded ZIPs before passing a DOCX to Mammoth. */
export function validateDocxArchive(buffer: ArrayBuffer): void {
  const view = new DataView(buffer);
  let end = -1;
  for (
    let offset = view.byteLength - 22;
    offset >= Math.max(0, view.byteLength - 65_557);
    offset--
  ) {
    if (view.getUint32(offset, true) === 0x06054b50) {
      end = offset;
      break;
    }
  }
  if (end < 0)
    throw new Error(
      'This Word file could not be read. Check that it is an unencrypted .docx file.',
    );
  const count = view.getUint16(end + 10, true);
  let offset = view.getUint32(end + 16, true);
  let expanded = 0;
  let document = false;
  if (count > 1500)
    throw new Error(
      'This Word file contains too many embedded objects. Please save a simpler copy.',
    );
  for (let index = 0; index < count; index++) {
    if (offset + 46 > view.byteLength || view.getUint32(offset, true) !== 0x02014b50)
      throw new Error('This Word file is damaged or unsupported.');
    if (view.getUint16(offset + 8, true) & 1)
      throw new Error('Please remove the Word file password before uploading.');
    expanded += view.getUint32(offset + 24, true);
    if (expanded > 20 * 1024 * 1024)
      throw new Error(
        'This Word file expands to more than 20 MB. Remove embedded images or paste the text.',
      );
    const nameLength = view.getUint16(offset + 28, true);
    const extra = view.getUint16(offset + 30, true);
    const comment = view.getUint16(offset + 32, true);
    const name = new TextDecoder().decode(new Uint8Array(buffer, offset + 46, nameLength));
    if (name === 'word/document.xml') document = true;
    offset += 46 + nameLength + extra + comment;
  }
  if (!document)
    throw new Error('This is not a supported Word document. Please use .docx, PDF, or TXT.');
}

export async function extractCV(file: File): Promise<string> {
  const extension = validateFile(file);
  let text = '';
  if (extension === 'txt') {
    text = await file.text();
    if (/^PK\x03\x04|^%PDF/.test(text))
      throw new Error(
        'The file extension does not match its contents. Please upload the original DOCX or PDF.',
      );
  } else if (extension === 'docx') {
    const buffer = await file.arrayBuffer();
    validateDocxArchive(buffer);
    const mammoth = await import('mammoth');
    try {
      text = (await mammoth.extractRawText({ arrayBuffer: buffer })).value;
    } catch {
      throw new Error(
        'We could not extract the Word text. Try saving a fresh .docx copy or paste the text.',
      );
    }
  } else {
    const pdfjs = await import('pdfjs-dist');
    const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
    pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
    let pdf: Awaited<ReturnType<typeof pdfjs.getDocument>['promise']> | undefined;
    try {
      pdf = await pdfjs.getDocument({ data: await file.arrayBuffer(), isEvalSupported: false })
        .promise;
      if (pdf.numPages > MAX_PDF_PAGES)
        throw new Error('Please upload a PDF with no more than 20 pages.');
      const pages: string[] = [];
      for (let index = 1; index <= pdf.numPages; index++) {
        const page = await pdf.getPage(index);
        const content = await page.getTextContent();
        let line = '';
        let lastY: number | null = null;
        const pageLines: string[] = [];
        for (const item of content.items) {
          if (!('str' in item)) continue;
          const y = item.transform[5];
          if (lastY !== null && Math.abs(y - lastY) > 3 && line.trim()) {
            pageLines.push(line.trim());
            line = '';
          }
          line += `${line && !line.endsWith(' ') ? ' ' : ''}${item.str}`;
          lastY = y;
          if (item.hasEOL) {
            pageLines.push(line.trim());
            line = '';
            lastY = null;
          }
        }
        if (line.trim()) pageLines.push(line.trim());
        pages.push(pageLines.join('\n'));
        if (pages.join('\n\n').length > MAX_CV_CHARS)
          throw new Error('Your CV is too long. Please keep it under 30,000 characters.');
        page.cleanup();
      }
      text = pages.join('\n\n');
    } catch (error) {
      if (error instanceof Error && /20 pages|too long/.test(error.message)) throw error;
      if (error instanceof Error && /password/i.test(error.message))
        throw new Error('Please remove the PDF password before uploading.');
      throw new Error('We could not read this PDF. Please try DOCX or paste the CV text.');
    } finally {
      if (pdf) await pdf.destroy();
    }
  }
  text = normaliseCV(text);
  if (text.length < MIN_CV_CHARS)
    throw new Error(
      extension === 'pdf'
        ? 'This PDF has little or no selectable text. It may be a scan. Use a text-based PDF, DOCX, or paste the text; OCR is not supported yet.'
        : 'This document does not contain enough readable CV text. Please check the file.',
    );
  if (text.length > MAX_CV_CHARS)
    throw new Error('Your CV is too long. Please keep it under 30,000 characters.');
  return text;
}
