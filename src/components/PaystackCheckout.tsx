import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Info, LoaderCircle, LockKeyhole, X } from 'lucide-react';
import type { PublicConfig, ReviewInput, TabName } from '../types/index.ts';
import { api, savePurchase } from '../lib/api.ts';
import { PRICE_LABEL } from '../lib/constants.ts';

export function PaystackCheckout({
  input,
  config,
  onCancel,
  onNavigate,
}: {
  input: ReviewInput;
  config: PublicConfig;
  onCancel: () => void;
  onNavigate: (tab: TabName) => void;
}) {
  const [email, setEmail] = useState(
    input.cvText.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/)?.[0] || '',
  );
  const [consent, setConsent] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => {
      dialog?.close();
    };
  }, []);
  async function checkout(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    if (!config.paymentsEnabled) return;
    if (!consent) {
      setError('Please confirm your consent before checkout.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please provide a valid email for your payment receipt.');
      return;
    }
    setProcessing(true);
    try {
      const session = await api<{ reviewToken: string; expiresAt: number }>('/api/analyze-cv', {
        ...input,
        consent: true,
      });
      const payment = await api<{ authorizationUrl: string; reference: string }>(
        '/api/payments/initialize',
        { reviewToken: session.reviewToken, email },
      );
      savePurchase({
        reviewToken: session.reviewToken,
        reference: payment.reference,
        expiresAt: session.expiresAt,
      });
      window.location.assign(payment.authorizationUrl);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Checkout could not be started. Please try again.',
      );
      setProcessing(false);
    }
  }
  const navigate = (tab: TabName) => {
    onCancel();
    onNavigate(tab);
  };
  return (
    <dialog
      ref={ref}
      className="checkout-dialog"
      aria-labelledby="checkout-title"
      onCancel={(event) => {
        event.preventDefault();
        if (!processing) onCancel();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !processing) onCancel();
      }}
    >
      <div className="checkout-content">
        <button
          className="icon-button modal-close"
          aria-label="Close checkout"
          disabled={processing}
          onClick={onCancel}
        >
          <X size={21} />
        </button>
        <span className="checkout-icon">
          <LockKeyhole size={24} />
        </span>
        <span className="eyebrow small">YOUR NEXT STEP</span>
        <h2 id="checkout-title">
          A clearer CV.
          <br />
          <em>Ready to make yours.</em>
        </h2>
        <p>Get your complete editable CV, a cover-letter draft, and Word + PDF downloads.</p>
        <div className="checkout-price">
          <strong>{PRICE_LABEL}</strong>
          <span>One time. No subscription.</span>
        </div>
        <ul className="checkout-list">
          <li>
            <Check size={15} />
            Your actual names, dates and education preserved
          </li>
          <li>
            <Check size={15} />
            Conservative wording edits, no invented metrics
          </li>
          <li>
            <Check size={15} />
            Review, approve and export in this browser
          </li>
        </ul>
        {!config.paymentsEnabled ? (
          <>
            <div className="info-banner">
              <Info size={19} />
              <span>
                Paid downloads are not connected yet. No payment will be taken. The free review and
                fictional sample editor remain available.
              </span>
            </div>
            <button className="button button-primary full-width" onClick={onCancel}>
              Back to my free review <ArrowRight size={17} />
            </button>
          </>
        ) : (
          <form onSubmit={(event) => void checkout(event)} noValidate>
            {config.paymentMode === 'test' && (
              <div className="info-banner">
                <Info size={16} />
                <span>Paystack test mode. This checkout cannot process a live payment.</span>
              </div>
            )}
            <label htmlFor="checkout-email">Email for your Paystack receipt</label>
            <input
              id="checkout-email"
              type="email"
              autoComplete="email"
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              disabled={processing}
            />
            <p className="field-help">
              Documents download here after payment verification. We do not email your CV.
            </p>
            <label className="checkbox-label checkout-consent">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                disabled={processing}
              />
              <span>
                I agree to CVFix processing my CV to prepare this package. I have read the{' '}
                <button type="button" className="inline-link" onClick={() => navigate('privacy')}>
                  privacy notice
                </button>
                ,{' '}
                <button type="button" className="inline-link" onClick={() => navigate('terms')}>
                  terms
                </button>{' '}
                and{' '}
                <button type="button" className="inline-link" onClick={() => navigate('refunds')}>
                  payment policy
                </button>
                .
              </span>
            </label>
            {error && (
              <div className="form-error" role="alert">
                {error}
              </div>
            )}
            <button
              className="button button-primary full-width"
              type="submit"
              disabled={processing}
            >
              {processing ? (
                <>
                  <LoaderCircle size={17} className="spin" /> Preparing secure checkout…
                </>
              ) : (
                <>
                  Continue to Paystack <ArrowRight size={17} />
                </>
              )}
            </button>
            <p className="checkout-footer">
              <LockKeyhole size={12} /> CV text is not sent to Paystack. Payment is verified on our
              server.
            </p>
          </form>
        )}
      </div>
    </dialog>
  );
}
