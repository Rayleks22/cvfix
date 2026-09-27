import React from 'react';
import { FileCheck, Briefcase, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

interface HeaderProps {
  activeTab: 'scanner' | 'jobs' | 'pricing';
  setActiveTab: (tab: 'scanner' | 'jobs' | 'pricing') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('scanner')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-800 flex items-center justify-center shadow-sm group-hover:bg-teal-700 transition-colors">
              <FileCheck className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center">
                CVFix<span className="text-teal-700 font-black">.com.ng</span>
              </div>
              <span className="text-[10px] block text-slate-500 font-semibold tracking-wider uppercase -mt-0.5">
                AI ATS & Career Intelligence
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('scanner')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'scanner'
                  ? 'text-teal-800 bg-teal-50 border border-teal-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              ATS Diagnostic Scanner
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'jobs'
                  ? 'text-teal-800 bg-teal-50 border border-teal-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Briefcase className="w-4 h-4 text-teal-700" />
              <span>Dollar Remote Jobs</span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                ACTIVE
              </span>
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'pricing'
                  ? 'text-teal-800 bg-teal-50 border border-teal-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              ₦1,000 Micro-Unlock
            </button>
          </nav>

          {/* Action Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('scanner')}
              className="bg-teal-800 hover:bg-teal-900 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-200" />
              <span>Free ATS Audit</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
