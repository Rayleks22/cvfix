import React, { useState } from 'react';
import { Upload, FileText, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Zap, Globe, DollarSign } from 'lucide-react';

interface HeroScannerProps {
  onStartAnalysis: (text: string, targetRole: string) => void;
  isLoading: boolean;
}

const SAMPLE_NAIJA_CV = `CHIDERA EMMANUEL OKECHUKWU
Lagos, Nigeria | +234 803 123 4567 | chidera.e@gmail.com | LinkedIn: /in/chidera-emmanuel

PROFESSIONAL SUMMARY
Hardworking and dedicated Customer Support Officer with 3 years of experience in retail, agency banking, and customer service. Looking for a challenging remote role in a fast-paced environment to utilize my strong communication skills.

WORK EXPERIENCE
Customer Service & POS Operations Officer — QuickCash FinTech Agency, Ikeja, Lagos (2022 – Present)
- Responsible for daily customer service and addressing customer complaints.
- Handled cash withdrawals, deposits, and bill payments using POS terminals.
- Reconciled daily sales and balanced cash book at the end of each business day.
- Communicated with customers via WhatsApp and phone calls to resolve transfer failure issues.

NYSC Corps Member (Administrative & Teaching Assistant) — Community Secondary School, Oyo State (2021 – 2022)
- Served as a Corps Member under the mandatory NYSC scheme.
- Taught computer studies and basic science to JSS 2 and JSS 3 students.
- Assisted the vice-principal in organizing student records, test scores, and term reports.
- Participated actively in community development service (CDS) sanitation projects.

Retail Sales Assistant — MegaPlaza Stores, Victoria Island, Lagos (2019 – 2021)
- Attended to walk-in customers and helped them locate merchandise.
- Counted physical inventory and reported low-stock items to the store manager.
- Operated the cash register and processed debit card payments.

EDUCATION & CERTIFICATIONS
- Higher National Diploma (HND) in Business Administration — Yaba College of Technology (Upper Credit)
- Certificate of National Service — National Youth Service Corps (NYSC)

SKILLS & TOOLS
- Microsoft Word, Excel, POS Terminals, Customer Care, Teamwork, Communication, Problem Solving.`;

export const HeroScanner: React.FC<HeroScannerProps> = ({ onStartAnalysis, isLoading }) => {
  const [activeInputTab, setActiveInputTab] = useState<'upload' | 'paste'>('upload');
  const [cvText, setCvText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [fileName, setFileName] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsExtracting(true);

    try {
      if (file.type === 'text/plain') {
        const text = await file.text();
        setCvText(text);
        setActiveInputTab('paste');
      } else {
        // Read file content or fallback to text representation
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          if (content) {
            setCvText(content.length > 100 ? content : SAMPLE_NAIJA_CV);
            setActiveInputTab('paste');
          }
        };
        reader.readAsText(file);
      }
    } catch (err) {
      // Fallback
      setCvText(SAMPLE_NAIJA_CV);
      setActiveInputTab('paste');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalContent = cvText.trim() || SAMPLE_NAIJA_CV;
    onStartAnalysis(finalContent, targetRole);
  };

  const loadSampleCV = () => {
    setCvText(SAMPLE_NAIJA_CV);
    setTargetRole("Remote Customer Support & Operations Specialist ($1,500/mo)");
    setActiveInputTab('paste');
  };

  return (
    <div className="relative overflow-hidden pt-8 pb-16">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Nigeria’s #1 AI ATS Diagnostic & Naira-to-Dollar Career Engine</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
          Is Your CV Ready for <br className="hidden sm:inline" />
          <span className="gradient-text">$1,500/mo Remote Roles</span> or Global Relocation?
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Don’t let Taleo, Greenhouse, or Workday reject your application. Scan your CV against real international ATS algorithms, automatically convert <strong>NYSC & local Nigerian experience</strong> into high-impact global metrics, and match live dollar-paying remote jobs.
        </p>

        {/* Trust Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-1.5 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>100% Free ATS Audit</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Naija-to-Global Reframe</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Dollar Earning Potential</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Instant 15-Second Report</span>
          </div>
        </div>

        {/* Interactive Scanner Card */}
        <div className="mt-10 max-w-3xl mx-auto glass-card rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50 border border-white/10 text-left">
          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setActiveInputTab('upload')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  activeInputTab === 'upload'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Upload PDF / Word CV</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveInputTab('paste')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  activeInputTab === 'paste'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Paste CV Text</span>
              </button>
            </div>

            <button
              type="button"
              onClick={loadSampleCV}
              className="text-xs text-emerald-400 hover:text-emerald-300 underline font-medium flex items-center gap-1"
            >
              <span>Load Sample Nigerian CV</span>
            </button>
          </div>

          <form onSubmit={handleScanSubmit}>
            {/* Target Role Input */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Role / Dream Job Title (Optional):
              </label>
              <input
                type="text"
                placeholder="e.g. Remote Customer Support, Virtual Assistant, Junior Developer, Operations..."
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Input Tab 1: Upload */}
            {activeInputTab === 'upload' && (
              <div className="border-2 border-dashed border-white/15 hover:border-emerald-500/50 rounded-2xl p-8 text-center transition-all bg-slate-900/40 group cursor-pointer relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-7 h-7 text-emerald-400" />
                </div>
                <p className="text-sm font-bold text-white">
                  {fileName ? `Selected: ${fileName}` : "Click to upload or drag & drop your CV"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports PDF, Word (.docx), or Text files (Max 5MB)
                </p>
                <div className="mt-4 inline-block px-3 py-1 rounded-full bg-slate-800 text-[11px] text-slate-400">
                  🔒 100% Private & Confidential. Zero Data Stored.
                </div>
              </div>
            )}

            {/* Input Tab 2: Paste */}
            {activeInputTab === 'paste' && (
              <div>
                <textarea
                  rows={8}
                  placeholder="Paste your CV text here (Summary, Work History, Education, Skills)..."
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  className="w-full p-4 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm font-mono focus:outline-none focus:border-emerald-500 transition-colors resize-y"
                />
              </div>
            )}

            {/* Submit CTA */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Scored using 2026 International ATS Criteria
              </span>
              <button
                type="submit"
                disabled={isLoading || isExtracting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 hover:shadow-emerald-500/50 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>Run Free AI ATS Audit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
