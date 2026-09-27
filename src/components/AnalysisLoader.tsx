import React, { useState, useEffect } from 'react';
import { FileSearch, Globe2, ShieldCheck, DollarSign, CheckCircle2 } from 'lucide-react';
import { AdBanner } from './AdBanner';

interface AnalysisLoaderProps {
  onComplete: () => void;
}

const STEPS = [
  { icon: FileSearch, text: "Parsing document structure against Workday / Taleo ATS layout guidelines..." },
  { icon: Globe2, text: "Applying Naija-to-Global reframe (NYSC, polytechnic/university credentials, local banking)..." },
  { icon: DollarSign, text: "Benchmarking profile against live US/UK remote salary indices ($1,200 - $2,500/mo)..." },
  { icon: ShieldCheck, text: "Compiling executive scorecard, 3 critical flags & sample bullet upgrades..." }
];

export const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 3;
      });
    }, 90);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    if (progress > 25 && progress <= 50) setCurrentStep(1);
    else if (progress > 50 && progress <= 75) setCurrentStep(2);
    else if (progress > 75) setCurrentStep(3);
  }, [progress]);

  return (
    <div className="max-w-2xl mx-auto my-14 px-4 text-center">
      {/* Verification Header */}
      <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-center mx-auto mb-4 text-teal-800 shadow-sm">
        <ShieldCheck className="w-7 h-7" />
      </div>

      <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
        Performing Executive ATS Diagnostic
      </h3>
      <p className="text-sm text-slate-500 mt-1">
        Evaluating line-by-line metrics against 12,000+ verified recruiter rules.
      </p>

      {/* Progress Bar */}
      <div className="mt-8 max-w-md mx-auto">
        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-teal-800 h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center text-xs text-slate-500 mt-2 font-medium">
          <span>DIAGNOSTIC PIPELINE</span>
          <span className="text-teal-800 font-bold">{progress}%</span>
        </div>
      </div>

      {/* Checklist Cards */}
      <div className="mt-8 space-y-2.5 text-left max-w-lg mx-auto">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = currentStep > idx;
          const isCurrent = currentStep === idx;

          return (
            <div 
              key={idx}
              className={`p-3.5 rounded-xl border flex items-center space-x-3 transition-all ${
                isDone 
                  ? 'bg-teal-50/60 border-teal-200 text-teal-900' 
                  : isCurrent 
                  ? 'bg-white border-teal-600 text-slate-900 shadow-sm' 
                  : 'bg-white/60 border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                isDone ? 'bg-teal-600 text-white' : isCurrent ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-400'
              }`}>
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
              </div>
              <span className="text-xs font-semibold leading-relaxed">{step.text}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <AdBanner slotType="in-feed-native" />
      </div>
    </div>
  );
};
