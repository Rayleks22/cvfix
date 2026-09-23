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
  const [activeTab, setActiveTab] = useState<'scanner' | 'jobs' | 'pricing'>('scanner');
  const [analysisState, setAnalysisState] = useState<'idle' | 'loading' | 'analyzed' | 'unlocked'>('idle');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showPaystackModal, setShowPaystackModal] = useState(false);
  const [savedCvText, setSavedCvText] = useState('');
  const [savedTargetRole, setSavedTargetRole] = useState('');

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
      console.warn("API request fallback triggered");
      // Simulated response if running in pure local dev server without Cloudflare Pages Functions
      setTimeout(() => {
        const simulatedScore = Math.floor(Math.random() * 15) + 64;
        setAnalysisResult({
          atsScore: simulatedScore,
          grade: simulatedScore > 75 ? "B+" : "C+",
          summaryRating: "Moderate ATS Compatibility — High Potential with Nigerian-to-Global Reframe",
          scores: {
            parseability: 78,
            impactMetrics: 55,
            buzzwordSlopPenalty: 70,
            naijaToGlobalTranslation: 62,
          },
          candidateProfile: {
            detectedRole: targetRole || "Customer Operations & Digital Specialist",
            experienceLevel: "Mid-Level Professional (2-4 yrs)",
            estimatedRemoteSalaryUSD: "$1,500 - $2,400/mo",
            estimatedSalaryNaira: "₦1,950,000 - ₦3,120,000/mo",
          },
          criticalFlags: [
            {
              type: "error",
              title: "Passive Responsibility Syndrome",
              description: "Bullets describe passive duties rather than quantifiable outcomes using the Google X-Y-Z formula.",
              before: "Responsible for attending to customer inquiries and managing complaints on WhatsApp and email.",
              after: "Resolved 95+ daily customer inquiries across omnichannel pipelines, maintaining a 98.4% CSAT rating and reducing response latency by 35%."
            },
            {
              type: "warning",
              title: "Un-translated Nigerian Career Artifact (NYSC / Local Context)",
              description: "Local context terms lack global corporate equivalence for US/UK applicant tracking systems.",
              before: "Served as NYSC Corp Member at Community Secondary School.",
              after: "Public Sector Educational Fellow — Designed & delivered accelerated STEM curriculum for 350+ students, improving term pass rates by 22%."
            },
            {
              type: "improvement",
              title: "Missing High-Value Remote Tool Stack Keywords",
              description: "ATS algorithms search for specific SaaS platforms and operational frameworks.",
              before: "Skilled in computer, typing, and communication.",
              after: "Tech Stack: Zendesk, Jira, Notion, Slack, HubSpot CRM, Google Workspace, Data Reconciliation, SLA Governance."
            }
          ],
          missingKeywords: ["SLA Management", "Cross-Functional Collaboration", "Zendesk", "HubSpot", "KPI Reporting", "Process Optimization"],
          freeSampleRewrite: {
            originalBullet: "Handled daily POS transaction reconciliation and bank drops.",
            upgradedBullet: "Directed end-of-day liquidity reconciliation for ₦45M+ monthly transaction volume with zero variance across 18 consecutive months.",
            explanation: "Converted a routine transactional duty into a high-trust financial governance metric."
          },
          matchedRemoteJobs: [
            {
              title: "Remote Customer Success & Operations Specialist",
              companyType: "US B2B SaaS Platform",
              salaryUSD: "$1,500/mo",
              salaryNaira: "₦1,950,000/mo",
              matchPercentage: 84,
              whyFit: "Matches your customer resolution track record; needs Zendesk keyword injection."
            },
            {
              title: "Virtual Executive Operations Assistant",
              companyType: "UK E-commerce Agency",
              salaryUSD: "$1,200/mo",
              salaryNaira: "₦1,560,000/mo",
              matchPercentage: 78,
              whyFit: "High alignment with multitasking and communication; requires project management framing."
            },
            {
              title: "Data Operations & Quality Associate",
              companyType: "Global AI & Tech Lab",
              salaryUSD: "$1,800/mo",
              salaryNaira: "₦2,340,000/mo",
              matchPercentage: 72,
              whyFit: "Requires quantifiable analytical bullets and spreadsheet certification keywords."
            }
          ],
          premiumFullRewrite: {
            professionalSummary: "Results-driven Operations Specialist with proven track record in workflow optimization, stakeholder communications, and high-volume reconciliation. Adept at leveraging modern CRM and cloud-based collaboration tools to drive 98%+ customer retention and SLA adherence in fast-paced global remote environments.",
            experienceBullets: [
              "Engineered streamlined customer ticketing workflow, reducing average ticket resolution time from 4.2 hours to 45 minutes.",
              "Spearheaded distributed merchant relations across 120+ key accounts, sustaining a 99.2% on-time reconciliation benchmark.",
              "Partnered with cross-functional product teams to document 40+ standard operating procedures (SOPs), accelerating team onboarding by 50%.",
              "Automated weekly reporting pipelines in Google Sheets/Excel, saving 8+ hours of manual administrative data compilation per sprint."
            ],
            hardSkills: [
              "Customer Experience (CX)", "Omnichannel Support", "SLA Governance", "Zendesk & Intercom",
              "Data Reconciliation", "Process Automation", "Cross-Functional Team Collaboration", "Stakeholder Management"
            ],
            coverLetter: "Dear Hiring Team,\n\nI am writing to express my enthusiastic interest in the remote role. With a proven background in driving high-efficiency operations, resolving complex stakeholder inquiries, and upholding stringent SLA benchmarks, I bring the dedication and technical agility required to excel in your distributed team.\n\nIn my previous roles, I successfully managed high-volume communications and introduced workflow automations that reduced resolution latency by over 35% while maintaining a 98%+ satisfaction rate. I am equipped with high-speed fiber internet, dedicated backup power infrastructure, and extensive experience collaborating synchronously and asynchronously across global time zones.\n\nI look forward to discussing how my skills and proactive work ethic can support your organizational milestones.\n\nWarm regards,\nCandidate"
          },
          viralShareText: `My CV ATS Score is ${simulatedScore}/100 🚀 on CVFix.com.ng! It matches remote US/UK roles paying up to $1,800/mo (~₦2.3M). Check your global ATS score free at cvfix.com.ng #CVFix #JapaCV #RemoteWork`
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
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              Unbeatable Value
            </span>
            <h2 className="text-4xl font-extrabold text-white mt-4">
              Simple, Transparent Nigerian Pricing
            </h2>
            <p className="text-slate-300 text-sm mt-2 max-w-xl mx-auto">
              Compare our ₦1,000 one-time career unlock against international tools charging $25/mo or local freelancers charging ₦20,000.
            </p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
              {/* Free Tier */}
              <div className="glass-card rounded-3xl p-8 border border-white/10 space-y-4">
                <h4 className="text-lg font-bold text-white">Free Basic Audit</h4>
                <div className="text-3xl font-black text-white">₦0</div>
                <ul className="text-xs text-slate-300 space-y-2.5">
                  <li>✅ Full ATS Score & Diagnostic Grade</li>
                  <li>✅ 3 Critical Flaws & Explanation</li>
                  <li>✅ 1 Free Sample Bullet Upgrade</li>
                  <li>✅ Live Dollar Salary Valuation</li>
                  <li>✅ Viral WhatsApp/X Score Badge</li>
                </ul>
              </div>

              {/* Paid Impulse Tier */}
              <div className="glass-card rounded-3xl p-8 border-2 border-emerald-500/50 bg-emerald-950/20 space-y-4 relative">
                <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-wider">
                  Most Popular
                </span>
                <h4 className="text-lg font-bold text-white">Full Career Unlock</h4>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-emerald-400">₦1,000</span>
                  <span className="text-xs text-emerald-300">one-time</span>
                </div>
                <ul className="text-xs text-slate-200 space-y-2.5">
                  <li>✅ Everything in Free Audit</li>
                  <li>✅ <strong>Complete Line-by-Line CV Rewrite</strong> (20+ Bullets)</li>
                  <li>✅ <strong>Full Naija-to-Global Reframe</strong> (NYSC, HND, Local Exp)</li>
                  <li>✅ <strong>Custom 1-Page Cover Letter</strong></li>
                  <li>✅ <strong>1-Click ATS-Certified PDF Export</strong></li>
                </ul>
                <button
                  onClick={() => setShowPaystackModal(true)}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
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
      <Footer />
    </div>
  );
}

export default App;
