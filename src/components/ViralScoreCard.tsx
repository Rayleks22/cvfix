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
        backgroundColor: '#080c14',
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
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/30 my-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Visual Badge for Screenshot/Canvas Export */}
        <div 
          ref={badgeRef}
          className="w-full md:w-auto p-6 rounded-2xl bg-gradient-to-br from-[#0c1322] via-[#09151e] to-[#061b18] border border-emerald-500/40 shadow-xl max-w-sm text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/20 blur-2xl rounded-full pointer-events-none"></div>
          
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <span className="text-xs font-black tracking-wider text-emerald-400 uppercase">
              CVFix.com.ng
            </span>
            <span className="text-[10px] font-semibold text-slate-400">
              Verified ATS Audit
            </span>
          </div>

          <div className="my-2">
            <div className="inline-flex items-baseline gap-1">
              <span className="text-5xl font-black text-white">{atsScore}</span>
              <span className="text-sm font-bold text-emerald-400">/100</span>
            </div>
            <div className="mt-1">
              <span className="px-3 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                Grade: {grade} (ATS Ready)
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 text-left space-y-1">
            <p className="text-[11px] text-slate-400">Matched Career Track:</p>
            <p className="text-xs font-bold text-white truncate">{detectedRole}</p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-emerald-400 font-semibold">Remote Valuation:</span>
              <span className="text-xs font-extrabold text-white">{estimatedRemoteSalaryUSD}</span>
            </div>
          </div>
        </div>

        {/* Share Action Hooks */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-bold border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Share & Challenge Friends</span>
          </div>

          <h4 className="text-xl font-extrabold text-white">
            Show off your ATS Score & Dollar Earning Potential
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed max-w-md">
            Share your verified score badge on WhatsApp Status, X (Twitter), or LinkedIn to see how your friends compare!
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <button
              onClick={handleWhatsAppShare}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Share to WhatsApp Status</span>
            </button>

            <button
              onClick={handleTwitterShare}
              className="px-4 py-2.5 rounded-xl bg-[#1DA1F2] hover:bg-[#1a91da] text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              <Twitter className="w-4 h-4 fill-white" />
              <span>Share on X (Twitter)</span>
            </button>

            <button
              onClick={handleDownloadBadge}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-2 border border-white/10 transition-all active:scale-95"
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
