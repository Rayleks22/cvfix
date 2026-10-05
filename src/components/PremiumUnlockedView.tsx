import { useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Copy,
  Download,
  FileText,
  Info,
  LoaderCircle,
  RotateCcw,
} from 'lucide-react';
import type { PremiumPackage } from '../types/index.ts';
import { downloadDOCX, downloadPDF } from '../lib/export.ts';
import { DocumentPreview } from './DocumentPreview.tsx';

export function PremiumUnlockedView({
  value,
  onChange,
  onBack,
  demo,
  reference,
}: {
  value: PremiumPackage;
  onChange: (value: PremiumPackage) => void;
  onBack: () => void;
  demo: boolean;
  reference: string | null;
}) {
  const [activeDocument, setActiveDocument] = useState<'cv' | 'letter'>('cv');
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const text = activeDocument === 'cv' ? value.cvText : value.coverLetter;
  const update = (newText: string) => {
    setConfirmed(false);
    setError('');
    onChange({ ...value, [activeDocument === 'cv' ? 'cvText' : 'coverLetter']: newText });
  };
  const validate = () => {
    if (!confirmed)
      throw new Error(
        'Please confirm that you have checked the document’s facts before exporting.',
      );
    if (text.trim().length < 80)
      throw new Error('The document needs at least 80 characters before it can be exported.');
    if (/\[(?:your name|company name|target role)\]/i.test(text))
      throw new Error('Please replace the remaining placeholder with your actual details.');
  };
  async function download(format: 'pdf' | 'docx') {
    setError('');
    try {
      validate();
      setBusy(format);
      const kind = activeDocument === 'cv' ? 'CV' : 'Cover_Letter';
      await (format === 'pdf'
        ? downloadPDF(text, value.candidateName, kind)
        : downloadDOCX(text, value.candidateName, kind));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'The download could not be prepared. Please try again.',
      );
    } finally {
      setBusy(null);
    }
  }
  async function copy() {
    setError('');
    try {
      validate();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Copying is unavailable in this browser. Select the text and copy it manually.',
      );
    }
  }
  return (
    <section className="container editor-section">
      <div className="page-back-row">
        <button className="text-button" onClick={onBack}>
          <ArrowLeft size={16} /> Back to your review
        </button>
        <span className={demo ? 'demo-label' : 'verified-label'}>
          {demo ? 'FICTIONAL SAMPLE EDITOR' : 'PAYMENT VERIFIED ON THE SERVER'}
        </span>
      </div>
      <div className="editor-heading">
        <div>
          <span className="eyebrow">YOUR DOCUMENT. YOUR FINAL SAY.</span>
          <h1>
            Make it <em>yours.</em>
          </h1>
          <p>Review the wording, add verified details, and check every fact before downloading.</p>
        </div>
        <span className="editor-local-note">
          <FileText size={18} /> Edits stay in this tab.
          <br />
          Download a copy to keep them.
        </span>
      </div>
      {demo && (
        <div className="info-banner">
          <Info size={17} />
          <span>
            This is a fictional example you can edit and export for free. It is not a CVFix
            certification or a real candidate’s CV.
          </span>
        </div>
      )}
      {!demo && reference && (
        <div className="receipt-note">
          Payment reference: <code>{reference}</code>. Keep it if you need help. Your checkout
          session can recover the generated draft for 24 hours; edits are not saved to a server.
        </div>
      )}
      <div className="editor-document-tabs" role="tablist" aria-label="Document to edit">
        <button
          role="tab"
          aria-selected={activeDocument === 'cv'}
          aria-controls="document-editor-panel"
          onClick={() => {
            setActiveDocument('cv');
            setConfirmed(false);
          }}
        >
          Your CV
        </button>
        <button
          role="tab"
          aria-selected={activeDocument === 'letter'}
          aria-controls="document-editor-panel"
          onClick={() => {
            setActiveDocument('letter');
            setConfirmed(false);
          }}
        >
          Cover-letter draft
        </button>
      </div>
      <div className="editor-layout" id="document-editor-panel">
        <div className="editor-controls">
          <div className="editor-text-heading">
            <label htmlFor="document-editor">
              {activeDocument === 'cv' ? 'Edit your CV' : 'Edit your cover letter'}
            </label>
            <span>{text.trim().split(/\s+/).filter(Boolean).length} words</span>
          </div>
          <textarea
            id="document-editor"
            value={text}
            onChange={(event) => update(event.target.value)}
            maxLength={60_000}
            spellCheck
            aria-describedby="editor-help"
          />
          <p className="field-help" id="editor-help">
            Every employer, title, date and qualification comes from the source you provided. The
            cover letter is a simple draft, not an invented achievement narrative.
          </p>
          <details className="changes-details">
            <summary>
              {value.changes.length}{' '}
              {value.changes.length === 1 ? 'wording change' : 'wording changes'} in the generated
              CV <ChevronDown size={16} />
            </summary>
            {value.changes.length ? (
              value.changes.map((change, index) => (
                <div key={`${change.lineIndex}-${index}`} className="change-item">
                  <span>Original</span>
                  <p>{change.original}</p>
                  <span>Suggestion</span>
                  <p>{change.revised}</p>
                  <small>{change.reason}</small>
                  <button
                    className="text-button"
                    onClick={() => {
                      const lines = value.cvText.split('\n');
                      const current = lines[change.lineIndex];
                      if (current?.includes(change.revised)) {
                        lines[change.lineIndex] = current.replace(change.revised, change.original);
                        onChange({ ...value, cvText: lines.join('\n') });
                        setConfirmed(false);
                      } else {
                        setError(
                          'This line has been edited already. Use the original wording above if you want to restore it.',
                        );
                      }
                    }}
                  >
                    <RotateCcw size={12} /> Restore original line
                  </button>
                </div>
              ))
            ) : (
              <p className="muted">
                No responsibility-led wording needed a safe grammatical change. Your complete source
                was preserved.
              </p>
            )}
          </details>
          <label className="checkbox-label export-confirmation">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
            />
            <span>
              I’ve checked the names, dates, qualifications and achievements. This document
              accurately represents {demo ? 'this fictional example' : 'me'}.
            </span>
          </label>
          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}
          <div className="export-actions">
            <button
              className="button button-primary"
              disabled={!confirmed || Boolean(busy)}
              onClick={() => void download('pdf')}
            >
              {busy === 'pdf' ? (
                <LoaderCircle size={16} className="spin" />
              ) : (
                <Download size={16} />
              )}
              Download PDF
            </button>
            <button
              className="button button-outline"
              disabled={!confirmed || Boolean(busy)}
              onClick={() => void download('docx')}
            >
              {busy === 'docx' ? (
                <LoaderCircle size={16} className="spin" />
              ) : (
                <Download size={16} />
              )}
              Download Word
            </button>
            <button
              className="button button-quiet"
              disabled={!confirmed || Boolean(busy)}
              onClick={() => void copy()}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? 'Copied' : 'Copy text'}
            </button>
          </div>
        </div>
        <div className="preview-pane">
          <div className="preview-bar">
            <span className="status-dot" />
            LIVE DOCUMENT PREVIEW<span>Single-column · A4 export</span>
          </div>
          <DocumentPreview text={text} coverLetter={activeDocument === 'letter'} />
          <p className="preview-footnote">
            Exports preserve all the text and add pages as needed. Exact line breaks may vary
            between Word, PDF and this preview.
          </p>
        </div>
      </div>
    </section>
  );
}
