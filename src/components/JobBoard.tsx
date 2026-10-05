import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Briefcase, Globe, Info, Search } from 'lucide-react';
import type { JobCategory } from '../types/index.ts';
import { CURATED_REMOTE_JOBS } from '../data/mockJobs.ts';
import { safeJobURL, salaryPeriodLabel } from '../lib/jobs.ts';

const categories: Array<JobCategory | 'All roles'> = [
  'All roles',
  'Virtual Assistant',
  'Customer Support',
  'Tech & Engineering',
  'Data & AI',
  'Content & Writing',
  'Sales & Marketing',
];
function dateLabel(value: string | null): string {
  if (!value) return 'Source date unavailable';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Source date unavailable'
    : `Listed ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
}
export function JobBoard({
  onSelectJobToTailor,
}: {
  onSelectJobToTailor: (jobTitle: string) => void;
}) {
  const [category, setCategory] = useState<JobCategory | 'All roles'>('All roles');
  const [query, setQuery] = useState('');
  const jobs = CURATED_REMOTE_JOBS.filter(
    (job) =>
      safeJobURL(job.applyUrl) &&
      (category === 'All roles' || job.category === category) &&
      `${job.title} ${job.company} ${job.tags.join(' ')}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <section className="container jobs-section">
      <div className="section-heading">
        <span className="eyebrow">YOUR NEXT OPPORTUNITY COULD BE ANYWHERE</span>
        <h1>
          Explore remote roles.
          <br />
          <em>Bring your real experience.</em>
        </h1>
        <p>
          A secondary resource for your job search, sourced from Remotive. Check the employer’s
          location requirements and whether the role is still open.
        </p>
      </div>
      <div className="jobs-warning">
        <Info size={18} />
        <span>
          Worldwide, Africa or EMEA listings do not guarantee Nigeria eligibility. Salaries are
          shown as supplied—no guessed amounts, exchange rates, match percentages or “verified
          today” badges.
        </span>
      </div>
      <div className="jobs-tools">
        <div className="job-search">
          <Search size={18} />
          <label className="visually-hidden" htmlFor="job-search">
            Search roles or companies
          </label>
          <input
            id="job-search"
            placeholder="Search roles or companies"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="job-filters" aria-label="Filter remote jobs by category">
          {categories.map((item) => (
            <button
              className={category === item ? 'selected' : ''}
              aria-pressed={category === item}
              key={item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="jobs-count">
        {jobs.length} {jobs.length === 1 ? 'role' : 'roles'} in this source snapshot{' '}
        <a href="https://remotive.com" target="_blank" rel="noopener noreferrer">
          Source: Remotive <ArrowUpRight size={13} />
        </a>
      </div>
      <div className="jobs-grid">
        {jobs.map((job) => (
          <article className="job-card" key={job.id}>
            <div className="job-company-row">
              <span className="company-icon">
                <Briefcase size={18} />
              </span>
              <span>{job.company}</span>
              <span className="job-category">{job.category}</span>
            </div>
            <h2>{job.title}</h2>
            <p className="job-description">{job.description}</p>
            <div className="job-tags">
              {job.tags.slice(0, 4).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="job-meta">
              <span>
                <Globe size={13} />
                {job.location}
              </span>
              <span>{dateLabel(job.publishedAt)}</span>
            </div>
            <div className="job-salary">
              {job.salary ? (
                <>
                  <strong>{job.salary}</strong>
                  <span>{salaryPeriodLabel(job.salary)}</span>
                </>
              ) : (
                <>
                  <strong>Salary not available</strong>
                  <span>Check the original listing.</span>
                </>
              )}
            </div>
            <div className="job-actions">
              <button
                className="button button-outline"
                onClick={() => onSelectJobToTailor(job.title)}
              >
                Review my CV for this role <ArrowRight size={14} />
              </button>
              <a
                className="icon-button"
                href={safeJobURL(job.applyUrl)!}
                aria-label={`View ${job.title} on Remotive`}
                title="View the original listing on Remotive"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ArrowUpRight size={20} />
              </a>
            </div>
          </article>
        ))}
      </div>
      {!jobs.length && (
        <div className="empty-state">
          <Briefcase size={30} />
          <h2>No roles in this filter.</h2>
          <p>Try another category or search term. Availability depends on the source snapshot.</p>
          <button
            className="button button-outline"
            onClick={() => {
              setCategory('All roles');
              setQuery('');
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
