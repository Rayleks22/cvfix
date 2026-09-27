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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-3">
          <Briefcase className="w-3.5 h-3.5 text-teal-700" />
          <span>Verified Remote Opportunities for African Talent</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Curated Dollar Remote Jobs (US / UK / Worldwide)
        </h2>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          Every role listed here is verified to accept remote applications from Nigeria with direct foreign salary payouts (USD/GBP). Use our diagnostic engine to tailor your CV to any role in 30 seconds.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by role title, tool stack (e.g. Zendesk, React, Notion), or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-teal-700 focus:bg-white transition-colors"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-800 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 border border-slate-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Top Banner */}
      <AdBanner slotType="horizontal-leaderboard" />

      {/* Job Listings Stream */}
      <div className="space-y-4">
        {filteredJobs.map((job, idx) => (
          <React.Fragment key={job.id}>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition-all text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm group">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{job.company}</span>
                  <span className="text-slate-300">•</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                    {job.category}
                  </span>
                  {job.isVerified && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-teal-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-700" /> Verified Remote
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                  {job.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 max-w-2xl leading-relaxed">
                  {job.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-50 text-[11px] text-slate-600 border border-slate-200">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {job.postedTime}</span>
                </div>
              </div>

              {/* Salary & Action Buttons */}
              <div className="shrink-0 flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-left md:text-right">
                  <span className="text-lg sm:text-xl font-extrabold text-teal-800">{job.salaryUSD}</span>
                  <span className="text-xs text-slate-500 block font-medium">≈ {job.salaryNaira}</span>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    onClick={() => onSelectJobToTailor(job.title)}
                    className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-200" />
                    <span>Tailor My CV</span>
                  </button>

                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all"
                    title="Apply on company portal"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {idx === 1 && <AdBanner slotType="fintech-sponsor" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
