import React from 'react';
import { FileCheck, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'scanner' | 'jobs' | 'pricing') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (tab: 'scanner' | 'jobs' | 'pricing') => {
    onNavigate(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-400 text-xs py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div 
              onClick={() => handleNav('scanner')}
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-700 flex items-center justify-center text-white group-hover:bg-teal-600 transition-colors">
                <FileCheck className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-lg font-extrabold text-white">
                CVFix<span className="text-teal-400">.com.ng</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nigeria’s leading ATS diagnostic engine & international career accelerator. Helping African talent position their experience for global remote roles.
            </p>
          </div>

          {/* Col 2: Free Tools */}
          <div>
            <h5 className="text-xs font-bold uppercase text-white tracking-wider mb-3.5">
              Career Diagnostics
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('scanner')} className="hover:text-teal-300 transition-colors text-left">
                  Free ATS Compatibility Scanner
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('scanner')} className="hover:text-teal-300 transition-colors text-left">
                  Naija-to-Global NYSC Reframe
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('scanner')} className="hover:text-teal-300 transition-colors text-left">
                  International Dollar Salary Estimator
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('scanner')} className="hover:text-teal-300 transition-colors text-left">
                  Single-Page Harvard ATS PDF Template
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Remote Categories */}
          <div>
            <h5 className="text-xs font-bold uppercase text-white tracking-wider mb-3.5">
              Remote Job Tracks
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('jobs')} className="hover:text-teal-300 transition-colors text-left">
                  Virtual Assistant ($1,500/mo)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('jobs')} className="hover:text-teal-300 transition-colors text-left">
                  Customer Experience & CX ($1,400/mo)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('jobs')} className="hover:text-teal-300 transition-colors text-left">
                  AI Data Annotation ($1,800/mo)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('jobs')} className="hover:text-teal-300 transition-colors text-left">
                  Software Engineering ($2,500+/mo)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Partner Disclosures */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase text-white tracking-wider mb-3.5">
              Security & Compliance
            </h5>
            <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Client-Side Privacy Guaranteed</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              Affiliate Notice: Some partner integrations (e.g. Grey, Geegpay) may earn a referral fee at zero cost to you.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-4">
          <p>© {new Date().getFullYear()} CVFix.com.ng. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span>Confidential & SSL Encrypted</span>
            <span>•</span>
            <span>Workday, Taleo & Greenhouse Compliant</span>
            <span>•</span>
            <span>Built for Nigerian Global Talent</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
