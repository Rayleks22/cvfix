import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Info, LoaderCircle, RefreshCw } from 'lucide-react';
import { Header } from './components/Header.tsx';
import { HeroScanner } from './components/HeroScanner.tsx';
import { HomeSections } from './components/HomeSections.tsx';
import { AnalysisLoader } from './components/AnalysisLoader.tsx';
import { ResultsDashboard } from './components/ResultsDashboard.tsx';
import { PremiumUnlockedView } from './components/PremiumUnlockedView.tsx';
import { JobBoard } from './components/JobBoard.tsx';
import { PaystackCheckout } from './components/PaystackCheckout.tsx';
import { Footer } from './components/Footer.tsx';
import { LegalPage } from './components/LegalPage.tsx';
import { Pricing } from './components/Pricing.tsx';
import { api, clearPurchase, EMPTY_CONFIG, loadPurchase } from './lib/api.ts';
import { normaliseCV, reviewCV } from './lib/review.ts';
import { SAMPLE_CV, SAMPLE_JOB_DESCRIPTION, SAMPLE_ROLE } from './data/sampleCV.ts';
import { SAMPLE_PACKAGE } from './data/samplePackage.ts';
import type {
  PremiumPackage,
  PublicConfig,
  ReviewInput,
  ReviewResult,
  TabName,
  VerifiedPayment,
} from './types/index.ts';

const tabs: TabName[] = [
  'scanner',
  'jobs',
  'pricing',
  'privacy',
  'terms',
  'contact',
  'refunds',
  'methodology',
];
function tabFromPath(): TabName {
  const value = window.location.pathname.replace(/^\/|\/$/g, '');
  return tabs.includes(value as TabName) ? (value as TabName) : 'scanner';
}
const titles: Record<TabName, string> = {
  scanner: 'CVFix — A better CV for your next opportunity',
  jobs: 'Remote opportunities | CVFix',
  pricing: 'Simple, one-time pricing | CVFix',
  privacy: 'Privacy notice | CVFix',
  terms: 'Terms of service | CVFix',
  contact: 'Help & contact | CVFix',
  refunds: 'Payments & refunds | CVFix',
  methodology: 'How we review your CV | CVFix',
};
const emptyInput: ReviewInput = { cvText: '', targetRole: '', jobDescription: '' };

