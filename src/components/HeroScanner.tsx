import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  FileText,
  LoaderCircle,
  LockKeyhole,
  Upload,
  X,
} from 'lucide-react';
import type { ReviewInput } from '../types/index.ts';
import { extractCV } from '../lib/files.ts';
import { MAX_CV_CHARS, MAX_JOB_CHARS, MAX_ROLE_CHARS } from '../lib/constants.ts';
import { validateReviewInput } from '../lib/review.ts';

export function HeroScanner({
  input,
  onInputChange,
  onStartAnalysis,
  onTrySample,
  isLoading,
}: {
  input: ReviewInput;
  onInputChange: (input: ReviewInput) => void;
  onStartAnalysis: (input: ReviewInput) => void;
  onTrySample: () => void;
  isLoading: boolean;
}) {
  const [tab, setTab] = useState<'upload' | 'paste'>(input.cvText ? 'paste' : 'upload');
  const [fileName, setFileName] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [tailorOpen, setTailorOpen] = useState(Boolean(input.targetRole || input.jobDescription));
  const extractionId = useRef(0);
  const currentInput = useRef(input);
  currentInput.current = input;
  useEffect(
    () => () => {
      extractionId.current += 1;
    },
    [],
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const updateText = (text: string) => {
    setConfirmed(false);
    setError('');
    onInputChange({ ...input, cvText: text });
  };
  async function upload(file: File) {
    const id = ++extractionId.current;
    setError('');
    setConfirmed(false);
    setExtracting(true);
    setFileName('');
    onInputChange({ ...input, cvText: '' });
    try {
      const cvText = await extractCV(file);
      if (id !== extractionId.current) return;
      onInputChange({ ...currentInput.current, cvText });
      setConfirmed(false);
      setFileName(file.name);
      setTab('paste');
    } catch (err) {
      if (id === extractionId.current)
        setError(
          err instanceof Error
            ? err.message
            : 'This document could not be read. Please try another format.',
        );
    } finally {
      if (id === extractionId.current) setExtracting(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }
  function submit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    try {
      validateReviewInput(input);
      if (!confirmed)
        throw new Error('Please check the CV text and confirm it is correct before continuing.');
      onStartAnalysis(input);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Please check your CV text.');
      if (tab === 'paste') textRef.current?.focus();
    }
  }
  return (
    <section className="hero-section">
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="status-dot" /> YOUR NEXT CHAPTER STARTS HERE
          </div>
          <h1>
            Good experience
            <br />A <em>better CV</em>
          </h1>
          <p className="hero-description">
            You’ve done the work. Let’s help your CV show it. Get clear feedback and stronger
            wording for your next opportunity.
          </p>
          <div className="hero-benefits">
            <span>
              <Check size={16} /> Free, practical feedback
            </span>
            <span>
              <Check size={16} /> Built for Nigerian jobseekers
            </span>
            <span>
              <Check size={16} /> Your facts stay yours
            </span>
          </div>
          <button className="text-button hero-sample" onClick={onTrySample}>
            See a sample review <ArrowUpRight size={18} />
          </button>
          <div className="hero-note">
            <span className="note-icon">
              <FileText size={19} />
            </span>
            <p>
              First job. Career change. Next big move.
              <br />
              <strong>Make your experience easier to understand.</strong>
            </p>
          </div>
        </div>
        <div className="scanner-wrap">
          <form
            className="scanner-card"
            id="cv-checker"
            onSubmit={submit}
            noValidate
            aria-label="Free CV review"
          >
            <div className="scanner-heading">
              <div>
                <span className="eyebrow small">LET’S START WITH YOUR CV</span>
                <h2>Your next step, made simple</h2>
              </div>
              <span className="free-tag">FREE</span>
            </div>
            <div className="input-tabs" role="tablist" aria-label="How to add your CV">
              {(['upload', 'paste'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  disabled={extracting}
                  id={`${value}-tab`}
                  aria-selected={tab === value}
                  aria-controls="cv-input-panel"
                  tabIndex={tab === value ? 0 : -1}
                  className={tab === value ? 'selected' : ''}
                  onClick={() => setTab(value)}
                  onKeyDown={(event) => {
                    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                      event.preventDefault();
                      const next = tab === 'upload' ? 'paste' : 'upload';
                      setTab(next);
                      document.getElementById(`${next}-tab`)?.focus();
                    }
                  }}
                >
                  {value === 'upload' ? <Upload size={16} /> : <FileText size={16} />}
                  {value === 'upload' ? 'Upload CV' : 'Paste text'}
                </button>
              ))}
            </div>
            <div id="cv-input-panel" role="tabpanel" aria-labelledby={`${tab}-tab`}>
              {tab === 'upload' ? (
                <div
                  className={`dropzone ${dragging ? 'dragging' : ''}`}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(event) => {
                    event.preventDefault();
                    setDragging(false);
                    if (event.dataTransfer.files[0]) void upload(event.dataTransfer.files[0]);
                  }}
                >
                  <span className="upload-icon">
                    {extracting ? (
                      <LoaderCircle size={24} className="spin" />
                    ) : (
                      <Upload size={24} />
                    )}
                  </span>
                  <strong>
                    {extracting
                      ? 'Reading your document…'
                      : input.cvText
                        ? 'Choose a different CV'
                        : 'Drop your CV here'}
                  </strong>
                  <span className="dropzone-or">
                    or{' '}
                    <button
                      type="button"
                      className="inline-link"
                      disabled={extracting}
                      onClick={() => inputRef.current?.click()}
                    >
                      choose a file
                    </button>
                  </span>
                  <span className="file-help">PDF, DOCX or TXT · up to 5 MB</span>
                  <input
                    ref={inputRef}
                    className="visually-hidden"
                    type="file"
                    accept=".pdf,.docx,.txt"
                    aria-label="Upload your CV file"
                    disabled={extracting}
                    onChange={(event) => {
                      if (event.target.files?.[0]) void upload(event.target.files[0]);
                    }}
                  />
                  {input.cvText && (
                    <button type="button" className="text-button" onClick={() => setTab('paste')}>
                      View your CV text <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              ) : (
                <div className="paste-panel">
                  <div className="text-panel-label">
                    <label htmlFor="cv-text">
                      {fileName ? 'Check the extracted text' : 'Your CV text'}
                    </label>
                    {fileName && (
                      <span className="file-chip" title={fileName}>
                        <FileText size={12} />
                        {fileName}
                      </span>
                    )}
                  </div>
                  <textarea
                    id="cv-text"
                    disabled={extracting}
                    ref={textRef}
                    value={input.cvText}
                    maxLength={MAX_CV_CHARS}
                    onChange={(event) => updateText(event.target.value)}
                    placeholder="Paste your name, contact details, experience, education and skills here…"
                    rows={7}
                    aria-describedby="cv-text-help"
                    spellCheck
                  />
                  <div className="text-panel-meta">
                    <span id="cv-text-help">Check names, dates and any extracted text.</span>
                    <span>{input.cvText.length.toLocaleString()} / 30,000</span>
                  </div>
                </div>
              )}
            </div>
            <button
              type="button"
              className="tailor-toggle"
              aria-expanded={tailorOpen}
              aria-controls="tailor-fields"
              onClick={() => setTailorOpen(!tailorOpen)}
            >
              <span>
                Applying for a specific job? <small>Optional</small>
              </span>
              <ChevronDown size={16} className={tailorOpen ? 'rotate' : ''} />
            </button>
            {tailorOpen && (
              <div className="tailor-fields" id="tailor-fields">
                <label htmlFor="target-role">Target role</label>
                <input
                  id="target-role"
                  value={input.targetRole}
                  maxLength={MAX_ROLE_CHARS}
                  placeholder="e.g. Customer Support Officer"
                  onChange={(event) => onInputChange({ ...input, targetRole: event.target.value })}
                />
                <label htmlFor="job-description">Job description</label>
                <textarea
                  id="job-description"
                  value={input.jobDescription}
                  maxLength={MAX_JOB_CHARS}
                  rows={4}
                  placeholder="Paste the actual job description for a more relevant keyword check."
                  onChange={(event) =>
                    onInputChange({ ...input, jobDescription: event.target.value })
                  }
                />
                <p className="field-help">
                  We’ll show relevant skill gaps. We won’t add skills you haven’t supplied.
                </p>
              </div>
            )}
            {input.cvText.trim() && (
              <label className="checkbox-label source-confirmation">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(event) => setConfirmed(event.target.checked)}
                />
                <span>I’ve checked the text and it accurately reflects my CV.</span>
              </label>
            )}
            {error && (
              <div className="form-error" role="alert">
                <span>{error}</span>
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Dismiss error"
                  onClick={() => setError('')}
                >
                  <X size={15} />
                </button>
              </div>
            )}
            <button
              type="submit"
              className="button button-primary scanner-submit"
              disabled={extracting || isLoading}
            >
              {isLoading ? (
                <>
                  <LoaderCircle size={17} className="spin" /> Checking your CV…
                </>
              ) : (
                <>
                  Check my CV free <ArrowRight size={17} />
                </>
              )}
            </button>
            <p className="scanner-privacy">
              <LockKeyhole size={12} /> Free review happens in your browser. No sign-up.
            </p>
          </form>
          <div className="scanner-caption">
            <span>Start free · Make it yours</span>
            <span>
              Full CV package <strong>₦1,000</strong> · one time
            </span>
          </div>
        </div>
      </div>
      <div className="container fit-strip">
        <span>A LITTLE CLARITY GOES A LONG WAY.</span>
        <p>
          For local opportunities <i /> For remote roles <i /> For your next move
        </p>
        <span className="fit-strip-end">YOUR EXPERIENCE, NOT A TEMPLATE.</span>
      </div>
    </section>
  );
}
