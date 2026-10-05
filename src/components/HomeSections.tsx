import {
  ArrowRight,
  Check,
  FileCheck2,
  GraduationCap,
  HeartHandshake,
  ScanText,
  ShieldCheck,
} from 'lucide-react';
import type { TabName } from '../types/index.ts';
import { Pricing } from './Pricing.tsx';

export function HomeSections({
  onStart,
  onSample,
  onNavigate,
}: {
  onStart: () => void;
  onSample: () => void;
  onNavigate: (tab: TabName) => void;
}) {
  return (
    <>
      <section className="how-section" id="how-it-works">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">LESS GUESSWORK. MORE CONFIDENCE.</span>
            <h2>
              A clearer CV.
              <br />
              <em>One step at a time.</em>
            </h2>
            <p>You don’t need to start from scratch. Start with the experience you already have.</p>
          </div>
          <div className="steps-grid">
            {[
              {
                number: '01',
                icon: ScanText,
                title: 'Bring your experience',
                description:
                  'Upload a PDF or Word document, or paste your CV text. Check that the extracted details are right.',
              },
              {
                number: '02',
                icon: FileCheck2,
                title: 'Find your next improvements',
                description:
                  'See your strengths, practical fixes and a wording example. Add a job description for a relevant skill check.',
              },
              {
                number: '03',
                icon: HeartHandshake,
                title: 'Make it yours',
                description:
                  'Choose the full package if you want an editable CV and cover-letter draft. Confirm the facts, then download.',
              },
            ].map((step) => (
              <article className="step-card" key={step.number}>
                <div className="step-top">
                  <span>{step.number}</span>
                  <step.icon size={23} strokeWidth={1.5} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="example-section" id="before-and-after">
        <div className="container example-grid">
          <div className="example-copy">
            <span className="eyebrow">SAME EXPERIENCE. CLEARER STORY.</span>
            <h2>
              Better wording.
              <br />
              <em>Not made-up wins.</em>
            </h2>
            <p>
              A strong CV doesn’t need invented percentages or a title you never held. It needs to
              make your real work easy to understand.
            </p>
            <div className="example-promise">
              <ShieldCheck size={20} />
              <span>
                No invented metrics.
                <br />
                <strong>No extra qualifications. No inflated titles.</strong>
              </span>
            </div>
            <button className="text-button" onClick={onSample}>
              Try the sample CV <ArrowRight size={17} />
            </button>
          </div>
          <div className="comparison-card">
            <div className="comparison-title">
              <span className="mini-document">
                <FileCheck2 size={17} />
              </span>
              <span>A small change that makes a difference</span>
              <span className="example-label">EXAMPLE</span>
            </div>
            <div className="before-box">
              <span className="comparison-label">BEFORE</span>
              <p>“Responsible for daily customer service and addressing customer complaints.”</p>
            </div>
            <div className="comparison-connector">
              <ArrowRight size={18} />
            </div>
            <div className="after-box">
              <span className="comparison-label">
                <Check size={13} /> AFTER
              </span>
              <p>“Provided daily customer service and addressed customer complaints.”</p>
            </div>
            <div className="comparison-caption">
              The action is clearer. The facts are unchanged.
            </div>
          </div>
        </div>
      </section>
      <section className="local-section">
        <div className="container local-grid">
          <div className="local-icon">
            <GraduationCap size={39} strokeWidth={1.3} />
          </div>
          <div>
            <span className="eyebrow">BUILT WITH YOUR CONTEXT IN MIND</span>
            <h2>
              Your NYSC. Your HND. <em>Your story.</em>
            </h2>
            <p>
              Local experience belongs on your CV. Keep your official qualifications and job titles,
              and explain the work behind them in language any employer can understand.
            </p>
          </div>
          <span className="local-stamp">
            Made for
            <br />
            <strong>
              Nigerian
              <br />
              jobseekers.
            </strong>
            <span>✳</span>
          </span>
        </div>
      </section>
      <Pricing onStart={onStart} onSample={onSample} />
      <section className="faq-section" id="faq">
        <div className="container faq-grid">
          <div className="section-heading">
            <span className="eyebrow">A FEW THINGS WORTH KNOWING</span>
            <h2>
              Good questions.
              <br />
              <em>Clear answers.</em>
            </h2>
            <p>
              Still need a hand?{' '}
              <button className="inline-link" onClick={() => onNavigate('contact')}>
                Visit help & contact.
              </button>
            </p>
          </div>
          <div className="faq-list">
            <details>
              <summary>What does the CVFix score mean?</summary>
              <p>
                It is our rule-based assessment of structure, wording, specific detail, and core
                details or recognised job keywords. Each category has equal weight. It is not an
                official ATS score or a prediction of interviews.{' '}
                <button className="inline-link" onClick={() => onNavigate('methodology')}>
                  Read the scoring method.
                </button>
              </p>
            </details>
            <details>
              <summary>Will CVFix invent achievements or skills?</summary>
              <p>
                No generated numbers, salary estimates, qualifications, tools or job titles are
                inserted. The current editor makes conservative grammatical changes to supplied
                experience bullets. We ask questions when detail is missing. You review and approve
                the final text.
              </p>
            </details>
            <details>
              <summary>Where does my CV go?</summary>
              <p>
                The free review and file extraction run in your browser. If you choose the paid
                package and consent, your text is sent to CVFix’s server to prepare an encrypted,
                24-hour checkout session. Your CV is not sent to Paystack or an AI provider.{' '}
                <button className="inline-link" onClick={() => onNavigate('privacy')}>
                  Read the privacy notice.
                </button>
              </p>
            </details>
            <details>
              <summary>Which files can I use?</summary>
              <p>
                PDFs with selectable text, DOCX and TXT files up to 5 MB. PDFs can have up to 20
                pages. Scans need OCR elsewhere first. Older DOC files must be saved as DOCX or PDF.
                You can always paste the text instead.
              </p>
            </details>
            <details>
              <summary>What do I get for ₦1,000?</summary>
              <p>
                A wording and formatting cleanup that preserves your complete CV, an editable
                cover-letter draft, and PDF and Word downloads. It is a one-time payment for that
                package, not a subscription. The draft is not a human-written or recruiter-certified
                document.
              </p>
            </details>
            <details>
              <summary>What if a payment or download goes wrong?</summary>
              <p>
                Keep your Paystack reference and retry verification—do not pay again. The same
                browser tab can recover your package for 24 hours. For a duplicate charge or an
                inaccessible package,{' '}
                <button className="inline-link" onClick={() => onNavigate('refunds')}>
                  see the payment help and refund policy.
                </button>
              </p>
            </details>
          </div>
        </div>
      </section>
      <section className="closing-section">
        <div className="container closing-inner">
          <div>
            <span className="eyebrow">YOU’VE GOT SOMETHING TO OFFER.</span>
            <h2>
              Let your CV <em>show it.</em>
            </h2>
          </div>
          <button className="button button-primary" onClick={onStart}>
            Check my CV free <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </>
  );
}
