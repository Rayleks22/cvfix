import { useState } from 'react';
import { ArrowUpRight, FileCheck2, Menu, X } from 'lucide-react';
import type { TabName } from '../types/index.ts';

export function Brand() {
  return (
    <span className="brand">
      <span className="brand-mark">
        <FileCheck2 size={21} strokeWidth={1.8} />
      </span>
      <span className="brand-word">
        cv<span>fix</span>
        <span className="brand-dot">.</span>
      </span>
    </span>
  );
}
export function Header({
  activeTab,
  onNavigate,
  onStart,
  onHowItWorks,
}: {
  activeTab: TabName;
  onNavigate: (tab: TabName) => void;
  onStart: () => void;
  onHowItWorks: () => void;
}) {
  const [open, setOpen] = useState(false);
  const go = (tab: TabName) => {
    setOpen(false);
    onNavigate(tab);
  };
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <a
            href="/"
            aria-label="CVFix home"
            onClick={(event) => {
              if (!event.ctrlKey && !event.metaKey) {
                event.preventDefault();
                go('scanner');
              }
            }}
          >
            <Brand />
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            <a
              className={activeTab === 'scanner' ? 'active' : ''}
              href="/"
              onClick={(event) => {
                event.preventDefault();
                go('scanner');
              }}
            >
              CV checker
            </a>
            <a
              href="/#how-it-works"
              onClick={(event) => {
                event.preventDefault();
                onHowItWorks();
              }}
            >
              How it works
            </a>
            <a
              className={activeTab === 'jobs' ? 'active' : ''}
              href="/jobs"
              onClick={(event) => {
                event.preventDefault();
                go('jobs');
              }}
            >
              Remote jobs
            </a>
            <a
              className={activeTab === 'pricing' ? 'active' : ''}
              href="/pricing"
              onClick={(event) => {
                event.preventDefault();
                go('pricing');
              }}
            >
              Pricing
            </a>
          </nav>
          <div className="header-actions">
            <button
              className="button button-primary header-cta"
              onClick={() => {
                setOpen(false);
                onStart();
              }}
            >
              Check my CV <ArrowUpRight size={16} />
            </button>
            <button
              className="icon-button mobile-menu-toggle"
              aria-label={open ? 'Close navigation' : 'Open navigation'}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {open && (
          <nav
            className="mobile-nav container"
            id="mobile-navigation"
            aria-label="Mobile navigation"
          >
            <a
              href="/"
              onClick={(event) => {
                event.preventDefault();
                go('scanner');
              }}
            >
              CV checker
            </a>
            <a
              href="/#how-it-works"
              onClick={(event) => {
                event.preventDefault();
                setOpen(false);
                onHowItWorks();
              }}
            >
              How it works
            </a>
            <a
              href="/jobs"
              onClick={(event) => {
                event.preventDefault();
                go('jobs');
              }}
            >
              Remote jobs
            </a>
            <a
              href="/pricing"
              onClick={(event) => {
                event.preventDefault();
                go('pricing');
              }}
            >
              Pricing
            </a>
            <a
              href="/contact"
              onClick={(event) => {
                event.preventDefault();
                go('contact');
              }}
            >
              Help & contact
            </a>
          </nav>
        )}
      </header>
    </>
  );
}
