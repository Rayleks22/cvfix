import React, { useEffect } from 'react';
import { Sparkles, ExternalLink, ArrowRight, ShieldCheck, Zap, DollarSign } from 'lucide-react';

interface AdBannerProps {
  slotType: 'horizontal-leaderboard' | 'in-feed-native' | 'sidebar-square' | 'fintech-sponsor';
  customClass?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ slotType, customClass = '' }) => {
  useEffect(() => {
    try {
      // @ts-ignore
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // Ad blocker or script not loaded yet
    }
  }, []);

  if (slotType === 'fintech-sponsor') {
    return (
      <div className={`w-full rounded-2xl bg-gradient-to-r from-blue-950/70 via-indigo-950/50 to-slate-900 border border-blue-500/30 p-5 text-white shadow-xl ${customClass}`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center shrink-0">
              <span className="text-2xl">💵</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Verified Fintech Partner
                </span>
                <span className="text-xs text-slate-400">Zero Maintenance Fee</span>
              </div>
              <h4 className="text-base font-bold text-white mt-1">
                Earning in USD or GBP? Get a Free Foreign Bank Account in 3 Minutes
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
      <div className={`w-full my-6 p-4 rounded-2xl glass-card border border-emerald-500/20 shadow-lg ${customClass}`}>
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-medium">
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> CAREER PRO-TIP
          </span>
          <span className="text-slate-400">Verified Remote Blueprint</span>
        </div>
        <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 p-4 rounded-xl border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left space-y-1">
            <p className="text-sm font-bold text-white">
              🚀 Stand Out to US Recruiters: Quantify Your Experience with the X-Y-Z Formula
            </p>
            <p className="text-xs text-slate-300">
              "Accomplished [X], as measured by [Y], by doing [Z]" increases callback rates by 300% on Taleo & Greenhouse.
            </p>
          </div>
          <a
            href="https://grey.co"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 transition-colors"
          >
            <span>Get Dollar Account</span> <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  // Horizontal Leaderboard Unit: Native High-Converting Partner Banner (Plus clean Google AdSense container)
  return (
    <div className={`w-full my-6 rounded-2xl bg-gradient-to-r from-slate-900/90 via-[#0a1420] to-slate-900/90 border border-white/10 p-4 text-white shadow-md ${customClass}`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Remote Partner
              </span>
              <span className="text-[11px] text-slate-400">Global Payouts</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-white mt-0.5">
              Receive USD Remote Salaries Directly into Nigerian Bank Accounts
            </p>
          </div>
        </div>

        <a
          href="https://geegpay.africa"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all active:scale-95"
        >
          <span>Get Geegpay USD Card</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Hidden/Active Google AdSense slot container for approved publishers */}
      <div className="hidden">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};
