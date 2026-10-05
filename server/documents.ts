import type { PremiumPackage, ReviewInput, TextChange } from '../src/types/index.ts';
import { experienceItems, improveBullet, normaliseCV, reviewCV } from '../src/lib/review.ts';

/** Preserve the complete source CV. Only recognised experience bullets receive approved grammatical edits. */
export function buildFullPackage(input: ReviewInput): PremiumPackage {
  const result = reviewCV(input);
  const lines = normaliseCV(input.cvText).split('\n');
  const changes: TextChange[] = [];
  const items = experienceItems(lines);
  for (const item of items) {
    const revised = improveBullet(item.text);
    if (revised !== item.text) {
      changes.push({
        lineIndex: item.lineIndex,
        original: item.text,
        revised,
        reason: 'Clearer action-led wording; no new factual claims.',
      });
      lines[item.lineIndex] = item.marker ? `- ${revised}` : revised;
    }
  }
  const role = input.targetRole.trim();
  const first = items[0] ? improveBullet(items[0].text).replace(/[.!?]$/, '') : '';
  // This is deliberately a draft, not an invented account of the candidate’s achievements.
  const experienceParagraph = first
    ? `In my previous work, I ${first[0].toLowerCase()}${first.slice(1)}. This is one example of the responsibilities described in my CV.`
    : 'My CV outlines my education, qualifications, and relevant experience.';
  const coverLetter = `Dear Hiring Team,\n\nI am applying for ${role ? `the ${role} position` : 'the advertised position'}. Please find my CV attached for your consideration.\n\n${experienceParagraph}\n\nI would welcome the opportunity to discuss how my background fits your team’s needs. Thank you for considering my application.\n\nKind regards,\n${result.candidateName || '[Your name]'}`;
  return {
    cvText: lines.join('\n'),
    coverLetter,
    changes,
    candidateName: result.candidateName,
    targetRole: result.targetRole,
    method: 'rules-v2',
  };
}
