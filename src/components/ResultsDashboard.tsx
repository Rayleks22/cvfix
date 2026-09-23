import React, { useState } from 'react';
import { 
  Sparkles, AlertCircle, AlertTriangle, CheckCircle2, DollarSign, 
  ArrowRight, Briefcase, Zap, Lock, RefreshCw, ChevronDown, ChevronUp, Star
} from 'lucide-react';
import { AnalysisResult } from '../types';
import { AdBanner } from './AdBanner';
import { ViralScoreCard } from './ViralScoreCard';

interface ResultsDashboardProps {
  result: AnalysisResult;
  onUnlockPremium: () => void;
  onReset: () => void;
  isUnlocked: boolean;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  result,
  onUnlockPremium,
  onReset,
  isUnlocked,
}) => {
  const [expandedFlagIndex, setExpandedFlagIndex] = useState<number | null>(0);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 stroke-emerald-400';
    if (score >= 60) return 'text-amber-400 stroke-amber-400';
    return 'text-rose-400 stroke-rose-400';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
            Diagnostic Health Report
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-1">
            Your ATS Audit & Remote Valuation
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-white/10 flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Scan Another CV</span>
          </button>

          {!isUnlocked && (
            <button
              onClick={onUnlockPremium}
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-600/30 flex items-center gap-2 active:scale-95 transition-all animate-bounce"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Unlock Full CV (₦1,000)</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Ad Unit (Leaderboard) */}
      <AdBanner slotType="horizontal-leaderboard" />

      {/* Section 1: Scorecards & Valuation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main ATS Score Dial */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center border border-white/10 relative overflow-hidden">
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* SVG Circle Progress */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-slate-800"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className={getScoreColor(result.atsScore)}
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 * (1 - result.atsScore / 100)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white">{result.atsScore}</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ATS Score</span>
            </div>
          </div>

          <div className="mt-4">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Grade: {result.grade}
            </span>
            <p className="text-xs text-slate-300 mt-2 font-medium">
              {result.summaryRating}
            </p>
          </div>
        </div>

        {/* 4 Diagnostic Pillars */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between space-y-4">
          <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            Diagnostic Pillars Breakdown
          </h4>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Taleo/Workday ATS Parseability</span>
                <span className="text-emerald-400">{result.scores.parseability}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${result.scores.parseability}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Quantifiable Impact & Metrics (X-Y-Z)</span>
                <span className="text-amber-400">{result.scores.impactMetrics}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: `${result.scores.impactMetrics}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">AI-Slop & Buzzword Filter Score</span>
                <span className="text-teal-400">{result.scores.buzzwordSlopPenalty}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-teal-400 h-full rounded-full" style={{ width: `${result.scores.buzzwordSlopPenalty}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-300">Naija-to-Global Context Reframe</span>
                <span className="text-emerald-400">{result.scores.naijaToGlobalTranslation}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${result.scores.naijaToGlobalTranslation}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Dollar Valuation & Matched Role */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <DollarSign className="w-4 h-4" />
              <span>Estimated Remote Valuation</span>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-black text-white">
                {result.candidateProfile.estimatedRemoteSalaryUSD}
              </span>
              <p className="text-xs font-semibold text-emerald-300 mt-1">
                ≈ {result.candidateProfile.estimatedSalaryNaira}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 text-xs text-slate-300">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Detected Career Path:</span>
              <span className="font-bold text-white">{result.candidateProfile.detectedRole}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <span className="text-[11px] text-slate-400">
              💡 Upgrading to 90+ ATS unlocks higher salary tiers in US/UK remote companies.
            </span>
          </div>
        </div>
      </div>

      {/* Section 2: Critical Red Flags & Fixes */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              Diagnostic Audit
            </span>
            <h3 className="text-2xl font-extrabold text-white mt-0.5">
              3 Critical Flaws Hurting Your Callback Rate
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Click each card to view Before vs. After
          </span>
        </div>

        <div className="space-y-4">
          {result.criticalFlags.map((flag, idx) => {
            const isExpanded = expandedFlagIndex === idx;
            return (
              <div 
                key={idx}
                className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden transition-all"
              >
                <div 
                  onClick={() => setExpandedFlagIndex(isExpanded ? null : idx)}
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      flag.type === 'error' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {flag.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{flag.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{flag.description}</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-white">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/20">
                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 block mb-1">
                        ❌ Current Flawed Version
                      </span>
                      <p className="text-slate-300 italic font-mono leading-relaxed">
                        "{flag.before}"
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block mb-1">
                        ✨ Optimized High-Impact Fix
                      </span>
                      <p className="text-emerald-200 font-mono leading-relaxed">
                        "{flag.after}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Free Sample Rewrite & Missing Keywords */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Free Sample Rewrite */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/30">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Star className="w-4 h-4 fill-emerald-400" />
            <span>Free Sample Bullet-Point Upgrade</span>
          </div>
          <h4 className="text-lg font-bold text-white mb-4">
            See How Your Experience Converts to Global Standards
          </h4>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-white/10">
              <span className="text-[10px] font-bold text-slate-500 block uppercase mb-1">Original Bullet:</span>
              <p className="text-slate-300 italic">"{result.freeSampleRewrite.originalBullet}"</p>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
              <span className="text-[10px] font-bold text-emerald-400 block uppercase mb-1">AI Optimized (X-Y-Z Formula):</span>
              <p className="text-emerald-200 font-bold">"{result.freeSampleRewrite.upgradedBullet}"</p>
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              💡 <strong>Why this works:</strong> {result.freeSampleRewrite.explanation}
            </p>
          </div>
        </div>

        {/* Missing Keywords Cloud */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Zap className="w-4 h-4" />
              <span>ATS Keyword Gap Analysis</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">
              Keywords Missing from Your CV
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Adding these high-intent industry terms will dramatically boost your match score against international applicant tracking systems.
            </p>

            <div className="flex flex-wrap gap-2">
              {result.missingKeywords.map((kw, i) => (
                <span 
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>+</span> {kw}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <span className="text-xs text-slate-400">
              Our ₦1,000 full rewrite injects all missing keywords naturally into your experience.
            </span>
          </div>
        </div>
      </div>

      {/* Section 4: Live Matched Dollar Remote Jobs */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Live Job Market Grounding
            </span>
            <h3 className="text-2xl font-extrabold text-white mt-0.5">
              Remote Roles Matching Your Profile Right Now
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {result.matchedRemoteJobs.map((job, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400">{job.companyType}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                    {job.matchPercentage}% Match
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white leading-snug">{job.title}</h4>
                <div className="my-3">
                  <span className="text-base font-extrabold text-emerald-400">{job.salaryUSD}</span>
                  <span className="text-xs text-slate-400 block">≈ {job.salaryNaira}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{job.whyFit}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10">
                <button
                  onClick={onUnlockPremium}
                  className="w-full py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition-all flex items-center justify-center gap-1"
                >
                  <span>Tailor My CV for This Role</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Fintech Dollar Account Affiliate CTA */}
      <AdBanner slotType="fintech-sponsor" />

      {/* Section 6: Irresistible ₦1,000 Micro-Upsell Banner */}
      {!isUnlocked && (
        <div className="glass-card rounded-3xl p-8 border-2 border-emerald-500/40 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 relative overflow-hidden text-center sm:text-left">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-extrabold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Complete Career Transformation Package</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Get Your Complete 100% Rewritten CV + Cover Letter
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Unlock all 20+ upgraded bullet points, the full Naija-to-Global translation, a tailored 1-page cover letter, and a 1-click ATS-compliant PDF export.
              </p>
            </div>

            <div className="shrink-0 text-center">
              <div className="mb-2">
                <span className="text-xs text-slate-500 line-through">₦10,000</span>
                <div className="text-4xl font-black text-emerald-400">₦1,000</div>
                <span className="text-[11px] text-emerald-200">one-time payment</span>
              </div>
              <button
                onClick={onUnlockPremium}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-sm shadow-xl shadow-emerald-600/40 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Lock className="w-4 h-4" />
                <span>Unlock Full CV (₦1,000)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section 7: Viral Scorecard */}
      <ViralScoreCard
        atsScore={result.atsScore}
        grade={result.grade}
        detectedRole={result.candidateProfile.detectedRole}
        estimatedRemoteSalaryUSD={result.candidateProfile.estimatedRemoteSalaryUSD}
        estimatedSalaryNaira={result.candidateProfile.estimatedSalaryNaira}
      />
    </div>
  );
};
