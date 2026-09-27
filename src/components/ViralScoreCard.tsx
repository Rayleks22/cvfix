import React, { useRef } from 'react';
import { Share2, Download, MessageSquare, Twitter, Sparkles, Award } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ViralScoreCardProps {
  atsScore: number;
  grade: string;
  detectedRole: string;
  estimatedRemoteSalaryUSD: string;
  estimatedSalaryNaira: string;
}

export const ViralScoreCard: React.FC<ViralScoreCardProps> = ({
  atsScore,
  grade,
  detectedRole,
  estimatedRemoteSalaryUSD,
  estimatedSalaryNaira,
}) => {
  const badgeRef = useRef<HTMLDivElement>(null);

  const shareText = `I just tested my CV on CVFix.com.ng — My ATS Score is ${atsScore}/100 (${grade}) 🚀. Matched with remote roles paying up to ${estimatedRemoteSalaryUSD} (${estimatedSalaryNaira})! Test your CV free at cvfix.com.ng #CVFix #JapaCV #RemoteWork`;

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleDownloadBadge = async () => {
    if (!badgeRef.current) return;
    try {
      const canvas = await html2canvas(badgeRef.current, {
        scale: 2,
        backgroundColor: '#FFFFFF',
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `CVFix_ATS_Scorecard_${atsScore}.png`;
      link.click();
    } catch (err) {
      console.error("Error generating badge image:", err);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm my-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Visual Badge for Screenshot/Canvas Export */}
        <div 
          ref={badgeRef}
          className="w-full md:w-auto p-6 rounded-2xl bg-slate-900 text-white shadow-md max-w-sm text-center relative overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <span className="text-xs font-black tracking-wider text-teal-400 uppercase">
              CVFix.com.ng
            </span>
            <span className="text-[10px] font-semibold text-slate-400">
              Verified ATS Audit
            </span>
          </div>

          <div className="my-2">
            <div className="inline-flex items-baseline gap-1">
              <span className="text-5xl font-black text-white">{atsScore}</span>
              <span className="text-sm font-bold text-teal-400">/100</span>
            </div>
            <div className="mt-1">
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Grade: {grade} (ATS Ready)
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-left space-y-1">
            <p className="text-[11px] text-slate-400">Matched Career Track:</p>
            <p className="text-xs font-bold text-white truncate">{detectedRole}</p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-teal-400 font-semibold">Remote Valuation:</span>
              <span className="text-xs font-bold text-white">{estimatedRemoteSalaryUSD}</span>
            </div>
          </div>
        </div>

        {/* Share Action Hooks */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
            <Sparkles className="w-3.5 h-3.5 text-teal-700" />
            <span>Benchmark with Colleagues</span>
          </div>

          <h4 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Share Your ATS Score & Dollar Valuation
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed max-w-md">
            Share your verified diagnostic scorecard on WhatsApp Status, LinkedIn, or X to compare with your professional network.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <button
              onClick={handleWhatsAppShare}
              className="px-4 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Share to WhatsApp Status</span>
            </button>

            <button
              onClick={handleTwitterShare}
              className="px-4 py-2.5 rounded-xl bg-[#1DA1F2] hover:bg-[#1a91da] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <Twitter className="w-4 h-4 fill-white" />
              <span>Share on X</span>
            </button>

            <button
              onClick={handleDownloadBadge}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 border border-slate-200 shadow-sm transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Save Image Badge</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
