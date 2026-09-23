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
      doc.setFontSize(18);
      doc.text("PROFESSIONAL RESUME", margin, y);
      y += 20;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      doc.text(`Target Specialization: ${result.candidateProfile.detectedRole}`, margin, y);
      y += 15;
      doc.text(`Contact: candidate.career@gmail.com | Lagos, Nigeria (Available for Global Remote)`, margin, y);
      y += 20;

      // Line divider
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(1);
      doc.line(margin, y, 555, y);
      y += 20;

      // Section 1: Professional Summary
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("PROFESSIONAL SUMMARY", margin, y);
      y += 15;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(40, 40, 40);
      const summaryLines = doc.splitTextToSize(premium.professionalSummary, 515);
      doc.text(summaryLines, margin, y);
      y += summaryLines.length * 13 + 15;

      // Section 2: Core Competencies & Skills
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("CORE TECHNICAL & OPERATIONAL COMPETENCIES", margin, y);
      y += 15;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(40, 40, 40);
      const skillsStr = premium.hardSkills.join("  •  ");
      const skillsLines = doc.splitTextToSize(skillsStr, 515);
      doc.text(skillsLines, margin, y);
      y += skillsLines.length * 13 + 15;

      // Section 3: High-Impact Experience Bullets
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("KEY PROFESSIONAL ACHIEVEMENTS (QUANTIFIED METRICS)", margin, y);
      y += 15;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(40, 40, 40);

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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-white/10 flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Audit</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownloadPDF}
            disabled={isExportingPDF}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{isExportingPDF ? "Generating PDF..." : "Download ATS PDF"}</span>
          </button>
        </div>
      </div>

      {/* Unlocked Confirmation Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/40 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
              Unlocked & Ready
            </span>
            <h3 className="text-xl font-black text-white mt-1">
              Your 100% Recruiter-Certified CV & Cover Letter
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Optimized for Taleo, Greenhouse, and international hiring teams.
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Professional Summary */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            <span>1. Optimized Executive Summary</span>
          </h4>
          <button
            onClick={() => handleCopy(premium.professionalSummary, 'summary')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            {copiedSection === 'summary' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'summary' ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed font-sans bg-slate-900/60 p-4 rounded-xl border border-white/5">
          {premium.professionalSummary}
        </p>
      </div>

      {/* Section 2: Experience Bullets */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>2. High-Impact Work Experience (X-Y-Z Metric Bullets)</span>
          </h4>
          <button
            onClick={() => handleCopy(premium.experienceBullets.join("\n"), 'bullets')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            {copiedSection === 'bullets' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'bullets' ? 'Copied All!' : 'Copy All'}</span>
          </button>
        </div>

        <div className="space-y-3">
          {premium.experienceBullets.map((bullet, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl bg-slate-900/60 border border-white/5 text-xs sm:text-sm text-slate-200 flex items-start space-x-3"
            >
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="leading-relaxed flex-1">{bullet}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Hard Skills & Tech Stack */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10">
        <h4 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <span>3. Remote Core Competencies & Software Tools</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {premium.hardSkills.map((skill, i) => (
            <span
              key={i}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-semibold"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Section 4: Tailored Cover Letter */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-400" />
            <span>4. Tailored 1-Page Remote Cover Letter</span>
          </h4>
          <button
            onClick={() => handleCopy(premium.coverLetter, 'coverLetter')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            {copiedSection === 'coverLetter' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'coverLetter' ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/90 border border-white/5 font-mono text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
          {premium.coverLetter}
        </div>
      </div>
    </div>
  );
};
