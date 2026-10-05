import type { PremiumPackage } from '../types/index.ts';
import { SAMPLE_CV, SAMPLE_ROLE } from './sampleCV.ts';

// Fixed fictional preview only. Arbitrary full-package assembly lives on the server.
const original = 'Responsible for daily customer service and addressing customer complaints.';
const revised = 'Provided daily customer service and addressed customer complaints.';
export const SAMPLE_PACKAGE: PremiumPackage = {
  cvText: SAMPLE_CV.replace(original, revised),
  candidateName: 'AMARA OKAFOR',
  targetRole: SAMPLE_ROLE,
  method: 'rules-v2',
  changes: [
    {
      lineIndex: SAMPLE_CV.split('\n').findIndex((line) => line.includes(original)),
      original,
      revised,
      reason: 'Clearer action-led wording; no new factual claims.',
    },
  ],
  coverLetter: `Dear Hiring Team,\n\nI am applying for the Customer Support Officer position. Please find my CV attached for your consideration.\n\nIn my previous work, I provided daily customer service and addressed customer complaints. This is one example of the responsibilities described in my CV.\n\nI would welcome the opportunity to discuss how my background fits your team’s needs. Thank you for considering my application.\n\nKind regards,\nAMARA OKAFOR`,
};
