import { ArrowRight, Check, FileCheck2 } from 'lucide-react';
import { PRICE_LABEL } from '../lib/constants.ts';

export function Pricing({
  onStart,
  onSample,
  standalone = false,
}: {
  onStart: () => void;
  onSample: () => void;
  standalone?: boolean;
}) {
  return (
    <section className={`pricing-section ${standalone ? 'standalone-section' : ''}`} id="pricing">
      <div className="container">
        <div className="section-heading centered">
          <span className="eyebrow">A SMALL STEP. A STRONGER APPLICATION.</span>
          <h2>
            Start free. Go further
            <br />
            <em>when you’re ready</em>
          </h2>
          <p>No subscription. No surprise extras. See your feedback before deciding.</p>
        </div>
        <div className="pricing-grid">
          <article className="price-card">
            <span className="plan-eyebrow">THE FIRST STEP</span>
            <h3>CV review</h3>
            <p className="plan-description">Understand what’s working and what to improve.</p>
            <div className="price">
              ₦0 <span>always free</span>
            </div>
            <ul>
              <li>
                <Check />
                Transparent CVFix assessment
              </li>
              <li>
                <Check />
                Strengths and prioritised improvements
              </li>
              <li>
                <Check />A fact-preserving wording example
              </li>
              <li>
                <Check />
                Job-description keyword check
              </li>
              <li>
                <Check />
                No account or card required
              </li>
            </ul>
            <button className="button button-outline" onClick={onStart}>
              Check my CV free <ArrowRight size={17} />
            </button>
          </article>
          <article className="price-card featured">
            <span className="plan-eyebrow">
              <FileCheck2 size={15} /> THE NEXT STEP
            </span>
            <h3>Full CV package</h3>
            <p className="plan-description">Clean up, edit and download your complete CV.</p>
            <div className="price">
              {PRICE_LABEL} <span>one-time payment</span>
            </div>
            <ul>
              <li>
                <Check />
                Everything in the free review
              </li>
              <li>
                <Check />
                Conservative wording and formatting cleanup
              </li>
              <li>
                <Check />
                Your full work history and education preserved
              </li>
              <li>
                <Check />
                An editable CV and cover-letter draft
              </li>
              <li>
                <Check />
                Multi-page PDF and Word downloads
              </li>
            </ul>
            <button className="button button-primary" onClick={onStart}>
              Start with a free review <ArrowRight size={17} />
            </button>
            <span className="plan-note">Pay only after reviewing your feedback.</span>
          </article>
        </div>
        <p className="pricing-footnote">
          CVFix currently uses a transparent, rule-based text review and conservative editing—not a
          human review or an official ATS certification.{' '}
          <button className="inline-link" onClick={onSample}>
            Explore the fictional sample package.
          </button>
        </p>
      </div>
    </section>
  );
}
