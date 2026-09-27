import React, { useState } from 'react';
import { Upload, FileText, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Zap, Globe, DollarSign, Award } from 'lucide-react';

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
      if (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        // @ts-ignore
        if (typeof window !== 'undefined' && window.pdfjsLib) {
          // @ts-ignore
          const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
          const pdf = await loadingTask.promise;
          let extractedText = '';

          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageItems = textContent.items.map((item: any) => item.str).join(' ');
            extractedText += pageItems + '\n\n';
          }

          if (extractedText.trim().length > 20) {
            setCvText(extractedText.trim());
            setActiveInputTab('paste');
            setIsExtracting(false);
            return;
          }
        }
      }

      // Plain text or standard document fallback
      const text = await file.text();
      if (text && text.trim().length > 20 && !text.startsWith('%PDF')) {
        setCvText(text.trim());
        setActiveInputTab('paste');
      } else {
        const cleaned = text.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
        if (cleaned.length > 30) {
          setCvText(cleaned);
          setActiveInputTab('paste');
        }
      }
    } catch (err) {
      console.error("PDF Parsing error:", err);
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
    <div className="pt-10 pb-16 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Institutional Trust Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold mb-6 shadow-sm">
          <Award className="w-3.5 h-3.5 text-teal-700" />
          <span>Benchmarked Against Workday, Taleo & Greenhouse ATS Rules</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.18]">
          Optimize Your Nigerian CV for <br className="hidden sm:inline" />
          <span className="text-teal-800">Global Remote Roles</span> & High-Tier Placement
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Get an immediate ATS compatibility diagnostic. Automatically reframe <strong>NYSC, local degrees, and Nigerian corporate experience</strong> into international, metric-driven achievements.
        </p>

        {/* Pillar Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-700" />
            <span>Objective 0–100 ATS Score</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-teal-700" />
            <span>Naija-to-Global Reframe</span>
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-teal-700" />
            <span>USD Salary Benchmark</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>100% Confidential</span>
          </div>
        </div>

        {/* Scanner Card */}
        <div className="mt-10 max-w-3xl mx-auto bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 text-left">
          {/* Tab Selector */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveInputTab('upload')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                  activeInputTab === 'upload'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-4 h-4 text-teal-700" />
                <span>Upload Document (PDF / Word)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveInputTab('paste')}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                  activeInputTab === 'paste'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4 text-teal-700" />
                <span>Paste CV Text</span>
              </button>
            </div>

            <button
              type="button"
              onClick={loadSampleCV}
              className="text-xs text-teal-800 hover:text-teal-900 font-semibold underline decoration-teal-300"
            >
              Load Sample Nigerian CV
            </button>
          </div>

          <form onSubmit={handleScanSubmit}>
            {/* Target Role Input */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Role / Industry Specialization (Optional):
              </label>
              <input
                type="text"
                placeholder="e.g. Remote Customer Success Specialist, Virtual Assistant, Junior Developer, Operations..."
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-teal-700 focus:bg-white transition-colors"
              />
            </div>

            {/* Upload Area */}
            {activeInputTab === 'upload' && (
              <div className="border-2 border-dashed border-slate-200 hover:border-teal-700 rounded-2xl p-8 text-center transition-all bg-slate-50/50 hover:bg-slate-50 group cursor-pointer relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                  <Upload className="w-6 h-6 text-teal-800" />
                </div>
                <p className="text-sm font-bold text-slate-800">
                  {fileName ? `Selected: ${fileName}` : "Click to select or drag and drop your CV file"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports PDF, DOCX, DOC, or TXT formats (Up to 5MB)
                </p>
                <div className="mt-3 inline-block px-3 py-1 rounded-md bg-white border border-slate-200 text-[11px] text-slate-500 font-medium">
                  🔒 Document parsed locally. Zero data stored or retained.
                </div>
              </div>
            )}

            {/* Paste Area */}
            {activeInputTab === 'paste' && (
              <div>
                <textarea
                  rows={8}
                  placeholder="Paste your CV text here (Summary, Work History, Education, Skills)..."
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-sans focus:outline-none focus:border-teal-700 focus:bg-white transition-colors resize-y leading-relaxed"
                />
              </div>
            )}

            {/* Action Bar */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                Free Diagnostic Evaluation & Bullet Upgrade
              </span>
              <button
                type="submit"
                disabled={isLoading || isExtracting}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-teal-200" />
                <span>Run Free ATS Diagnostic</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
