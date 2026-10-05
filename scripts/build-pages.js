import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const PAGE_METADATA = {
  jobs: [
    'Remote opportunities | CVFix',
    'Explore remote roles sourced from Remotive. Check employer requirements and Nigeria eligibility. No guessed salaries or false verification badges.',
  ],
  pricing: [
    'Simple, one-time pricing | CVFix',
    'Start with a free CV review. The optional full CV package costs ₦1,000 once, with editable CV and cover-letter drafts plus Word and PDF downloads.',
  ],
  privacy: [
    'Privacy notice | CVFix',
    'How CVFix handles free local reviews, paid checkout, encrypted temporary sessions and Paystack transaction information.',
  ],
  terms: [
    'Terms of service | CVFix',
    'What CVFix provides, the limits of rule-based CV feedback, pricing, and your responsibility to check every fact.',
  ],
  contact: [
    'Help & contact | CVFix',
    'Get help with CVFix reviews, payment verification and document downloads.',
  ],
  refunds: [
    'Payments & refunds | CVFix',
    'Payment-recovery guidance and refund requests for duplicate charges or an undelivered CVFix package.',
  ],
  methodology: [
    'How we review your CV | CVFix',
    'Read the transparent rules behind the CVFix assessment: structure, wording, specific detail and core details or job keywords.',
  ],
};
const escape = (value) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export function buildPageHTML(base, slug) {
  if (!PAGE_METADATA[slug]) throw new Error('Unknown entry page.');
  const [title, description] = PAGE_METADATA[slug];
  const url = `https://cvfix.com.ng/${slug}`;
  return base
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*/, `$1${escape(description)}`)
    .replace(/(<link\s+rel="canonical"\s+href=")[^"]*/, `$1${url}`)
    .replace(/(<meta\s+property="og:url"\s+content=")[^"]*/, `$1${url}`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*/, `$1${escape(title)}`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*/, `$1${escape(description)}`)
    .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*/, `$1${escape(title)}`)
    .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*/, `$1${escape(description)}`);
}

function buildPages() {
  const base = fs.readFileSync('dist/index.html', 'utf8');
  for (const slug of Object.keys(PAGE_METADATA)) {
    fs.mkdirSync(path.join('dist', slug), { recursive: true });
    const html = buildPageHTML(base, slug);
    fs.writeFileSync(path.join('dist', slug, 'index.html'), html);
    // Extensionless routes resolve correctly in both Pages and Vite's static preview.
    fs.writeFileSync(path.join('dist', `${slug}.html`), html);
  }
  console.log(
    `Prepared ${Object.keys(PAGE_METADATA).length} direct-entry pages with route-specific metadata.`,
  );
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  buildPages();
