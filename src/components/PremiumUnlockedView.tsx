import React, { useState } from 'react';
import { Sparkles, Download, Copy, Check, FileText, ArrowLeft, Star, ShieldCheck, Mail } from 'lucide-react';
import { AnalysisResult } from '../types';
import jsPDF from 'jspdf';

interface PremiumUnlockedViewProps {
  result: AnalysisResult;
  onBack: () => void;
}

export const PremiumUnlockedView: React.FC<PremiumUnlockedViewProps> = ({ result, onBack }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const premium = result.premiumFullRewrite;

  const handleCopy = (text: string, sectionName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleDownloadPDF = () => {
    setIsExportingPDF(true);
    try {
      const doc = new jsPDF({
        format: 'a4',
        unit: 'pt',
      });

      const margin = 40;
      let y = 50;

      // Header: Candidate Name & Target Role
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("PROFESSIONAL RESUME", margin, y);
      y += 18;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      doc.text(`Target Specialization: ${result.candidateProfile.detectedRole}`, margin, y);
      y += 14;
      doc.text(`Contact: candidate.career@gmail.com | Lagos, Nigeria (Available for Global Remote)`, margin, y);
      y += 18;

      // Line divider
      doc.setDrawColor(210, 210, 210);
      doc.setLineWidth(1);
      doc.line(margin, y, 555, y);
      y += 18;

      // Section 1: Professional Summary
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text("PROFESSIONAL SUMMARY", margin, y);
      y += 14;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      const summaryLines = doc.splitTextToSize(premium.professionalSummary, 515);
      doc.text(summaryLines, margin, y);
      y += summaryLines.length * 13 + 14;

      // Section 2: Core Competencies & Skills
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text("CORE TECHNICAL & OPERATIONAL COMPETENCIES", margin, y);
      y += 14;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      const skillsStr = premium.hardSkills.join("  •  ");
      const skillsLines = doc.splitTextToSize(skillsStr, 515);
      doc.text(skillsLines, margin, y);
      y += skillsLines.length * 13 + 14;

      // Section 3: High-Impact Experience Bullets
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text("KEY PROFESSIONAL ACHIEVEMENTS (QUANTIFIED METRICS)", margin, y);
      y += 14;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);

      premium.experienceBullets.forEach((bullet) => {
        const bulletLines = doc.splitTextToSize(`•  ${bullet}`, 505);
        doc.text(bulletLines, margin + 10, y);
        y += bulletLines.length * 12 + 8;
      });

      // Save PDF
      doc.save(`CVFix_ATS_Optimized_Resume.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 shadow-sm flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Audit Report</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownloadPDF}
            disabled={isExportingPDF}
            className="px-6 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs shadow-sm flex items-center gap-2 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{isExportingPDF ? "Generating PDF..." : "Download ATS PDF"}</span>
          </button>
        </div>
      </div>

      {/* Confirmation Header */}
      <div className="p-6 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-11 h-11 rounded-xl bg-teal-800 flex items-center justify-center shrink-0 text-white shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-900 text-[10px] font-extrabold uppercase tracking-wider">
              Unlocked & Certified
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
              Your Recruiter-Approved CV & Cover Letter Package
            </h3>
            <p className="text-xs text-slate-600">
              Formatted according to standard Harvard/Stanford single-page ATS rules.
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Professional Summary */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Star className="w-4 h-4 text-teal-700 fill-teal-700" />
            <span>1. Optimized Executive Summary</span>
          </h4>
          <button
            onClick={() => handleCopy(premium.professionalSummary, 'summary')}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            {copiedSection === 'summary' ? <Check className="w-3.5 h-3.5 text-teal-700" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'summary' ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
        <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 font-normal">
          {premium.professionalSummary}
        </p>
      </div>

      {/* Section 2: Experience Bullets */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-700" />
            <span>2. High-Impact Work Experience (Google X-Y-Z Metric Bullets)</span>
          </h4>
          <button
            onClick={() => handleCopy(premium.experienceBullets.join("\n"), 'bullets')}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            {copiedSection === 'bullets' ? <Check className="w-3.5 h-3.5 text-teal-700" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'bullets' ? 'Copied All!' : 'Copy All'}</span>
          </button>
        </div>

        <div className="space-y-3">
          {premium.experienceBullets.map((bullet, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 flex items-start space-x-3"
            >
              <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="leading-relaxed flex-1">{bullet}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Hard Skills */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-4">
          3. Core Technical Competencies & Software Tools
        </h4>
        <div className="flex flex-wrap gap-2">
          {premium.hardSkills.map((skill, i) => (
            <span
              key={i}
              className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Section 4: Tailored Cover Letter */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Mail className="w-4 h-4 text-teal-700" />
            <span>4. Tailored Remote Cover Letter</span>
          </h4>
          <button
            onClick={() => handleCopy(premium.coverLetter, 'coverLetter')}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            {copiedSection === 'coverLetter' ? <Check className="w-3.5 h-3.5 text-teal-700" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'coverLetter' ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 font-sans text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
          {premium.coverLetter}
        </div>
      </div>
    </div>
  );
};
