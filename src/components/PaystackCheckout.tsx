import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, Lock, CreditCard, X } from 'lucide-react';

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
    const paystackKey = 'pk_test_sample_cvfix_nigeria';

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
      setTimeout(() => {
        setIsProcessing(false);
        onSuccess();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xl text-left">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
            Executive Career Unlock
          </span>
          <span className="ml-auto mr-6 px-2 py-0.5 rounded bg-teal-50 text-teal-800 text-[10px] font-bold border border-teal-200">
            Special Launch Offer
          </span>
        </div>

        {/* Pricing Box */}
        <div className="mt-5">
          <h3 className="text-xl font-extrabold text-slate-900">
            Unlock Full Line-by-Line CV Rewrite & Cover Letter
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Certified Harvard-format ATS PDF ready for direct job submission.
          </p>

          <div className="my-5 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 line-through">Standard Fee: ₦10,000</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-3xl font-extrabold text-slate-900">₦1,000</span>
                <span className="text-xs text-teal-800 font-semibold">one-time only (~$0.75)</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-200">
                Instant Delivery
              </span>
            </div>
          </div>
        </div>

        {/* Features Checklist */}
        <div className="space-y-2.5 text-xs text-slate-700 mb-6">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <span><strong>Line-by-Line Achievement Rewriter:</strong> 20+ action bullets built on Google's X-Y-Z formula.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <span><strong>Full Naija-to-Global Reframe:</strong> NYSC, HND, and local experience translated for global recruiters.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <span><strong>Targeted 1-Page Cover Letter:</strong> Tailored specifically to your dream remote role.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <span><strong>1-Click ATS-Certified PDF Export:</strong> Clean single-page layout that passes all parsers.</span>
          </div>
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Email for Receipt & PDF Delivery:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@gmail.com"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-teal-700 focus:bg-white"
          />
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <button
            onClick={handlePaystackPayment}
            disabled={isProcessing}
            className="w-full py-3.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>{isProcessing ? "Connecting to Paystack..." : "Pay ₦1,000 & Unlock Full Package"}</span>
          </button>
        </div>

        {/* Security Seals */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-slate-400" /> Card, Bank Transfer, USSD, OPay & PalmPay
          </span>
          <span className="font-semibold text-slate-600">🔒 256-Bit SSL Secured</span>
        </div>
      </div>
    </div>
  );
};
