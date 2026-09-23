import React from 'react';
import { FileCheck, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#060910] text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <FileCheck className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-lg font-black text-white">
                CVFix<span className="text-emerald-400">.com.ng</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nigeria’s #1 AI-powered ATS diagnostic engine & dollar remote job bridge. Designed to help African talent land global opportunities.
            </p>
          </div>

          {/* Col 2: Free Tools */}
          <div>
            <h5 className="text-xs font-bold uppercase text-white tracking-wider mb-3">
              Free AI Tools
            </h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Free ATS Score Checker</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Naija-to-Global NYSC Reframe</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Remote Dollar Salary Estimator</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Harvard 1-Page ATS PDF Template</a></li>
            </ul>
          </div>

          {/* Col 3: Remote Categories */}
          <div>
            <h5 className="text-xs font-bold uppercase text-white tracking-wider mb-3">
              Remote Job Tracks
            </h5>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Virtual Assistant Roles ($1,500/mo)</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Customer Support / CX ($1,400/mo)</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Data Annotation & AI ($1,800/mo)</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Software Engineering ($2,500+/mo)</a></li>
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
              Affiliate Disclosure: Some partner links (e.g. Grey, Geegpay) may earn a small referral commission at zero additional cost to you.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-4">
          <p>© {new Date().getFullYear()} CVFix.com.ng. Built for Nigerian & African Global Ambitions.</p>
          <div className="flex items-center space-x-4">
            <a href="/public/ads.txt" className="hover:text-slate-400">Ads.txt</a>
            <span>•</span>
            <a href="/public/robots.txt" className="hover:text-slate-400">Robots.txt</a>
            <span>•</span>
            <span>Made with <Heart className="w-3 h-3 text-rose-500 inline fill-rose-500" /> for Nigeria</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
