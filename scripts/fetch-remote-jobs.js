import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function mapCategory(category = '', title = '') {
  const text = `${title} ${category}`.toLowerCase();
  if (/data (?:analyst|analytics|engineer|scientist)|machine learning|annotation/.test(text))
    return 'Data & AI';
  if (/software|developer|frontend|backend|fullstack|devops|engineer/.test(text))
    return 'Tech & Engineering';
  if (/customer|support|success|helpdesk/.test(text)) return 'Customer Support';
  if (/assistant|administrat|operations|executive assistant/.test(text)) return 'Virtual Assistant';
  if (/writer|copywrit|editor|journalis|writing|content/.test(text)) return 'Content & Writing';
  if (/sales|marketing|account executive/.test(text)) return 'Sales & Marketing';
  return 'Other';
}
function safeURL(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && ['remotive.com', 'www.remotive.com'].includes(url.hostname)
      ? url.href
      : null;
  } catch {
    return null;
  }
}
export function transformJob(job, fetchedAt) {
  const location = String(job.candidate_required_location || '').trim();
  if (
    !/worldwide|anywhere|africa|emea|nigeria/i.test(location) ||
    !safeURL(job.url) ||
    !job.title ||
    !job.company_name ||
    !job.id
  )
    return null;
  const description = String(job.description || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,!?;:])/g, '$1')
    .trim();
  const published =
    job.publication_date && !Number.isNaN(Date.parse(job.publication_date))
      ? new Date(job.publication_date).toISOString()
      : null;
  return {
    id: `remotive-${job.id}`,
    title: String(job.title).trim(),
    company: String(job.company_name).trim(),
    category: mapCategory(job.category, job.title),
    salary: typeof job.salary === 'string' && job.salary.trim() ? job.salary.trim() : null,
    location,
    type: String(job.job_type || 'Not specified').replace(/_/g, ' '),
    tags: Array.isArray(job.tags)
      ? job.tags.filter((tag) => typeof tag === 'string').slice(0, 5)
      : [],
    publishedAt: published,
    fetchedAt,
    description: description.length > 240 ? `${description.slice(0, 237)}…` : description,
    applyUrl: safeURL(job.url),
    source: 'Remotive',
  };
}
async function syncRemoteJobs() {
  const response = await fetch('https://remotive.com/api/remote-jobs?limit=100', {
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok)
    throw new Error(`Remotive returned HTTP ${response.status}. Existing snapshot was kept.`);
  const data = await response.json();
  if (!Array.isArray(data.jobs))
    throw new Error('Unexpected source response. Existing snapshot was kept.');
  const fetchedAt = new Date().toISOString();
  const jobs = data.jobs
    .map((job) => transformJob(job, fetchedAt))
    .filter(Boolean)
    .slice(0, 24);
  const target = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../src/data/mockJobs.ts',
  );
  const source = `// Source snapshot, not a guarantee of availability or Nigeria eligibility.\nimport type { RemoteJobListing } from '../types';\n\nexport const CURATED_REMOTE_JOBS: RemoteJobListing[] = ${JSON.stringify(jobs, null, 2)};\n`;
  fs.writeFileSync(`${target}.tmp`, source);
  fs.renameSync(`${target}.tmp`, target);
  console.log(
    `Updated ${jobs.length} source listings. No salaries or verification claims were inferred.`,
  );
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  syncRemoteJobs().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
