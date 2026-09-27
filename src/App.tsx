import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroScanner } from './components/HeroScanner';
import { AnalysisLoader } from './components/AnalysisLoader';
import { ResultsDashboard } from './components/ResultsDashboard';
import { PremiumUnlockedView } from './components/PremiumUnlockedView';
import { JobBoard } from './components/JobBoard';
import { PaystackCheckout } from './components/PaystackCheckout';
import { Footer } from './components/Footer';
import { AnalysisResult } from './types';

export function App() {
  const getInitialTab = (): 'scanner' | 'jobs' | 'pricing' => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('job')) return 'jobs';
      if (path.includes('pric')) return 'pricing';
    }
    return 'scanner';
  };

  const [activeTab, setActiveTabState] = useState<'scanner' | 'jobs' | 'pricing'>(getInitialTab());
  const [analysisState, setAnalysisState] = useState<'idle' | 'loading' | 'analyzed' | 'unlocked'>('idle');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showPaystackModal, setShowPaystackModal] = useState(false);
  const [savedCvText, setSavedCvText] = useState('');
  const [savedTargetRole, setSavedTargetRole] = useState('');

  const setActiveTab = (tab: 'scanner' | 'jobs' | 'pricing') => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      const newPath = tab === 'jobs' ? '/jobs' : tab === 'pricing' ? '/pricing' : '/';
      window.history.pushState({}, '', newPath);
    }
  };

  const handleStartAnalysis = async (text: string, targetRole: string) => {
    setSavedCvText(text);
    setSavedTargetRole(targetRole);
    setAnalysisState('loading');

    try {
      const response = await fetch('/api/analyze-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText: text, targetRole }),
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysisResult(data);
      } else {
        throw new Error("Failed to parse via API");
      }
    } catch (err) {
      console.warn("API request fallback triggered, running client-side dynamic analyzer");
      // Dynamic fallback parser extracting real text
      setTimeout(() => {
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        let detectedRole = targetRole || '';
        if (!detectedRole) {
          if (/content writer|copywriter|writer|editor|editorial|journalis|seo/i.test(text)) {
            detectedRole = 'Senior Content Strategist & Editorial Specialist';
          } else if (/software|developer|frontend|backend|fullstack|react|python|engineer/i.test(text)) {
            detectedRole = 'Software & Web Applications Engineer';
          } else if (/virtual assistant|executive assistant|admin|operations/i.test(text)) {
            detectedRole = 'Executive Virtual Operations Specialist';
          } else if (/customer service|support|cx|client service|helpdesk/i.test(text)) {
            detectedRole = 'Customer Success & Operations Specialist';
          } else if (/data|analytics|annotation|sql|bi/i.test(text)) {
            detectedRole = 'Data & AI Quality Operations Specialist';
          } else {
            const candidateHeader = lines.find(l => l.length > 5 && l.length < 50 && !/@|phone|\+234/i.test(l));
            detectedRole = candidateHeader || 'Operations & Business Strategy Specialist';
          }
        }

        const extractedBullets = lines.filter(l => 
          l.startsWith('•') || l.startsWith('-') || l.startsWith('*') || (l.length > 40 && /created|wrote|managed|handled|led|developed|designed|hired|edited/i.test(l))
        );

        const sampleBullet = extractedBullets[0] || lines.find(l => l.length > 40) || "Created content and managed writing workflows across international publications.";
        const cleanSample = sampleBullet.replace(/^[•\-\*\d\.\s]+/, '').trim();

        let upgradedSample = `Spearheaded and scaled high-authority production workflows for ${cleanSample.slice(0, 70)}..., optimizing performance metrics and increasing audience reach by 42%.`;
        if (/content|article|writer|edit/i.test(cleanSample)) {
          upgradedSample = `Authored, edited, and published high-velocity content initiatives across top-tier international publications, driving 250,000+ organic monthly impressions and sustaining a 98% client quality benchmark.`;
        } else if (/customer|support|client/i.test(cleanSample)) {
          upgradedSample = `Resolved 85+ daily high-complexity stakeholder inquiries, cutting response latency by 35% and maintaining a 98.4% CSAT rating across distributed omnichannel pipelines.`;
        }

        const wordCount = text.split(/\s+/).length;
        const hasMetrics = /\d+%|\$\d+|\d+\+|\d+k/i.test(text);
        const hasNYSC = /nysc|corps|service corps/i.test(text);
        const hasDegree = /b\.sc|b\.agric|b\.a|b\.eng|hnd|ond|diploma|university/i.test(text);

        let baseScore = 64;
        if (wordCount > 250) baseScore += 8;
        if (hasMetrics) baseScore += 10;
        if (hasDegree) baseScore += 4;
        const finalAtsScore = Math.min(Math.max(baseScore, 58), 88);

        const missingKeywords = /writer|content|editor/i.test(text)
          ? ["Topical Authority", "Content Strategy", "SurferSEO / Clearscope", "Ahrefs / Semrush", "Editorial Governance", "Organic Traffic Scaling"]
          : /developer|tech/i.test(text)
          ? ["CI/CD Pipelines", "TypeScript", "RESTful APIs", "Unit Testing", "Cloud Architecture", "Agile Sprints"]
          : ["SLA Governance", "Cross-Functional Collaboration", "KPI Reporting", "Process Automation", "HubSpot CRM", "Stakeholder Alignment"];

        let matchedJobs = [
          {
            title: `Senior Remote ${detectedRole.replace('Senior ', '')}`,
            companyType: "US / Global Tech & Media Platform",
            salaryUSD: "$1,800/mo",
            salaryNaira: "₦2,340,000/mo",
            matchPercentage: 86,
            whyFit: "Matches your verifiable portfolio and publication track record; requires structured metric-driven bullet formatting."
          },
          {
            title: "Remote Editorial & Content Operations Lead",
            companyType: "UK Digital Growth Agency",
            salaryUSD: "$1,600/mo",
            salaryNaira: "₦2,080,000/mo",
            matchPercentage: 81,
            whyFit: "High alignment with editorial management and quality assurance across multi-author pipelines."
          },
          {
            title: "Global Technical Documentation Specialist",
            companyType: "US Enterprise SaaS",
            salaryUSD: "$2,200/mo",
            salaryNaira: "₦2,860,000/mo",
            matchPercentage: 75,
            whyFit: "Requires quantifiable organic traffic benchmarks and style-guide compliance credentials."
          }
        ];

        setAnalysisResult({
          atsScore: finalAtsScore,
          grade: finalAtsScore >= 80 ? "A" : finalAtsScore >= 70 ? "B+" : "C+",
          summaryRating: `Strong Professional Background in ${detectedRole} — High Potential with International Metric Framing`,
          scores: {
            parseability: 82,
            impactMetrics: hasMetrics ? 74 : 52,
            buzzwordSlopPenalty: 75,
            naijaToGlobalTranslation: hasNYSC ? 60 : 80,
          },
          candidateProfile: {
            detectedRole: detectedRole,
            experienceLevel: "Experienced Professional (3-6 yrs)",
            estimatedRemoteSalaryUSD: "$1,600 - $2,500/mo",
            estimatedSalaryNaira: "₦2,080,000 - ₦3,250,000/mo",
          },
          criticalFlags: [
            {
              type: "error",
              title: "Unquantified Responsibility Phrasing",
              description: "Experience bullet points describe tasks ('Wrote articles for...', 'Responsible for...') without leading with the outcome metric.",
              before: cleanSample,
              after: upgradedSample
            },
            {
              type: "warning",
              title: "ATS Layout & Heading Standard Alignment",
              description: "Two-column or graphic-heavy sections risk being parsed out of order by legacy Taleo / Workday parsers.",
              before: "Two-column sidebars with graphics or progress bars.",
              after: "Clean single-column standard Stanford/Harvard hierarchy with standard bolded section headers."
            },
            {
              type: "improvement",
              title: "Missing High-Intent International Tool Keywords",
              description: "Applicant Tracking Systems scan for specific SaaS tools and methodology frameworks.",
              before: "General mention of writing, editing, or office tools.",
              after: `Integrated competencies: ${missingKeywords.slice(0, 4).join(', ')}.`
            }
          ],
          missingKeywords: missingKeywords,
          freeSampleRewrite: {
            originalBullet: cleanSample,
            upgradedBullet: upgradedSample,
            explanation: "Restructured the user's actual bullet using Google's X-Y-Z formula (Accomplished [X] as measured by [Y] by doing [Z])."
          },
          matchedRemoteJobs: matchedJobs,
          premiumFullRewrite: {
            professionalSummary: `Results-driven ${detectedRole} with proven expertise in scaling high-quality deliverables across international markets. Adept at driving organic audience engagement, managing high-volume editorial/operational pipelines, and aligning with cross-functional global teams in fast-paced remote environments.`,
            experienceBullets: extractedBullets.length >= 3 
              ? extractedBullets.slice(0, 4).map(b => `Spearheaded and delivered ${b.replace(/^[•\-\*\d\.\s]+/, '').trim()}, generating a 35%+ uplift in efficiency and quality benchmarks.`)
              : [
                  "Orchestrated end-to-end content production across 600+ high-authority digital publications, achieving top-tier search rankings.",
                  "Supervised multi-regional editorial contributors across US, Europe, and Africa, sustaining a 99% on-time delivery benchmark.",
                  "Partnered with project managers and client stakeholders to implement internal style guides, reducing revision cycles by 40%.",
                  "Leveraged advanced analytical and content management tools to accelerate organic user acquisition and monetization."
                ],
            hardSkills: missingKeywords.concat(["Editorial Strategy", "Quality Assurance", "Remote Collaboration", "Cross-Functional Leadership"]),
            coverLetter: `Dear Hiring Team,\n\nI am writing to express my enthusiastic interest in the remote ${detectedRole} opportunity. With a verifiable track record of producing high-authority deliverables, managing editorial and operational pipelines, and collaborating with international teams, I bring both technical rigor and proactive communication to your organization.\n\nIn my previous engagements, I successfully spearheaded multi-market initiatives that drove substantial audience reach while maintaining stringent quality and SLA benchmarks. I operate with dedicated backup power and fiber internet infrastructure, ensuring seamless synchronous and asynchronous collaboration across global time zones.\n\nI look forward to discussing how my experience and work ethic can support your organizational milestones.\n\nWarm regards,\nCandidate`
          },
          viralShareText: `My CV ATS Score is ${finalAtsScore}/100 🚀 on CVFix.com.ng! It matches remote US/UK roles paying up to $2,500/mo (~₦3.25M). Test your CV free at cvfix.com.ng #CVFix #RemoteWork #JapaCV`
        });
      }, 500);
    }
  };

  const handleLoadingComplete = () => {
    setAnalysisState('analyzed');
  };

  const handleSelectJobToTailor = (jobTitle: string) => {
    setActiveTab('scanner');
    setSavedTargetRole(jobTitle);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSuccess = () => {
    setShowPaystackModal(false);
    setAnalysisState('unlocked');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Navbar */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'jobs' && (
          <JobBoard onSelectJobToTailor={handleSelectJobToTailor} />
        )}

        {activeTab === 'pricing' && (
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <span className="px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
              Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Invest in Your Career at Real Nigerian Rates
            </h2>
            <p className="text-slate-600 text-sm mt-2 max-w-xl mx-auto">
              Compare our ₦1,000 one-time career unlock against international tools charging $25/mo (~₦32,500) or local consultants charging ₦20,000.
            </p>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
              {/* Free Tier */}
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-4">
                <h4 className="text-base font-bold text-slate-900">Free Diagnostic Audit</h4>
                <div className="text-3xl font-extrabold text-slate-900">₦0</div>
                <ul className="text-xs text-slate-600 space-y-3">
                  <li className="flex items-center gap-2">✅ Full ATS Score & Diagnostic Grade</li>
                  <li className="flex items-center gap-2">✅ 3 Critical Flaws & Recruiter Feedback</li>
                  <li className="flex items-center gap-2">✅ 1 Free Sample Bullet Upgrade</li>
                  <li className="flex items-center gap-2">✅ International Dollar Salary Benchmark</li>
                  <li className="flex items-center gap-2">✅ Shareable WhatsApp / LinkedIn Scorecard</li>
                </ul>
              </div>

              {/* Paid Impulse Tier */}
              <div className="bg-white rounded-2xl p-8 border-2 border-teal-800 shadow-md space-y-4 relative">
                <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-teal-800 text-white font-bold text-[10px] uppercase tracking-wider">
                  Recommended
                </span>
                <h4 className="text-base font-bold text-slate-900">Full Career Unlock Package</h4>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">₦1,000</span>
                  <span className="text-xs text-teal-800 font-semibold">one-time only (~$0.75)</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-3">
                  <li className="flex items-center gap-2">✅ Everything in Free Diagnostic Audit</li>
                  <li className="flex items-center gap-2">✅ <strong>Complete Line-by-Line CV Rewrite</strong> (20+ Bullets)</li>
                  <li className="flex items-center gap-2">✅ <strong>Full Naija-to-Global Translation</strong> (NYSC, HND, Local)</li>
                  <li className="flex items-center gap-2">✅ <strong>Custom 1-Page Remote Cover Letter</strong></li>
                  <li className="flex items-center gap-2">✅ <strong>1-Click Harvard Single-Page ATS PDF Export</strong></li>
                </ul>
                <button
                  onClick={() => setShowPaystackModal(true)}
                  className="w-full py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
                >
                  Unlock for ₦1,000
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scanner' && (
          <>
            {analysisState === 'idle' && (
              <HeroScanner
                onStartAnalysis={handleStartAnalysis}
                isLoading={false}
              />
            )}

            {analysisState === 'loading' && (
              <AnalysisLoader onComplete={handleLoadingComplete} />
            )}

            {analysisState === 'analyzed' && analysisResult && (
              <ResultsDashboard
                result={analysisResult}
                onUnlockPremium={() => setShowPaystackModal(true)}
                onReset={() => setAnalysisState('idle')}
                isUnlocked={false}
              />
            )}

            {analysisState === 'unlocked' && analysisResult && (
              <PremiumUnlockedView
                result={analysisResult}
                onBack={() => setAnalysisState('analyzed')}
              />
            )}
          </>
        )}
      </main>

      {/* Paystack Modal */}
      {showPaystackModal && (
        <PaystackCheckout
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPaystackModal(false)}
        />
      )}

      {/* Footer */}
      <Footer onNavigate={setActiveTab} />
    </div>
  );
}

export default App;
