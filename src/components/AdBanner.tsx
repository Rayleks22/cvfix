import React from 'react';
import { Sparkles, ExternalLink, ArrowRight } from 'lucide-react';

interface AdBannerProps {
  slotType: 'horizontal-leaderboard' | 'in-feed-native' | 'sidebar-square' | 'fintech-sponsor';
  customClass?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ slotType, customClass = '' }) => {
  if (slotType === 'fintech-sponsor') {
    return (
      <div className={`w-full rounded-2xl bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-900 border border-blue-500/20 p-5 text-white ${customClass}`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center shrink-0">
              <span className="text-2xl">💵</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Fintech Partner
                </span>
                <span className="text-xs text-slate-400">Zero Maintenance Fee</span>
              </div>
              <h4 className="text-base font-bold text-white mt-1">
                Earning in USD / GBP? Get a Free Foreign Bank Account in 3 Minutes
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Receive direct salary deposits from US/UK employers and withdraw directly to your Nigerian bank at top rates.
              </p>
            </div>
          </div>
          <a
            href="https://grey.co"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-all active:scale-95"
          >
            <span>Open Free USD Account</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  if (slotType === 'in-feed-native') {
    return (
      <div className={`w-full my-6 p-4 rounded-xl glass-card border border-white/10 ${customClass}`}>
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
          <span>SPONSORED RECOMMENDATION</span>
          <span className="text-emerald-400/80 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Verified Partner
          </span>
        </div>
        <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900/60 p-4 rounded-lg border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left">
            <p className="text-sm font-semibold text-white">
              🚀 Fast-Track Your Remote Job Search with Global Tech Certifications
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Top US recruiters prioritize candidates with verifiable cloud and project management credentials.
            </p>
          </div>
          <button className="shrink-0 text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
            Explore Courses <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // Standard Google AdSense / Ezoic placeholder unit (Zero CLS)
  return (
    <div className={`w-full my-6 min-h-[90px] rounded-xl bg-slate-900/40 border border-dashed border-white/10 flex flex-col items-center justify-center p-3 text-center ${customClass}`}>
      <span className="text-[10px] uppercase font-bold text-slate-600 tracking-widest">
        Advertisement Space (Google AdSense / Ezoic 728x90)
      </span>
      <p className="text-xs text-slate-500 mt-1">
        Supports programmatic in-page banners, video ads, and sponsored recruitment takeovers.
      </p>
    </div>
  );
};
