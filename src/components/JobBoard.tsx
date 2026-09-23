import React, { useState } from 'react';
import { 
  Briefcase, Search, Filter, DollarSign, ExternalLink, Sparkles, 
  MapPin, Clock, CheckCircle2, ArrowRight 
} from 'lucide-react';
import { CURATED_REMOTE_JOBS } from '../data/mockJobs';
import { AdBanner } from './AdBanner';

interface JobBoardProps {
  onSelectJobToTailor: (jobTitle: string) => void;
}

const CATEGORIES = [
  'All Roles',
  'Virtual Assistant',
  'Customer Support',
  'Tech & Engineering',
  'Data & AI',
  'Content & Writing'
];

export const JobBoard: React.FC<JobBoardProps> = ({ onSelectJobToTailor }) => {
  const [selectedCategory, setSelectedCategory] = useState('All Roles');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = CURATED_REMOTE_JOBS.filter((job) => {
    const matchesCategory = selectedCategory === 'All Roles' || job.category === selectedCategory;
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-4">
          <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
          <span>Vetted & Verified for African Applicants</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Curated Dollar Remote Jobs (US / UK / EU)
        </h2>
        <p className="text-sm text-slate-300 mt-3 leading-relaxed">
          Every role listed here is confirmed to hire candidates in Nigeria with payments in USD, GBP, or EUR. Use our AI to tailor your CV to any job in 30 seconds.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="glass-card rounded-2xl p-4 sm:p-6 border border-white/10 space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by role title, skill (e.g. Zendesk, React, Notion), or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Top Ad Unit */}
      <AdBanner slotType="horizontal-leaderboard" />

      {/* Job Listings Stream */}
      <div className="space-y-4">
        {filteredJobs.map((job, idx) => (
          <React.Fragment key={job.id}>
            <div className="glass-card rounded-2xl p-6 border border-white/10 hover:border-emerald-500/40 transition-all text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">{job.company}</span>
                  <span className="text-slate-600">•</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-bold border border-emerald-500/20">
                    {job.category}
                  </span>
                  {job.isVerified && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-teal-400">
                      <CheckCircle2 className="w-3 h-3 text-teal-400" /> Verified Remote
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {job.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-2 max-w-2xl">
                  {job.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-900 text-[11px] text-slate-400 border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {job.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-500" /> {job.postedTime}</span>
                </div>
              </div>

              {/* Salary & Action CTAs */}
              <div className="shrink-0 flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/10">
                <div className="text-left md:text-right">
                  <span className="text-xl font-black text-emerald-400">{job.salaryUSD}</span>
                  <span className="text-xs text-slate-400 block font-medium">≈ {job.salaryNaira}</span>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    onClick={() => onSelectJobToTailor(job.title)}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Tailor My CV</span>
                  </button>

                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition-all"
                    title="Apply on company site"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Insert Fintech Sponsor Banner after 2nd listing */}
            {idx === 1 && <AdBanner slotType="fintech-sponsor" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
