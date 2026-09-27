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
      <div className={`w-full rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 shadow-sm ${customClass}`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
              <span className="text-2xl">💵</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                  Global Banking Partner
                </span>
                <span className="text-xs text-slate-500">Zero Account Maintenance Fee</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                Earning in USD or GBP? Open a Free Foreign Bank Account in 3 Minutes
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Receive direct salary deposits from US/UK employers and withdraw directly to your Nigerian bank at top exchange rates.
              </p>
            </div>
          </div>
          <a
            href="https://grey.co"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
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
      <div className={`w-full my-6 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm ${customClass}`}>
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2 font-medium">
          <span className="text-teal-800 font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> EXECUTIVE CAREER TIP
          </span>
          <span className="text-slate-400">Recruiter Blueprint</span>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left space-y-1">
            <p className="text-xs sm:text-sm font-bold text-slate-900">
              🚀 Stand Out to US Recruiters: Quantify Your Experience with Google's X-Y-Z Formula
            </p>
            <p className="text-xs text-slate-600">
              "Accomplished [X], as measured by [Y], by doing [Z]" increases interview callback rates by up to 300% on Workday & Greenhouse.
            </p>
          </div>
          <a
            href="https://grey.co"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-xs font-bold text-teal-800 hover:text-teal-900 flex items-center gap-1 px-3 py-2 rounded-lg bg-white border border-slate-200 shadow-sm transition-colors"
          >
            <span>Get USD Account</span> <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  // Horizontal Leaderboard Unit
  return (
    <div className={`w-full my-6 rounded-2xl bg-white border border-slate-200 p-4 text-slate-900 shadow-sm ${customClass}`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-teal-800" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                Remote Partner
              </span>
              <span className="text-[11px] text-slate-500">Global Direct Payouts</span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
              Receive USD Remote Salaries Directly into Nigerian Bank Accounts
            </p>
          </div>
        </div>

        <a
          href="https://geegpay.africa"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
        >
          <span>Get Geegpay USD Card</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

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
