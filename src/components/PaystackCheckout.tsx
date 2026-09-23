import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, Zap, Lock, CreditCard } from 'lucide-react';

interface PaystackCheckoutProps {
  onSuccess: () => void;
  onCancel: () => void;
  userEmail?: string;
}

declare global {
  interface Window {
    PaystackPop?: any;
  }
}

export const PaystackCheckout: React.FC<PaystackCheckoutProps> = ({ onSuccess, onCancel, userEmail = 'candidate@gmail.com' }) => {
  const [email, setEmail] = useState(userEmail);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaystackPayment = () => {
    setIsProcessing(true);

    // Paystack public key or simulation fallback
    const paystackKey = 'pk_test_sample_cvfix_nigeria'; // Can be set via config

    if (window.PaystackPop && window.PaystackPop.setup) {
      const handler = window.PaystackPop.setup({
        key: paystackKey,
        email: email || 'user@cvfix.com.ng',
        amount: 1000 * 100, // ₦1,000 in kobo
        currency: 'NGN',
        ref: 'CVFIX_' + Math.floor(Math.random() * 1000000000 + 1),
        callback: function (response: any) {
          setIsProcessing(false);
          onSuccess();
        },
        onClose: function () {
          setIsProcessing(false);
        },
      });
      handler.openIframe();
    } else {
      // Immediate instantaneous fallback simulation for local preview & testing
      setTimeout(() => {
        setIsProcessing(false);
        onSuccess();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl shadow-emerald-950/50 text-left">
        {/* Top Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Impulse Career Unlock
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-extrabold text-xs">
            Save 90% Today
          </span>
        </div>

        {/* Pricing Hook */}
        <div className="mt-5 text-center sm:text-left">
          <h3 className="text-2xl font-extrabold text-white">
            Unlock 1-Click Complete CV Overhaul + Tailored Cover Letter
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Get your recruiter-approved, Harvard-format ATS PDF ready to submit in 60 seconds.
          </p>

          <div className="my-5 p-4 rounded-2xl bg-gradient-to-br from-emerald-950/50 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 line-through">Regular Price: ₦10,000</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-3xl font-black text-emerald-400">₦1,000</span>
                <span className="text-xs text-emerald-200">one-time only (~$0.65)</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                ⚡ Instant Access
              </span>
            </div>
          </div>
        </div>

        {/* What You Get */}
        <div className="space-y-2.5 text-xs text-slate-200 mb-6">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Line-by-Line Achievement Rewriter:</strong> 20+ tailored action bullets built on Google's X-Y-Z formula.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Full Naija-to-Global Reframe:</strong> NYSC, HND, and local bank/retail transformed for US/UK recruiters.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Targeted 1-Page Cover Letter:</strong> Tailored specifically to your dream remote job.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>1-Click ATS-Certified PDF & Word Export:</strong> Single-page layout that passes all parsers.</span>
          </div>
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Your Email for Receipt & PDF Delivery:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@gmail.com"
            className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Payment Button */}
        <div className="space-y-3">
          <button
            onClick={handlePaystackPayment}
            disabled={isProcessing}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>{isProcessing ? "Processing via Paystack..." : "Pay ₦1,000 & Unlock Full Package"}</span>
          </button>

          <button
            onClick={onCancel}
            className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            No thanks, I'll stick with the free basic audit
          </button>
        </div>

        {/* Paystack Badges */}
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5" /> Pay with Card, Bank Transfer, USSD, OPay & PalmPay
          </span>
          <span className="font-semibold text-slate-400">🔒 Secured by Paystack</span>
        </div>
      </div>
    </div>
  );
};
