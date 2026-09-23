export interface CriticalFlag {
  type: 'error' | 'warning' | 'improvement';
  title: string;
  description: string;
  before: string;
  after: string;
}

export interface MatchedJob {
  title: string;
  companyType: string;
  salaryUSD: string;
  salaryNaira: string;
  matchPercentage: number;
  whyFit: string;
}

export interface AnalysisResult {
  atsScore: number;
  grade: string;
  summaryRating: string;
  scores: {
    parseability: number;
    impactMetrics: number;
    buzzwordSlopPenalty: number;
    naijaToGlobalTranslation: number;
  };
  candidateProfile: {
    detectedRole: string;
    experienceLevel: string;
    estimatedRemoteSalaryUSD: string;
    estimatedSalaryNaira: string;
  };
  criticalFlags: CriticalFlag[];
  missingKeywords: string[];
  freeSampleRewrite: {
    originalBullet: string;
    upgradedBullet: string;
    explanation: string;
  };
  matchedRemoteJobs: MatchedJob[];
  premiumFullRewrite: {
    professionalSummary: string;
    experienceBullets: string[];
    hardSkills: string[];
    coverLetter: string;
  };
  viralShareText: string;
}

export interface RemoteJobListing {
  id: string;
  title: string;
  company: string;
  category: 'Virtual Assistant' | 'Customer Support' | 'Tech & Engineering' | 'Data & AI' | 'Content & Writing';
  salaryUSD: string;
  salaryNaira: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  tags: string[];
  postedTime: string;
  description: string;
  applyUrl: string;
  isVerified: boolean;
}
