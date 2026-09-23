import React, { useState, useEffect } from 'react';
import { Sparkles, FileSearch, Globe2, ShieldCheck, DollarSign } from 'lucide-react';
import { AdBanner } from './AdBanner';

interface AnalysisLoaderProps {
  onComplete: () => void;
}

const STEPS = [
  { icon: FileSearch, text: "Extracting text & testing Taleo / Workday ATS layout parseability..." },
  { icon: Globe2, text: "Applying Naija-to-Global translation (NYSC, local degrees, banking context)..." },
  { icon: DollarSign, text: "Benchmarking profile against live US/UK remote dollar roles ($1,200 - $2,500/mo)..." },
  { icon: ShieldCheck, text: "Generating diagnostic scorecard, 3 critical flags & sample bullet upgrades..." }
];

export const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          clearInterval(interval);
          setTimeout(onComplete, 600);
          return 100;
        }
        return prev + 3;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    if (progress > 25 && progress <= 50) setCurrentStep(1);
    else if (progress > 50 && progress <= 75) setCurrentStep(2);
    else if (progress > 75) setCurrentStep(3);
  }, [progress]);

  return (
    <div className="max-w-2xl mx-auto my-12 px-4 text-center">
      {/* Radar Animation */}
      <div className="relative w-28 h-28 mx-auto mb-8 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping"></div>
        <div className="absolute inset-2 rounded-full border border-emerald-400/40 animate-pulse"></div>
        <div className="w-20 h-20 rounded-full bg-emerald-950/80 border border-emerald-400/60 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Sparkles className="w-9 h-9 text-emerald-400 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
      </div>

      <h3 className="text-2xl font-extrabold text-white">
        Analyzing Your CV with Gemini AI...
      </h3>
      <p className="text-sm text-slate-400 mt-1">
        Benchmarking against 12,000+ verified remote hiring benchmarks.
      </p>

      {/* Progress Bar */}
      <div className="mt-8 max-w-md mx-auto">
        <div className="w-full bg-slate-800/80 rounded-full h-3 p-0.5 border border-white/10 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs text-slate-500 mt-2 font-mono">
          <span>RUNNING EDGE ATS ENGINE</span>
          <span className="text-emerald-400 font-bold">{progress}%</span>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="mt-8 space-y-3 text-left max-w-lg mx-auto">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = currentStep > idx;
          const isCurrent = currentStep === idx;

          return (
            <div 
              key={idx}
              className={`p-3 rounded-xl border flex items-center space-x-3 transition-all ${
                isDone 
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' 
                  : isCurrent 
                  ? 'bg-slate-900 border-emerald-500/50 text-white shadow-md' 
                  : 'bg-slate-900/40 border-white/5 text-slate-500 opacity-60'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                isDone ? 'bg-emerald-500/20 text-emerald-400' : isCurrent ? 'bg-emerald-500/30 text-emerald-300 animate-pulse' : 'bg-slate-800 text-slate-500'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium leading-relaxed">{step.text}</span>
            </div>
          );
        })}
      </div>

      {/* In-Flight High Viewability Ad */}
      <div className="mt-8">
        <AdBanner slotType="in-feed-native" />
      </div>
    </div>
  );
};