export function App() {
  const [activeTab, setActiveTab] = useState<TabName>(tabFromPath);
  const [stage, setStage] = useState<
    'idle' | 'loading' | 'review' | 'editor' | 'verifying' | 'recovery'
  >('idle');
  const [input, setInput] = useState<ReviewInput>(emptyInput);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [fullPackage, setFullPackage] = useState<PremiumPackage | null>(null);
  const [demo, setDemo] = useState(false);
  const [sourceEpoch, setSourceEpoch] = useState(0);
  const operation = useRef(0);
  const [config, setConfig] = useState<PublicConfig>(EMPTY_CONFIG);
  const [checkout, setCheckout] = useState(false);
  const [error, setError] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [paymentReference, setPaymentReference] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    api<PublicConfig>('/api/config')
      .then((value) => {
        if (alive) setConfig(value);
      })
      .catch(() => {
        if (alive) setConfig(EMPTY_CONFIG);
      });
    return () => {
      alive = false;
    };
  }, []);
  useEffect(() => {
    const pop = () => {
      setActiveTab(tabFromPath());
      setCheckout(false);
    };
    window.addEventListener('popstate', pop);
    return () => window.removeEventListener('popstate', pop);
  }, []);
  useEffect(() => {
    document.title = titles[activeTab];
    const path = activeTab === 'scanner' ? '/' : `/${activeTab}`;
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = `https://cvfix.com.ng${path}`;
  }, [activeTab]);

  function navigate(tab: TabName) {
    setCheckout(false);
    setActiveTab(tab);
    const path = tab === 'scanner' ? '/' : `/${tab}`;
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  function start() {
    operation.current += 1;
    setStage('idle');
    setError('');
    navigate('scanner');
    window.requestAnimationFrame(() =>
      document
        .getElementById('cv-checker')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
    );
  }
  function clearSession() {
    if (
      !window.confirm(
        'Clear the CV, edits and temporary checkout session in this tab? Download your documents first, and keep your payment reference if you have paid.',
      )
    )
      return;
    operation.current += 1;
    clearPurchase();
    setSourceEpoch((value) => value + 1);
    setInput(emptyInput);
    setResult(null);
    setFullPackage(null);
    setDemo(false);
    setPaymentReference(null);
    setPaymentError('');
    setError('');
    setStage('idle');
    window.history.replaceState({}, '', '/');
    navigate('scanner');
  }
  function howItWorks() {
    operation.current += 1;
    setStage('idle');
    navigate('scanner');
    window.requestAnimationFrame(() =>
      document
        .getElementById('how-it-works')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    );
  }
  async function runReview(value: ReviewInput) {
    const id = ++operation.current;
    setError('');
    setStage('loading');
    setFullPackage(null);
    setPaymentReference(null);
    setInput(value);
    setDemo(normaliseCV(value.cvText) === normaliseCV(SAMPLE_CV));
    navigate('scanner');
    // Allow the status to paint; no fabricated multi-stage progress or claims about live indices.
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    if (id !== operation.current) return;
    try {
      setResult(reviewCV(value));
      setStage('review');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Please check your CV text.');
      setStage('idle');
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  function sample() {
    void runReview({
      cvText: SAMPLE_CV,
      targetRole: SAMPLE_ROLE,
      jobDescription: SAMPLE_JOB_DESCRIPTION,
    });
  }
  function sampleEditor() {
    if (!demo || normaliseCV(input.cvText) !== normaliseCV(SAMPLE_CV)) return;
    setFullPackage({ ...SAMPLE_PACKAGE });
    setStage('editor');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  function selectJob(title: string) {
    operation.current += 1;
    setInput((current) => ({ ...current, targetRole: title, jobDescription: '' }));
    setStage('idle');
    navigate('scanner');
    window.requestAnimationFrame(() => document.getElementById('target-role')?.focus());
  }

  async function verifyPayment(cancelled?: () => boolean) {
    const id = ++operation.current;
    const stale = () => cancelled?.() || id !== operation.current;
    const pending = loadPurchase();
    const urlReference = new URLSearchParams(window.location.search).get('reference');
    setStage('verifying');
    setPaymentError('');
    try {
      if (!pending)
        throw new Error(
          'The secure checkout session is missing from this tab. If you paid, contact support with your Paystack reference. Do not pay again.',
        );
      setPaymentReference(pending.reference);
      if (urlReference && urlReference !== pending.reference)
        throw new Error(
          'The return reference does not match this tab’s checkout. Contact support rather than making another payment.',
        );
      if (pending.expiresAt <= Date.now())
        throw new Error(
          'This checkout session has expired. If you have already paid, contact support with your reference; do not pay again.',
        );
      const payment = await api<VerifiedPayment>('/api/payments/verify', {
        reviewToken: pending.reviewToken,
        reference: pending.reference,
      });
      if (
        !payment.verified ||
        payment.reference !== pending.reference ||
        !payment.package?.cvText ||
        payment.review?.method !== 'rules-v2' ||
        !payment.source?.cvText ||
        typeof payment.source.jobDescription !== 'string'
      )
        throw new Error(
          'The server did not confirm access to this CV package. Keep your reference and contact support.',
        );
      if (stale()) return;
      setInput(payment.source);
      setResult(payment.review);
      setFullPackage(payment.package);
      setDemo(false);
      setStage('editor');
      setActiveTab('scanner');
      window.history.replaceState({}, '', '/');
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (err) {
      if (!stale()) {
        setPaymentError(
          err instanceof Error
            ? err.message
            : 'Payment could not be verified. Keep your reference and retry.',
        );
        setStage('recovery');
      }
    }
  }
  useEffect(() => {
    const returning = new URLSearchParams(window.location.search).get('payment') === 'return';
    const pending = loadPurchase();
    if (returning || (pending && tabFromPath() === 'scanner')) {
      let cancelled = false;
      setActiveTab('scanner');
      void verifyPayment(() => cancelled);
      return () => {
        cancelled = true;
      };
    }
    return undefined;
  }, []);

  return (
    <div className="app-shell">
      <Header
        activeTab={activeTab}
        onNavigate={navigate}
        onStart={start}
        onHowItWorks={howItWorks}
      />
      <main id="main-content">
        {activeTab === 'scanner' && (
          <>
            {error && (
              <div className="container">
                <div className="form-error global-error" role="alert">
                  {error}
                </div>
              </div>
            )}
            {stage === 'idle' && (
              <>
                <HeroScanner
                  key={sourceEpoch}
                  input={input}
                  onInputChange={setInput}
                  onStartAnalysis={(value) => void runReview(value)}
                  onTrySample={sample}
                  isLoading={false}
                />
                <HomeSections onStart={start} onSample={sample} onNavigate={navigate} />
              </>
            )}
            {stage === 'loading' && <AnalysisLoader />}
            {stage === 'review' && result && (
              <ResultsDashboard
                result={result}
                onUnlockPremium={() => setCheckout(true)}
                onReset={() => {
                  setStage('idle');
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
                onSampleEditor={sampleEditor}
                onNavigate={navigate}
                demo={demo}
                unlocked={Boolean(fullPackage)}
                onEditor={() => setStage('editor')}
              />
            )}
            {stage === 'editor' && fullPackage && (
              <PremiumUnlockedView
                value={fullPackage}
                onChange={setFullPackage}
                onBack={() => setStage('review')}
                demo={demo}
                reference={paymentReference}
              />
            )}
            {stage === 'verifying' && (
              <section className="container payment-recovery" role="status">
                <LoaderCircle size={35} className="spin" />
                <h1>Checking your payment</h1>
                <p>
                  We’re verifying the amount and review reference directly with Paystack. Please
                  don’t pay again.
                </p>
              </section>
            )}
            {stage === 'recovery' && (
              <section className="container payment-recovery">
                <span className="section-icon warm">
                  <Info size={25} />
                </span>
                <h1>Let’s check before you try again</h1>
                <div className="form-error" role="alert">
                  {paymentError}
                </div>
                {paymentReference && (
                  <p>
                    Payment reference: <code>{paymentReference}</code>
                  </p>
                )}
                <div className="recovery-actions">
                  <button className="button button-primary" onClick={() => void verifyPayment()}>
                    <RefreshCw size={16} />
                    Retry verification
                  </button>
                  <button className="button button-outline" onClick={() => navigate('contact')}>
                    Get help <ArrowRight size={16} />
                  </button>
                </div>
                <button
                  className="text-button"
                  onClick={() => {
                    if (
                      window.confirm(
                        'Clear the temporary checkout session? If you were charged, keep your reference and contact support before paying again.',
                      )
                    ) {
                      operation.current += 1;
                      clearPurchase();
                      window.history.replaceState({}, '', '/');
                      setStage('idle');
                      setPaymentReference(null);
                    }
                  }}
                >
                  Clear this checkout session
                </button>
              </section>
            )}
          </>
        )}
        {activeTab === 'jobs' && <JobBoard onSelectJobToTailor={selectJob} />}
        {activeTab === 'pricing' && <Pricing onStart={start} onSample={sample} standalone />}
        {!['scanner', 'jobs', 'pricing'].includes(activeTab) && (
          <LegalPage tab={activeTab} config={config} onNavigate={navigate} />
        )}
      </main>
      {checkout && (
        <PaystackCheckout
          input={input}
          config={config}
          onCancel={() => setCheckout(false)}
          onNavigate={navigate}
        />
      )}
      <Footer
        onNavigate={navigate}
        config={config}
        onClearSession={clearSession}
        hasSession={Boolean(input.cvText || paymentReference)}
      />
    </div>
  );
}
export default App;
