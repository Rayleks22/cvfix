import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  FileText,
  Info,
  LockKeyhole,
  PencilLine,
} from 'lucide-react';
import type { ReviewResult, TabName } from '../types/index.ts';
import { PRICE_LABEL } from '../lib/constants.ts';

export function ResultsDashboard({
  result,
  onUnlockPremium,
  onReset,
  onSampleEditor,
  onNavigate,
  demo,
  unlocked,
  onEditor,
}: {
  result: ReviewResult;
  onUnlockPremium: () => void;
  onReset: () => void;
  onSampleEditor: () => void;
  onNavigate: (tab: TabName) => void;
  demo: boolean;
  unlocked: boolean;
  onEditor: () => void;
}) {
  return (
    <section className="review-section container">
      <div className="page-back-row">
        <button className="text-button" onClick={onReset}>
          <ArrowLeft size={16} /> Edit CV details
        </button>
        {demo && <span className="demo-label">FICTIONAL SAMPLE · NO PERSONAL DATA</span>}
      </div>
      <div className="review-heading">
        <span className="eyebrow">YOUR EXPERIENCE, SEEN MORE CLEARLY</span>
        <h1>
          A good next step
          <br />
          <em>starts with clarity</em>
        </h1>
        <p>
          {result.candidateName
            ? `${result.candidateName.split(' ')[0].charAt(0).toLocaleUpperCase()}${result.candidateName.split(' ')[0].slice(1).toLocaleLowerCase()}, here’s`
            : 'Here’s'}{' '}
          what’s working and what you can strengthen.
        </p>
      </div>
      <div className="review-layout">
        <div className="review-main">
          <article className="report-card strengths-card">
            <div className="card-heading">
              <span className="section-icon">
                <CheckCircle2 size={20} />
              </span>
              <div>
                <span className="eyebrow small">KEEP THESE</span>
                <h2>You have a foundation to build on</h2>
              </div>
            </div>
            <ul className="strengths-list">
              {result.strengths.map((item) => (
                <li key={item}>
                  <Check size={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="report-card">
            <div className="card-heading">
              <span className="section-icon warm">
                <PencilLine size={20} />
              </span>
              <div>
                <span className="eyebrow small">YOUR NEXT IMPROVEMENTS</span>
                <h2>
                  {result.suggestions.length
                    ? `${result.suggestions.length} ${result.suggestions.length === 1 ? 'way' : 'ways'} to strengthen your CV`
                    : 'Keep checking the details'}
                </h2>
              </div>
            </div>
            <div className="suggestion-list">
              {result.suggestions.length ? (
                result.suggestions.map((suggestion, index) => (
                  <details key={suggestion.id} className="suggestion" open={index === 0}>
                    <summary>
                      <span className="suggestion-number">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span>{suggestion.title}</span>
                      <span className={`priority-tag ${suggestion.priority}`}>
                        {suggestion.priority === 'high'
                          ? 'Start here'
                          : suggestion.priority === 'medium'
                            ? 'Useful next'
                            : 'Polish'}
                      </span>
                      <ChevronDown size={17} />
                    </summary>
                    <div className="suggestion-body">
                      <p>{suggestion.description}</p>
                      {suggestion.excerpt && <blockquote>{suggestion.excerpt}</blockquote>}
                      {suggestion.revision && (
                        <div className="suggested-line">
                          <Check size={15} />
                          {suggestion.revision}
                        </div>
                      )}
                    </div>
                  </details>
                ))
              ) : (
                <p className="muted">
                  No obvious issues were found by these rules. Check spelling, names, dates and job
                  relevance yourself too—this does not guarantee an interview or successful parsing.
                </p>
              )}
            </div>
          </article>
          {result.sampleRewrite && (
            <article className="report-card sample-rewrite">
              <div className="card-heading">
                <span className="section-icon">
                  <FileText size={20} />
                </span>
                <div>
                  <span className="eyebrow small">YOUR WORDING, IMPROVED</span>
                  <h2>Same facts · A clearer action</h2>
                </div>
              </div>
              <div className="rewrite-box before-box">
                <span className="comparison-label">YOUR ORIGINAL</span>
                <p>“{result.sampleRewrite.original}”</p>
              </div>
              <div className="rewrite-box after-box">
                <span className="comparison-label">
                  <Check size={13} /> SUGGESTED WORDING
                </span>
                <p>“{result.sampleRewrite.revised}”</p>
              </div>
              <p className="card-note">
                <Info size={14} /> No numbers, tools or achievements were added. Confirm this
                wording describes your work.
              </p>
            </article>
          )}
          <article className="report-card keyword-card">
            <span className="eyebrow small">MAKE IT RELEVANT</span>
            <h2>
              {result.keywordSource === 'job-description'
                ? 'A check against your job description'
                : 'A little more context helps'}
            </h2>
            {result.keywordSource === 'job-description' ? (
              <>
                <p>
                  These are recognised skill terms from the actual job description—not a complete
                  assessment of its requirements.
                </p>
                {result.keywordMatches.length > 0 && (
                  <div className="keyword-group">
                    <span className="field-label">ALREADY MENTIONED</span>
                    <div className="keyword-tags">
                      {result.keywordMatches.map((keyword) => (
                        <span className="keyword present" key={keyword}>
                          <Check size={12} />
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {result.keywordGaps.length > 0 && (
                  <div className="keyword-group">
                    <span className="field-label">CHECK IF THESE APPLY TO YOU</span>
                    <div className="keyword-tags">
                      {result.keywordGaps.map((keyword) => (
                        <span className="keyword gap" key={keyword}>
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {!result.keywordGaps.length && !result.keywordMatches.length && (
                  <p className="card-note">
                    No skill terms from our current vocabulary were recognised. Job-keyword scoring
                    was not used.
                  </p>
                )}
              </>
            ) : (
              <>
                <p>
                  Add a job description for a focused keyword check. Without one, your score does
                  not penalise you for missing tools or role-specific keywords.
                </p>
                {result.keywordSource === 'role-ideas' && result.keywordGaps.length > 0 && (
                  <>
                    <span className="field-label">OPTIONAL ROLE IDEAS · NOT A SCORED GAP</span>
                    <div className="keyword-tags">
                      {result.keywordGaps.slice(0, 6).map((keyword) => (
                        <span className="keyword neutral" key={keyword}>
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </>
                )}
                <button className="text-button" onClick={onReset}>
                  Add a target role or job description <ArrowRight size={15} />
                </button>
              </>
            )}
            <div className="honesty-note">
              <Info size={16} />
              <span>
                Only mention skills you genuinely have. These terms are never inserted into your CV
                automatically.
              </span>
            </div>
          </article>
          <article className="report-card questions-card">
            <span className="eyebrow small">ADD A DETAIL YOU CAN STAND BEHIND</span>
            <h2>A couple of useful questions</h2>
            <ul>
              {result.followUpQuestions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
            <p className="muted">
              Use your answers to edit the source CV or paid draft. Keep details accurate; numbers
              are optional.
            </p>
          </article>
        </div>
        <aside className="review-sidebar">
          <div className="score-card">
            <div className="score-label">YOUR CVFIX ASSESSMENT</div>
            <div
              className="score-ring"
              role="img"
              aria-label={`CVFix assessment ${result.score} out of 100`}
            >
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--line)" strokeWidth="7" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="var(--green)"
                  strokeWidth="7"
                  strokeDasharray={Math.PI * 100}
                  strokeDashoffset={Math.PI * 100 * (1 - result.score / 100)}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <span>
                <strong>{result.score}</strong>
                <small>/ 100</small>
              </span>
            </div>
            <h3>{result.scoreLabel}</h3>
            <div className="score-pillars">
              {result.pillars.map((pillar) => (
                <div key={pillar.id}>
                  <div className="pillar-label">
                    <span>{pillar.label}</span>
                    <strong>
                      {pillar.score}
                      <small>/100</small>
                    </strong>
                  </div>
                  <div className="pillar-track">
                    <span style={{ width: `${pillar.score}%` }} />
                  </div>
                  <details className="pillar-explanation">
                    <summary>How this was calculated</summary>
                    <p>{pillar.explanation}</p>
                  </details>
                </div>
              ))}
            </div>
            <div className="score-disclaimer">
              A rule-based text check, not an official ATS score or hiring prediction. It cannot
              verify visual layout.
            </div>
            <button className="text-button" onClick={() => onNavigate('methodology')}>
              Read our scoring method <ArrowRight size={14} />
            </button>
          </div>
          <div className="package-card">
            <span className="package-icon">
              <FileText size={23} />
            </span>
            <span className="eyebrow small">FROM FEEDBACK TO A FINISHED DOCUMENT</span>
            <h3>
              Ready to make
              <br />
              it yours?
            </h3>
            <p>
              Get a conservative cleanup of your complete CV, an editable cover-letter draft, and
              Word + PDF downloads.
            </p>
            <ul>
              <li>
                <Check size={14} /> Names, dates and education kept
              </li>
              <li>
                <Check size={14} /> Review and approve every change
              </li>
              <li>
                <Check size={14} /> Simple, readable document layout
              </li>
            </ul>
            {demo ? (
              <>
                <span className="demo-package-note">Try the complete fictional sample, free.</span>
                <button className="button button-primary" onClick={onSampleEditor}>
                  Explore sample editor <ArrowRight size={16} />
                </button>
              </>
            ) : unlocked ? (
              <button className="button button-primary" onClick={onEditor}>
                Return to your editor <ArrowRight size={16} />
              </button>
            ) : (
              <>
                <div className="package-price">
                  {PRICE_LABEL}
                  <span>one time · no subscription</span>
                </div>
                <button className="button button-primary" onClick={onUnlockPremium}>
                  <LockKeyhole size={16} />
                  Get my CV package
                </button>
              </>
            )}
          </div>
          <div className="review-focus">
            <span className="field-label">REVIEW FOCUS</span>
            <strong>{result.targetRole}</strong>
            <span>{result.wordCount.toLocaleString()} words · rules-based review</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
