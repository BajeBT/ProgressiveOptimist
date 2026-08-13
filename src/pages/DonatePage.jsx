import React, { useState, useEffect } from 'react';
import { Heart, CheckCircle2, CreditCard, Building2, Copy, AlertCircle, Loader2, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Barbados dollar has been pegged at BBD 2 = USD 1 since 1975.
const BBD_TO_USD = 0.5;

export const DonatePage = () => {
  const { siteSettings } = useAuth();
  const [selectedTier, setSelectedTier] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [donationCanceled, setDonationCanceled] = useState(false);
  const [donationError, setDonationError] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [paidAmount, setPaidAmount] = useState(null);
  const [copiedBankInfo, setCopiedBankInfo] = useState(false);

  // Stripe redirects back here after checkout - read the outcome from the URL.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setDonationSuccess(true);
      setPaidAmount(params.get('amount'));
    } else if (params.get('canceled') === 'true') {
      setDonationCanceled(true);
    }
    if (params.has('success') || params.has('canceled')) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const copyBankInfo = () => {
    const text = `To pay your Dues or Donate via Bank Deposit/Transfer:\nBank: ${siteSettings?.bankName}\nAccount Name: ${siteSettings?.bankAccountName}\nAccount #: ${siteSettings?.bankAccountNumber}\nBranch: ${siteSettings?.bankBranch}\nTransit/Routing #: ${siteSettings?.bankRoutingNumber}`;
    navigator.clipboard.writeText(text);
    setCopiedBankInfo(true);
    setTimeout(() => setCopiedBankInfo(false), 3000);
  };

  const tiers = [
    { amount: 25, label: "Supporter", desc: "Provides educational books and school supplies for students" },
    { amount: 50, label: "Easter Cheer Sponsor", desc: "Supplies kites and holiday packages for primary kids" },
    { amount: 100, label: "Family Support Fund", desc: "Provides emergency family relief & student welfare support" },
    { amount: 250, label: "Community Youth Champion", desc: "Sponsors school outreach & youth development programs" }
  ];

  const handleDonateSubmit = async (e) => {
    e.preventDefault();
    setDonationError('');

    const amount = Number(customAmount || selectedTier);
    if (!Number.isFinite(amount) || amount < 5) {
      setDonationError('Donation amount must be at least $5 BBD.');
      return;
    }

    setIsRedirecting(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bbdAmount: amount, donorName, donorEmail })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setDonationError(data.message || 'Failed to start checkout. Please try again.');
        setIsRedirecting(false);
        return;
      }
      window.location.href = data.url;
    } catch (err) {
      console.error('Checkout error:', err);
      setDonationError('Network error. Please try again.');
      setIsRedirecting(false);
    }
  };

  return (
    <div className="space-y-12 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Hero Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-optimist-gold px-3 py-1 rounded bg-amber-400/20">
            Community Giving & Sponsorships
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-semibold">
            Support Bajan Youth Initiatives
          </h1>
          <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
            Your generous contributions support the Family Support Fund, RISE Summer Program, Easter Cheer Kite giveaways, school supply kits, and community youth initiatives across Barbados.
          </p>
        </div>
      </div>

      {/* OFFICIAL SCOTIABANK BANK TRANSFER INFORMATION BOX */}
      <div className="p-8 rounded-3xl bg-[#c1c4c7] dark:bg-slate-900 text-slate-900 dark:text-white border border-amber-400/40 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-400/50 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-400/40 flex items-center gap-1.5 w-fit">
              <Building2 className="w-3.5 h-3.5" /> Official Bank Transfer & Deposit Details
            </span>
            <h2 className="font-heading text-2xl font-semibold text-slate-900 dark:text-white">
              Pay Dues or Donate via Bank Transfer / Deposit
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Direct bank transfers can be sent to our official {siteSettings?.bankName} Barbados account details below:
            </p>
          </div>

          <button
            onClick={copyBankInfo}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow transition-all flex items-center gap-2 shrink-0 self-start md:self-auto"
          >
            <Copy className="w-4 h-4" />
            <span>{copiedBankInfo ? 'Copied Bank Details!' : 'Copy Bank Details'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block">Bank Name</span>
            <strong className="text-sm font-heading font-semibold text-slate-900 dark:text-white">{siteSettings?.bankName}</strong>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block">Account Name</span>
            <strong className="text-sm font-heading font-semibold text-amber-700 dark:text-amber-400">{siteSettings?.bankAccountName}</strong>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block">Account Number</span>
            <strong className="text-sm font-mono font-semibold text-emerald-600 dark:text-emerald-400">{siteSettings?.bankAccountNumber}</strong>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block">Branch Name</span>
            <strong className="text-sm font-heading font-semibold text-slate-900 dark:text-white">{siteSettings?.bankBranch}</strong>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block">Transit / Routing #</span>
            <strong className="text-sm font-mono font-semibold text-amber-700 dark:text-amber-400">{siteSettings?.bankRoutingNumber}</strong>
          </div>
        </div>
      </div>

      {/* Donation Tiers & Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Tier Cards */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
            General Club Sponsorship Tiers
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tiers.map((tier) => (
              <div
                key={tier.amount}
                onClick={() => {
                  setSelectedTier(tier.amount);
                  setCustomAmount('');
                }}
                className={`cursor-pointer p-5 rounded-2xl border transition-all duration-200 ${
                  selectedTier === tier.amount && !customAmount
                    ? 'bg-optimist-blue text-white border-optimist-gold shadow-lg ring-2 ring-optimist-gold'
                    : 'glass-card border-slate-200 dark:border-slate-800 hover:border-blue-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-heading text-2xl font-semibold">${tier.amount} BBD</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${selectedTier === tier.amount ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 dark:bg-slate-800'}`}>
                    {tier.label}
                  </span>
                </div>
                <p className={`text-xs ${selectedTier === tier.amount ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {tier.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Donation Checkout Form */}
        <div className="lg:col-span-5">
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <h3 className="font-heading text-xl font-bold">General Support Donation</h3>
            </div>

            {donationSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-center space-y-3 text-emerald-900 dark:text-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="font-heading font-bold text-lg">Thank You For Your Contribution!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {paidAmount
                    ? <>Your generous gift of <strong>${paidAmount} USD</strong> will directly support youth projects in Barbados.</>
                    : <>Your generous gift will directly support youth projects in Barbados.</>}
                </p>
              </div>
            ) : (
              <form onSubmit={handleDonateSubmit} className="space-y-4">
                {donationCanceled && (
                  <div className="p-3 rounded-xl bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold flex items-start gap-2">
                    <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Checkout was canceled. No charge was made - feel free to try again whenever you're ready.</span>
                  </div>
                )}

                {donationError && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800 text-xs font-semibold flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{donationError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Donation Amount (BBD)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="5"
                      value={customAmount || selectedTier}
                      onChange={e => setCustomAmount(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold outline-none"
                      disabled={isRedirecting}
                      required
                    />
                    <span className="text-xs font-bold text-slate-500">BBD</span>
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    Charged as <strong>${(Number(customAmount || selectedTier) * BBD_TO_USD || 0).toFixed(2)} USD</strong> (BBD is pegged at 2 = 1 USD).
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={e => setDonorName(e.target.value)}
                    placeholder="e.g. John Sobers"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none"
                    disabled={isRedirecting}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={donorEmail}
                    onChange={e => setDonorEmail(e.target.value)}
                    placeholder="info@ProgressiveOptimist.org"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none"
                    disabled={isRedirecting}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isRedirecting}
                  className="w-full py-3.5 rounded-xl gold-gradient text-slate-950 font-bold text-xs shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isRedirecting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Redirecting to secure checkout…</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Donate ${customAmount || selectedTier} BBD Now</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
