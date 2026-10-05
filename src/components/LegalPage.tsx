import { ArrowRight, Info, Mail } from 'lucide-react';
import type { PublicConfig, TabName } from '../types/index.ts';

export function LegalPage({
  tab,
  config,
  onNavigate,
}: {
  tab: TabName;
  config: PublicConfig;
  onNavigate: (tab: TabName) => void;
}) {
  const support = config.supportEmail ? (
    <a href={`mailto:${config.supportEmail}`}>{config.supportEmail}</a>
  ) : (
    <span>
      Support contact is not configured yet. Paid checkout is unavailable until it is configured.
    </span>
  );
  const content: Record<
    string,
    { eyebrow: string; title: string; description: string; body: React.ReactNode }
  > = {
    privacy: {
      eyebrow: 'YOUR INFORMATION, EXPLAINED',
      title: 'Privacy, without the small-print surprises.',
      description:
        'This notice describes the behaviour of this version of CVFix. Free reviews and paid checkout do not process your CV in the same way.',
      body: (
        <>
          <h2>Free reviews stay in your browser</h2>
          <p>
            PDF and DOCX text extraction, the free rule-based review, and the sample editor run in
            your browser. Your CV and job description are not sent to a server for the free review.
            Fonts, document parsers, and the PDF worker are hosted with the app, not loaded from a
            third-party CDN.
          </p>
          <h2>What changes at paid checkout</h2>
          <p>
            Only after you select the full package and explicitly consent, your CV text, target
            role, and job description are sent over HTTPS to CVFix’s Cloudflare Pages function. The
            server encrypts this information into a temporary checkout token that expires after 24
            hours. The token is returned to your browser.
          </p>
          <p>
            The application does not write your CV to a database, analytics system, or application
            log. It decrypts the token when necessary to prepare and verify checkout and generate
            your paid document. Cloudflare handles the requests and may retain operational metadata
            under its own hosting policies; CVFix cannot promise that no infrastructure metadata
            exists.
          </p>
          <h2>What Paystack receives</h2>
          <p>
            Paystack receives your receipt email, payment amount, reference, and a randomly
            generated review identifier. Your CV and job description are not sent to Paystack. Card
            and bank details are entered on Paystack’s hosted checkout, not in CVFix. Paystack keeps
            transaction records under its own policies.
          </p>
          <h2>Temporary browser storage</h2>
          <p>
            To recover your document after payment, your encrypted checkout token, reference, and
            expiry are stored in this tab’s session storage. Closing the tab normally removes this
            storage; browser restore settings may retain it. The server rejects expired tokens. Your
            unencrypted CV, document edits, and final preview are kept in page memory and are not
            automatically saved. Download your documents before leaving.
          </p>
          <h2>No AI provider or advertising tracker receives your CV</h2>
          <p>
            This release uses deterministic rules and conservative grammatical edits. It does not
            submit your CV to Gemini, another AI provider, advertising partners, or a recruiter.
            Remote-job data comes from Remotive; opening an external job listing takes you to that
            provider’s website.
          </p>
          <h2>Control and deletion</h2>
          <p>
            Use “Clear this tab’s CV” in the footer to remove the current CV, edits and temporary
            checkout token. You can also clear a checkout session from the payment-recovery screen
            or clear this site’s browser storage. CVFix has no server-side CV record to delete in
            this implementation. Payment-provider records are separate. Do not include
            identity-document numbers, full home addresses, bank details, or other unnecessary
            sensitive information in your CV.
          </p>
          <h2>Questions and rights requests</h2>
          <p>
            {support} Explain your request without attaching your full CV initially. Payment
            references can help locate a transaction. This product notice does not replace the
            operator’s obligations under applicable Nigerian data-protection law.
          </p>
        </>
      ),
    },
    terms: {
      eyebrow: 'LET’S BE CLEAR ABOUT THE SERVICE',
      title: 'Terms of service.',
      description:
        'CVFix helps you present your real experience more clearly. It does not change who you are or guarantee a job.',
      body: (
        <>
          <h2>What the service provides</h2>
          <p>
            A free, rule-based text review; optional comparison against recognised terms in a
            supplied job description; and an optional paid document package with conservative
            wording edits, an editable CV, a cover-letter draft, and PDF/DOCX exports.
          </p>
          <p>
            The current package is not a human-written CV, recruiter approval, an official ATS
            simulation, or a salary assessment. It does not inspect the source file’s visual layout.
            No score guarantees parsing, interviews, placement, salary, or employment.
          </p>
          <h2>Your responsibility for the final document</h2>
          <p>
            Only upload a CV you are authorised to use. Confirm the extracted text, review all
            generated wording, and verify names, dates, titles, qualifications, skills, and
            achievements before exporting. Never use the editor to add false claims. Official job
            titles and credentials, including NYSC and HND, are preserved rather than replaced with
            invented equivalents.
          </p>
          <h2>Pricing and access</h2>
          <p>
            The free review costs ₦0. The optional full package costs ₦1,000 once, with no
            subscription. Paystack processes payment and the server verifies a successful NGN
            payment for that specific review before returning the paid package. Checkout is disabled
            when production settings or support contact are missing.
          </p>
          <p>
            The generated package can be recovered in the same browser tab for 24 hours using its
            encrypted checkout token and payment reference. Save your downloaded files. Your edits
            are not saved on a server, and editing a draft does not certify its accuracy.
          </p>
          <h2>Availability and third-party services</h2>
          <p>
            Connectivity, browser storage restrictions, file corruption, scans, encrypted files and
            payment-provider outages may affect use. External job listings can change or close, and
            a worldwide location label does not guarantee that Nigeria-based applicants qualify.
            Verify the employer’s requirements and never pay a recruiter for a listed job on our
            behalf.
          </p>
          <h2>Payments, issues and statutory rights</h2>
          <p>
            See the{' '}
            <button className="inline-link" onClick={() => onNavigate('refunds')}>
              payment help and refund policy
            </button>
            . Nothing here removes non-waivable rights under applicable law. For support: {support}
          </p>
        </>
      ),
    },
    refunds: {
      eyebrow: 'IF SOMETHING GOES WRONG',
      title: 'Payment help & refunds.',
      description:
        'Keep your reference. Retry verification. Don’t pay a second time just because a page did not load.',
      body: (
        <>
          <h2>Charged, but your document is locked?</h2>
          <p>
            Return to the same browser tab and use Retry verification. Payment is checked directly
            with Paystack on the server. A browser redirect alone is not proof of payment. Save your
            Paystack receipt and reference.
          </p>
          <p>
            The encrypted checkout session expires after 24 hours. If you have already paid and the
            session expired or was lost, contact support with your receipt email and reference
            before starting another paid checkout. Never send card details, banking passwords or
            one-time codes.
          </p>
          <h2>Download not working?</h2>
          <p>
            Confirm the accuracy checkbox, replace any name placeholder in the cover letter, and
            allow browser downloads. Try Word if PDF generation fails. Keep the page open while it
            prepares a download. The generated draft can be recovered within the session period;
            unsaved edits cannot.
          </p>
          <h2>When to request a refund</h2>
          <p>
            Contact support for a duplicate charge, an incorrect amount, or a paid package that
            could not be delivered. The operator should verify the transaction and offer recovery or
            a refund as appropriate. Refunds are handled through Paystack to the original payment
            method where supported.
          </p>
          <p>
            CVFix does not promise employment outcomes. A score or job-search result is not itself
            evidence of a defective payment. This policy does not limit any statutory refund rights.
            No fixed turnaround time is advertised until the operator can support it.
          </p>
          <h2>How to get help</h2>
          <p>
            {support} Include your payment reference, receipt email, a description of the issue and
            a screenshot if useful. Do not attach your full CV unless support specifically needs it
            and explains the handling.
          </p>
        </>
      ),
    },
    contact: {
      eyebrow: 'A LITTLE HELP WITH YOUR NEXT STEP',
      title: 'Let’s get you unstuck.',
      description: 'For review questions, failed downloads or a payment that needs attention.',
      body: (
        <>
          <div className="contact-box">
            <Mail size={25} />
            <div>
              <h2>Contact CVFix</h2>
              <p>{support}</p>
              {config.supportEmail && (
                <a className="button button-primary" href={`mailto:${config.supportEmail}`}>
                  Email support <ArrowRight size={16} />
                </a>
              )}
            </div>
          </div>
          {!config.supportEmail && (
            <div className="info-banner">
              <Info size={18} />
              <span>
                The operator must publish a working support email before accepting payments. You can
                still use the free review and complete sample editor.
              </span>
            </div>
          )}
          <h2>Payment questions</h2>
          <p>
            Have your Paystack reference and receipt email ready. Do not send passwords, card
            numbers, secret keys or one-time codes.{' '}
            <button className="inline-link" onClick={() => onNavigate('refunds')}>
              Read payment recovery instructions.
            </button>
          </p>
          <h2>CV questions</h2>
          <p>
            The score is a text-based guide, not a judgement of your ability or a hiring guarantee.
            If a recommendation is irrelevant, don’t add the suggested skill. Keep the real facts
            and provide a target role or job description for a more focused review.
          </p>
        </>
      ),
    },
    methodology: {
      eyebrow: 'NO MYSTERY NUMBER',
      title: 'How we review your CV.',
      description:
        'A versioned, rule-based text assessment—not a proprietary ATS score or a prediction of success.',
      body: (
        <>
          <h2>Four categories. Equal weight.</h2>
          <p>
            The CVFix score is the rounded average of four 0–100 category scores. There is no hidden
            salary, seniority, institution-prestige or nationality bonus or penalty.
          </p>
          <h3>1. Clear structure</h3>
          <p>
            25 points each for recognisable summary, experience or projects, education or
            certifications, and skills headings. This checks extracted text only; it cannot reliably
            detect columns, graphics, font sizes or parser compatibility from the original layout.
          </p>
          <h3>2. Clear wording</h3>
          <p>
            For identifiable experience bullets, start at 100. Deduct up to 60 points proportionally
            for responsibility-led bullets, up to 20 for generic phrases (five per phrase), and up
            to 20 proportionally for bullets over 40 words. No identifiable bullets scores 40. This
            is a limited rule, not a full language assessment.
          </p>
          <h3>3. Specific detail</h3>
          <p>
            For identifiable experience bullets, start at 35 and add up to 65 based on the share
            that mention supplied quantities, tools, methods or scope. No identifiable bullets
            scores 20. Numbers in dates or qualifications are not automatically counted as
            achievement metrics. We do not generate percentages or encourage unverifiable claims.
          </p>
          <h3>4. Core details or job keywords</h3>
          <p>
            Without a usable job description, award 25 points each for a recognisable name, email,
            phone and education/certifications heading. With a job description containing recognised
            skill terms, use the percentage of those terms that also appear in the CV. The
            controlled vocabulary is limited; spelling, synonyms and uncommon disciplines can be
            missed.
          </p>
          <h2>Where keyword suggestions come from</h2>
          <p>
            With a job description, only recognised skills mentioned there are compared. Without
            one, a narrow role-family dictionary can suggest optional ideas. Those ideas are not a
            scored gap, are never automatically inserted, and are not evidence that every employer
            requires that skill.
          </p>
          <h2>Editing and its limits</h2>
          <p>
            The current editor only applies a small set of conservative grammatical transformations
            to supplied experience bullets, such as “Responsible for managing…” becoming “Managed…”.
            It retains the complete CV, including employers, dates, education, certificates and
            official titles. The generated cover letter is a simple draft. If no safe transformation
            applies, the source text remains intact.
          </p>
          <p>
            This release deliberately disables the previous unvalidated AI generation path. No AI
            provider receives your CV. Rules and tests are versioned as <code>rules-v2</code>; any
            future AI-assisted feature needs separate disclosure, consent, factual-grounding
            controls and tests before being enabled.
          </p>
          <h2>What the score cannot tell you</h2>
          <p>
            It does not verify employment, achievements, certificates, job availability, salary,
            employer requirements, spelling, all document layouts, or every ATS parser. It is not
            affiliated with Workday, Greenhouse, Taleo, Harvard or Stanford. Use the findings as
            practical prompts, not a guarantee.
          </p>
        </>
      ),
    },
  };
  const page = content[tab] || content.contact;
  return (
    <section className="container legal-section">
      <div className="section-heading">
        <span className="eyebrow">{page.eyebrow}</span>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </div>
      <article className="legal-content">{page.body}</article>
    </section>
  );
}
