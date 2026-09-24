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
    <footer className="border-t border-white/10 bg-[#060910] text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div 
              onClick={() => handleNav('scanner')}
              className="flex items-center space-x-2 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                <FileCheck className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-lg font-black text-white">
                CVFix<span className="text-emerald-400">.com.ng</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nigeria’s #1 AI-powered ATS diagnostic engine & dollar remote job bridge. Built to help African talent land global opportunities.
            </p>
          </div>

          {/* Col 2: Free Tools */}
          <div>
            <h5 className="text-xs font-bold uppercase text-white tracking-wider mb-3">
              Free AI Tools
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('scanner')} className="hover:text-emerald-400 transition-colors text-left">
                  Free ATS Score Checker
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('scanner')} className="hover:text-emerald-400 transition-colors text-left">
                  Naija-to-Global NYSC Reframe
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('scanner')} className="hover:text-emerald-400 transition-colors text-left">
                  Remote Dollar Salary Estimator
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('scanner')} className="hover:text-emerald-400 transition-colors text-left">
                  Harvard 1-Page ATS PDF Builder
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Remote Categories */}
          <div>
            <h5 className="text-xs font-bold uppercase text-white tracking-wider mb-3">
              Remote Job Tracks
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('jobs')} className="hover:text-emerald-400 transition-colors text-left">
                  Virtual Assistant Roles ($1,500/mo)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('jobs')} className="hover:text-emerald-400 transition-colors text-left">
                  Customer Support / CX ($1,400/mo)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('jobs')} className="hover:text-emerald-400 transition-colors text-left">
                  Data Annotation & AI ($1,800/mo)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('jobs')} className="hover:text-emerald-400 transition-colors text-left">
                  Software Engineering ($2,500+/mo)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Partner Disclosures */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase text-white tracking-wider mb-3">
              Trust & Security
            </h5>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Client-Side Private Processing</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
              Affiliate Disclosure: Some partner links (e.g. Grey, Geegpay) may earn a referral commission at zero cost to you.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-4">
          <p>© {new Date().getFullYear()} CVFix.com.ng. Built for Nigerian & African Global Ambitions.</p>
          <div className="flex items-center space-x-4">
            <span>Confidential & Secure</span>
            <span>•</span>
            <span>2026 International ATS Standards</span>
            <span>•</span>
            <span>Made with <Heart className="w-3 h-3 text-rose-500 inline fill-rose-500" /> for Nigeria</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
