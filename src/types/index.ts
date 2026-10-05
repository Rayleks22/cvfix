export type TabName =
  'scanner' | 'jobs' | 'pricing' | 'privacy' | 'terms' | 'contact' | 'refunds' | 'methodology';

export interface ReviewInput {
  cvText: string;
  targetRole: string;
  jobDescription: string;
}

export interface ScorePillar {
  id: string;
  label: string;
  score: number;
  explanation: string;
}

export interface ReviewSuggestion {
  id: string;
  title: string;
  description: string;
  excerpt?: string;
  revision?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface TextChange {
  lineIndex: number;
  original: string;
  revised: string;
  reason: string;
}

export interface ReviewResult {
  score: number;
  scoreLabel: string;
  candidateName: string;
  targetRole: string;
  wordCount: number;
  pillars: ScorePillar[];
  strengths: string[];
  suggestions: ReviewSuggestion[];
  keywordMatches: string[];
  keywordGaps: string[];
  keywordSource: 'job-description' | 'role-ideas' | 'none';
  sampleRewrite: TextChange | null;
  followUpQuestions: string[];
  method: 'rules-v2';
}

export interface PremiumPackage {
  cvText: string;
  coverLetter: string;
  changes: TextChange[];
  candidateName: string;
  targetRole: string;
  method: 'rules-v2';
}

export interface PublicConfig {
  paymentsEnabled: boolean;
  paymentMode: 'test' | 'live' | 'unavailable';
  supportEmail: string | null;
  priceKobo: number;
  currency: 'NGN';
}

export type JobCategory =
  | 'Virtual Assistant'
  | 'Customer Support'
  | 'Tech & Engineering'
  | 'Data & AI'
  | 'Content & Writing'
  | 'Sales & Marketing'
  | 'Other';

export interface RemoteJobListing {
  id: string;
  title: string;
  company: string;
  category: JobCategory;
  salary: string | null;
  location: string;
  type: string;
  tags: string[];
  publishedAt: string | null;
  fetchedAt: string | null;
  description: string;
  applyUrl: string;
  source: 'Remotive';
}

export interface VerifiedPayment {
  verified: true;
  reference: string;
  package: PremiumPackage;
  review: ReviewResult;
  source: ReviewInput;
}
