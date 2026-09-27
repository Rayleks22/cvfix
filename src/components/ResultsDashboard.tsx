import React, { useState } from 'react';
import { 
  Sparkles, AlertCircle, AlertTriangle, CheckCircle2, DollarSign, 
  ArrowRight, Briefcase, Zap, Lock, RefreshCw, ChevronDown, ChevronUp, Star, ShieldCheck, Award
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
    if (score >= 80) return 'text-emerald-700 stroke-emerald-700';
    if (score >= 60) return 'text-amber-600 stroke-amber-600';
    return 'text-rose-600 stroke-rose-600';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-bold uppercase tracking-wider">
              Diagnostic Audit Report
            </span>
            <span className="text-xs text-slate-500">• 2026 International Benchmark</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Executive ATS Score & Career Evaluation
          </h2>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Scan Another Document</span>
          </button>

          {!isUnlocked && (
            <button
              onClick={onUnlockPremium}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-800 hover:bg-teal-900 shadow-sm flex items-center gap-2 active:scale-95 transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Unlock Full CV (₦1,000)</span>
            </button>
          )}
        </div>
      </div>

      {/* Top Banner Unit */}
      <AdBanner slotType="horizontal-leaderboard" />

      {/* Section 1: Scorecards & Valuation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main ATS Score Dial */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center border border-slate-200 shadow-sm">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-slate-100"
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
              <span className="text-4xl font-black text-slate-900">{result.atsScore}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ATS Score</span>
            </div>
          </div>

          <div className="mt-4">
            <span className="px-3 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
              Grade: {result.grade}
            </span>
            <p className="text-xs text-slate-600 mt-2 font-medium">
              {result.summaryRating}
            </p>
          </div>
        </div>

        {/* 4 Diagnostic Pillars */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Diagnostic Pillars Breakdown
          </h4>

          <div className="space-y-3.5 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700">Taleo / Workday ATS Parseability</span>
                <span className="text-teal-800 font-bold">{result.scores.parseability}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-teal-700 h-full rounded-full" style={{ width: `${result.scores.parseability}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700">Quantifiable Metrics & Impact (X-Y-Z)</span>
                <span className="text-amber-700 font-bold">{result.scores.impactMetrics}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-600 h-full rounded-full" style={{ width: `${result.scores.impactMetrics}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700">AI-Slop & Buzzword Filter Score</span>
                <span className="text-teal-800 font-bold">{result.scores.buzzwordSlopPenalty}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-teal-600 h-full rounded-full" style={{ width: `${result.scores.buzzwordSlopPenalty}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-700">Naija-to-Global Context Reframe</span>
                <span className="text-teal-800 font-bold">{result.scores.naijaToGlobalTranslation}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-teal-700 h-full rounded-full" style={{ width: `${result.scores.naijaToGlobalTranslation}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Dollar Valuation & Matched Role */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-teal-200/80 bg-gradient-to-br from-teal-50/40 via-white to-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider">
              <DollarSign className="w-4 h-4" />
              <span>International Salary Benchmark</span>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-slate-900">
                {result.candidateProfile.estimatedRemoteSalaryUSD}
              </span>
              <p className="text-xs font-semibold text-teal-800 mt-1">
                ≈ {result.candidateProfile.estimatedSalaryNaira}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Detected Career Path:</span>
              <span className="font-bold text-slate-900">{result.candidateProfile.detectedRole}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-[11px] text-slate-500">
              💡 Profiles scoring 90+ on ATS command 40% higher remote salary offers.
            </span>
          </div>
        </div>
      </div>

      {/* Section 2: Critical Red Flags & Fixes */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
              Diagnostic Findings
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
              3 Critical Structural Flaws Identified
            </h3>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Click cards to review Before vs. After
          </span>
        </div>

        <div className="space-y-3.5">
          {result.criticalFlags.map((flag, idx) => {
            const isExpanded = expandedFlagIndex === idx;
            return (
              <div 
                key={idx}
                className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all shadow-sm"
              >
                <div 
                  onClick={() => setExpandedFlagIndex(isExpanded ? null : idx)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      flag.type === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {flag.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{flag.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{flag.description}</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-slate-700">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50/50">
                    <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200/80">
                      <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 block mb-1">
                        ❌ Flawed Original
                      </span>
                      <p className="text-slate-700 italic font-mono leading-relaxed">
                        "{flag.before}"
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200/80">
                      <span className="text-[10px] font-black uppercase tracking-wider text-teal-900 block mb-1">
                        ✨ Optimized Metric-Driven Fix
                      </span>
                      <p className="text-teal-950 font-mono leading-relaxed font-semibold">
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
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Star className="w-4 h-4 fill-teal-800" />
            <span>Sample Line-by-Line Upgrade</span>
          </div>
          <h4 className="text-base font-bold text-slate-900 mb-4">
            Translating Nigerian Experience to Global Standards
          </h4>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 block uppercase mb-1">Original Bullet:</span>
              <p className="text-slate-700 italic">"{result.freeSampleRewrite.originalBullet}"</p>
            </div>
            <div className="p-3.5 rounded-xl bg-teal-50/80 border border-teal-200">
              <span className="text-[10px] font-bold text-teal-900 block uppercase mb-1">AI Optimized (X-Y-Z Formula):</span>
              <p className="text-teal-950 font-bold">"{result.freeSampleRewrite.upgradedBullet}"</p>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              💡 <strong>Recruiter Rationale:</strong> {result.freeSampleRewrite.explanation}
            </p>
          </div>
        </div>

        {/* Missing Keywords Cloud */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Zap className="w-4 h-4" />
              <span>ATS Keyword Gap Analysis</span>
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">
              Keywords Missing from Your CV
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Adding these industry skill tokens significantly increases interview callback rates on Workday and Greenhouse.
            </p>

            <div className="flex flex-wrap gap-2">
              {result.missingKeywords.map((kw, i) => (
                <span 
                  key={i}
                  className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5"
                >
                  <span className="text-teal-700">+</span> {kw}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Our ₦1,000 full rewrite automatically weaves these missing keywords into your bullet points.
            </span>
          </div>
        </div>
      </div>

      {/* Section 4: Matched Jobs */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
              Live Job Market Grounding
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
              Live Remote Roles Matching Your Background
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {result.matchedRemoteJobs.map((job, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-xl bg-slate-50/70 border border-slate-200 hover:border-teal-600 transition-all flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-500 font-medium">{job.companyType}</span>
                  <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold text-[10px]">
                    {job.matchPercentage}% Match
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">{job.title}</h4>
                <div className="my-3">
                  <span className="text-base font-extrabold text-teal-800">{job.salaryUSD}</span>
                  <span className="text-xs text-slate-500 block">≈ {job.salaryNaira}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{job.whyFit}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200">
                <button
                  onClick={onUnlockPremium}
                  className="w-full py-2 rounded-lg bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
                >
                  <span>Tailor My CV for This Role</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Fintech Sponsor Banner */}
      <AdBanner slotType="fintech-sponsor" />

      {/* Section 6: ₦1,000 Unlock Banner */}
      {!isUnlocked && (
        <div className="rounded-2xl p-8 bg-slate-900 text-white shadow-lg text-center sm:text-left">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                <span>Complete Executive Career Package</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Unlock 1-Click Line-by-Line CV Overhaul + Cover Letter
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Receive 20+ upgraded metric-driven bullet points, full Naija-to-Global translation, a tailored cover letter, and a clean Harvard-format ATS PDF.
              </p>
            </div>

            <div className="shrink-0 text-center sm:text-right">
              <div className="mb-3">
                <span className="text-xs text-slate-400 line-through">₦10,000</span>
                <div className="text-3xl sm:text-4xl font-black text-white">₦1,000</div>
                <span className="text-[11px] text-teal-300 font-semibold">one-time payment (~$0.75)</span>
              </div>
              <button
                onClick={onUnlockPremium}
                className="px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Lock className="w-4 h-4" />
                <span>Unlock for ₦1,000</span>
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
