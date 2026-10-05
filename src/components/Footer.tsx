import { ArrowUpRight } from 'lucide-react';
import type { PublicConfig, TabName } from '../types/index.ts';
import { Brand } from './Header.tsx';

export function Footer({
  onNavigate,
  config,
  onClearSession,
  hasSession,
}: {
  onNavigate: (tab: TabName) => void;
  config: PublicConfig;
  onClearSession: () => void;
  hasSession: boolean;
}) {
  const link = (tab: TabName, label: string) => (
    <a
      href={tab === 'scanner' ? '/' : `/${tab}`}
      onClick={(event) => {
        event.preventDefault();
        onNavigate(tab);
      }}
    >
      {label}
    </a>
  );
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <a
              href="/"
              onClick={(event) => {
                event.preventDefault();
                onNavigate('scanner');
              }}
              aria-label="CVFix home"
            >
              <Brand />
            </a>
            <p>
              Clearer CVs.
              <br />
              Real experience. New possibilities.
            </p>
            <span className="footer-made">Made for Nigerian jobseekers.</span>
          </div>
          <div className="footer-links">
            <span className="footer-label">TAKE YOUR NEXT STEP</span>
            {link('scanner', 'Free CV review')}
            {link('pricing', 'Pricing')}
            {link('jobs', 'Remote opportunities')}
            {link('methodology', 'How we review your CV')}
          </div>
          <div className="footer-links">
            <span className="footer-label">THE IMPORTANT DETAILS</span>
            {link('privacy', 'Privacy notice')}
            {link('terms', 'Terms of service')}
            {link('refunds', 'Payments & refunds')}
            {link('contact', 'Help & contact')}
          </div>
          <div className="footer-contact">
            <span className="footer-label">A LITTLE HELP?</span>
            <p>
              Questions about your review
              <br />
              or a payment?
            </p>
            {config.supportEmail ? (
              <a className="footer-email" href={`mailto:${config.supportEmail}`}>
                {config.supportEmail} <ArrowUpRight size={15} />
              </a>
            ) : (
              <button className="text-button" onClick={() => onNavigate('contact')}>
                Visit help & contact <ArrowUpRight size={15} />
              </button>
            )}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} CVFix.com.ng</span>
          {hasSession && (
            <button className="inline-link clear-session" onClick={onClearSession}>
              Clear this tab’s CV
            </button>
          )}
          <span>Free review in your browser. Your story stays yours.</span>
          <span>Not affiliated with any ATS provider.</span>
        </div>
      </div>
    </footer>
  );
}
