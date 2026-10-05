import { isSectionHeading } from './review.ts';
import regularFontUrl from '../assets/fonts/NotoSans-Regular.ttf?url';
import boldFontUrl from '../assets/fonts/NotoSans-Bold.ttf?url';
import coverage from '../assets/fonts/coverage.json';

export function assertPDFFontCoverage(text: string): void {
  const unsupported = [
    ...new Set(
      [...text].filter((character) => {
        const point = character.codePointAt(0)!;
        return (
          !/[\r\n\t]/.test(character) &&
          !coverage.some(([start, end]) => point >= start && point <= end)
        );
      }),
    ),
  ];
  if (unsupported.length)
    throw new Error(
      `Some characters cannot be rendered by this PDF font (${unsupported.slice(0, 4).join(' ')}). Use the Word download to preserve them, or replace them before exporting a PDF.`,
    );
}

function safeFilename(name: string, kind: string): string {
  const cleaned = name
    .trim()
    .replace(/[^\p{L}\p{N}_ -]/gu, '')
    .replace(/\s+/g, '_')
    .slice(0, 70);
  return `${cleaned || 'My'}_${kind}`;
}
function base64(buffer: ArrayBuffer): string {
  let binary = '';
  for (const value of new Uint8Array(buffer)) binary += String.fromCharCode(value);
  return btoa(binary);
}
let cachedFonts: Promise<[string, string]> | null = null;
function getFonts(): Promise<[string, string]> {
  if (!cachedFonts)
    cachedFonts = Promise.all(
      [regularFontUrl, boldFontUrl].map(async (url) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error('The PDF font could not load. Please try again.');
        return base64(await response.arrayBuffer());
      }),
    )
      .then((values) => values as [string, string])
      .catch((error) => {
        cachedFonts = null;
        throw error;
      });
  return cachedFonts;
}

export async function downloadPDF(text: string, name: string, kind = 'CV'): Promise<void> {
  assertPDFFontCoverage(text);
  const [{ jsPDF }, fonts] = await Promise.all([import('jspdf'), getFonts()]);
  const doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true });
  doc.addFileToVFS('NotoSans-Regular.ttf', fonts[0]);
  doc.addFont('NotoSans-Regular.ttf', 'NotoSans', 'normal');
  doc.addFileToVFS('NotoSans-Bold.ttf', fonts[1]);
  doc.addFont('NotoSans-Bold.ttf', 'NotoSans', 'bold');
  const margin = 46;
  const width = doc.internal.pageSize.getWidth() - margin * 2;
  const bottom = doc.internal.pageSize.getHeight() - margin;
  let y = margin;
  const lines = text.replace(/\r/g, '').split('\n');
  let first = true;
  for (const source of lines) {
    if (!source.trim()) {
      y += 8;
      continue;
    }
    const heading = isSectionHeading(source);
    const nameLine = first && kind === 'CV';
    first = false;
    doc.setFont('NotoSans', heading || nameLine ? 'bold' : 'normal');
    doc.setFontSize(nameLine ? 17 : heading ? 10.5 : 10);
    doc.setTextColor(22, 36, 45);
    const wrapped = doc.splitTextToSize(source.trim(), width) as string[];
    if (heading) {
      if (y + 42 > bottom) {
        doc.addPage();
        y = margin;
      }
      y += 8;
    }
    for (const line of wrapped) {
      if (y + 15 > bottom) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y + 10);
      y += nameLine ? 23 : 15;
    }
    if (heading) y += 3;
  }
  doc.setProperties({ title: `${name || 'Candidate'} ${kind}`, subject: kind, creator: 'CVFix' });
  doc.save(`${safeFilename(name, kind)}.pdf`);
}

export async function downloadDOCX(text: string, name: string, kind = 'CV'): Promise<void> {
  const { Document, Paragraph, TextRun, Packer } = await import('docx');
  let first = true;
  const children = text
    .replace(/\r/g, '')
    .split('\n')
    .map((source) => {
      const heading = isSectionHeading(source);
      const nameLine = first && source.trim() && kind === 'CV';
      if (source.trim()) first = false;
      const bullet = source.match(/^[•*\-]\s+(.+)$/);
      return new Paragraph({
        children: [
          new TextRun({
            text: bullet ? bullet[1] : source,
            bold: Boolean(heading || nameLine),
            size: nameLine ? 34 : heading ? 22 : 21,
            font: 'Calibri',
          }),
        ],
        bullet: bullet ? { level: 0 } : undefined,
        spacing: { before: heading ? 180 : 0, after: source.trim() ? 90 : 50, line: 280 },
        keepNext: heading,
      });
    });
  const document = new Document({
    creator: 'CVFix',
    title: `${name || 'Candidate'} ${kind}`,
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 920, bottom: 920, left: 920, right: 920 },
          },
        },
        children,
      },
    ],
  });
  const blob = await Packer.toBlob(document);
  const url = URL.createObjectURL(blob);
  const anchor = window.document.createElement('a');
  anchor.href = url;
  anchor.download = `${safeFilename(name, kind)}.docx`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
