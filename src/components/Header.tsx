import React from 'react';
import { Sparkles, DollarSign, Briefcase, FileCheck, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: 'scanner' | 'jobs' | 'pricing';
  setActiveTab: (tab: 'scanner' | 'jobs' | 'pricing') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080c14]/90 backdrop-blur-md">
      {/* Live Ticker Bar */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-emerald-900/40 to-emerald-950/60 border-b border-emerald-500/20 px-4 py-1.5 text-xs text-emerald-300 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between font-medium">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Live Remote FX Index: <strong>$1.00 USD ≈ ₦1,550 NGN</strong></span>
          </div>
          <div className="hidden sm:flex items-center space-x-4 text-emerald-400/80">
            <span>🔥 48 New Global Remote Roles Open to Nigeria Today</span>
            <span className="text-emerald-500/40">•</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> 100% Free ATS Audit</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('scanner')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <FileCheck className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                CVFix<span className="text-emerald-400">.com.ng</span>
              </span>
              <span className="text-[10px] block text-slate-400 tracking-wider font-semibold uppercase">
                AI ATS & Remote Job Engine
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('scanner')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'scanner'
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              AI ATS Scanner
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'jobs'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Briefcase className="w-4 h-4 text-emerald-400" />
              Dollar Remote Jobs
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-500/30 text-emerald-300">HOT</span>
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'pricing'
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>₦1,000 Unlock</span>
            </button>
          </nav>

          {/* Quick CTA */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('scanner')}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/50 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-emerald-100" />
              <span>Free ATS Audit</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
