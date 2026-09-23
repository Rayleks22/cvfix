import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USD_TO_NAIRA_RATE = 1550;

function mapCategory(cat, title) {
  const combined = `${cat} ${title}`.toLowerCase();
  if (/dev|software|engineer|frontend|backend|fullstack|react|python|web/i.test(combined)) return 'Tech & Engineering';
  if (/customer|support|success|helpdesk|client service/i.test(combined)) return 'Customer Support';
  if (/assistant|admin|operations|executive|project/i.test(combined)) return 'Virtual Assistant';
  if (/data|ai|annotation|analytics|machine learning|prompt/i.test(combined)) return 'Data & AI';
  return 'Content & Writing';
}

function estimateSalaryUSD(category) {
  switch (category) {
    case 'Tech & Engineering': return '$2,500/mo';
    case 'Data & AI': return '$1,800/mo';
    case 'Content & Writing': return '$1,600/mo';
    case 'Virtual Assistant': return '$1,500/mo';
    case 'Customer Support': return '$1,400/mo';
    default: return '$1,500/mo';
  }
}

function formatNaira(usdString) {
  const num = parseInt(usdString.replace(/[^0-9]/g, ''), 10) || 1500;
  const totalNaira = num * USD_TO_NAIRA_RATE;
  return `₦${totalNaira.toLocaleString()}/mo`;
}

async function syncRemoteJobs() {
  console.log("🌐 Fetching live worldwide remote job feeds...");

  try {
    const res = await fetch('https://remotive.com/api/remote-jobs?limit=50');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
    const data = await res.json();
    const allJobs = data.jobs || [];

    // Filter jobs accessible to African / Nigerian remote candidates
    const globalJobs = allJobs.filter((job) => {
      const loc = (job.candidate_required_location || '').toLowerCase();
      return (
        loc.includes('worldwide') ||
        loc.includes('anywhere') ||
        loc.includes('africa') ||
        loc.includes('emea') ||
        loc === ''
      );
    });

    console.log(`Found ${globalJobs.length} worldwide / Africa-friendly roles.`);

    const formattedJobs = globalJobs.slice(0, 15).map((job, idx) => {
      const category = mapCategory(job.category || '', job.title || '');
      const salaryUSD = job.salary ? job.salary : estimateSalaryUSD(category);
      const salaryNaira = formatNaira(salaryUSD);
      const cleanDesc = (job.description || '')
        .replace(/<[^>]*>?/gm, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 180) + '...';

      return {
        id: `remotive-${job.id || idx}`,
        title: job.title,
        company: job.company_name || 'Global Tech Partner',
        category: category,
        salaryUSD: salaryUSD,
        salaryNaira: salaryNaira,
        location: job.candidate_required_location || '100% Remote (Open to Nigeria)',
        type: (job.job_type || 'Full-time').replace('_', ' '),
        tags: job.tags && job.tags.length > 0 ? job.tags.slice(0, 5) : ['Remote', 'Global', 'Africa-Friendly'],
        postedTime: 'Verified Today',
        description: cleanDesc,
        applyUrl: job.url || 'https://remotive.com',
        isVerified: true
      };
    });

    const targetPath = path.resolve(__dirname, '../src/data/mockJobs.ts');
    const fileContent = `import { RemoteJobListing } from '../types';\n\nexport const CURATED_REMOTE_JOBS: RemoteJobListing[] = ${JSON.stringify(formattedJobs, null, 2)};\n`;

    fs.writeFileSync(targetPath, fileContent, 'utf-8');
    console.log(`✅ Successfully updated ${formattedJobs.length} live remote jobs in src/data/mockJobs.ts!`);
  } catch (error) {
    console.error("⚠️ Failed to sync live jobs from API:", error.message);
  }
}

syncRemoteJobs();
