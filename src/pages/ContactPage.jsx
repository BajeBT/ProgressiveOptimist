import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, Calendar, Clock, Building2, Copy } from 'lucide-react';

export const ContactPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [copiedBankInfo, setCopiedBankInfo] = useState(false);

  const bankDetails = {
    bank: "Scotiabank",
    accountName: "Progressive Optimist",
    accountNum: "000451801",
    branch: "Haggatt Hall",
    routing: "66555"
  };

  const copyBankInfo = () => {
    const text = `To pay your Dues or Donate via Bank Deposit/Transfer:\nBank: ${bankDetails.bank}\nAccount Name: ${bankDetails.accountName}\nAccount #: ${bankDetails.accountNum}\nBranch: ${bankDetails.branch}\nTransit/Routing #: ${bankDetails.routing}`;
    navigator.clipboard.writeText(text);
    setCopiedBankInfo(true);
    setTimeout(() => setCopiedBankInfo(false), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/12468366185?text=Hello%20Progressive%20Optimist%20Club%20of%20Barbados!', '_blank');
  };

  return (
    <div className="space-y-12 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-optimist-gold px-3 py-1 rounded bg-amber-400/20">
          Get In Touch
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-semibold">
          Contact Progressive Optimist
        </h1>
        <p className="text-slate-300 text-xs sm:text-base max-w-2xl leading-relaxed">
          Have questions about joining our club, volunteering, or donating to youth initiatives in Barbados? Drop us a line!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Contact Cards */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
              Meeting Location & Details
            </h3>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start space-x-3">
                <Calendar className="w-4 h-4 text-optimist-blue dark:text-optimist-gold shrink-0 mt-0.5" />
                <span><strong>Schedule:</strong> 1st Working Monday of every month @ 6:00 PM for Guests</span>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-optimist-blue dark:text-optimist-gold shrink-0 mt-0.5" />
                <span>
                  <strong>Venue:</strong> Ross University, Lloyd Erskine Sandiford Centre (LESC), Two Mile Hill, St. Michael, Barbados
                </span>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-optimist-blue dark:text-optimist-gold shrink-0 mt-0.5" />
                <span><strong>Postal:</strong> The CEO, LESC, Two Mile Hill, St. Michael, Barbados</span>
              </div>
            </div>
          </div>

          {/* Official Bank Deposit Card */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white border border-amber-400/40 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                Bank Transfer & Dues Info
              </h3>
              <button onClick={copyBankInfo} className="text-[10px] text-amber-300 font-bold hover:underline">
                {copiedBankInfo ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div className="text-xs space-y-1.5 font-mono text-slate-300 bg-slate-800/90 p-4 rounded-2xl border border-slate-700">
              <p><strong>Bank:</strong> {bankDetails.bank}</p>
              <p><strong>Account Name:</strong> {bankDetails.accountName}</p>
              <p><strong>Account #:</strong> <span className="text-emerald-400 font-bold">{bankDetails.accountNum}</span></p>
              <p><strong>Branch:</strong> {bankDetails.branch}</p>
              <p><strong>Transit/Routing #:</strong> <span className="text-amber-300 font-bold">{bankDetails.routing}</span></p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-optimist-blue text-white space-y-4 shadow-xl">
            <h3 className="font-heading text-xl font-bold text-white">
              Direct Contact & Support
            </h3>
            
            <div className="space-y-3 text-xs text-blue-100">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-optimist-gold shrink-0" />
                <span><strong>Email:</strong> <a href="mailto:info@ProgressiveOptimist.org" className="hover:underline">info@ProgressiveOptimist.org</a></span>
              </div>
            </div>

            <button
              onClick={handleWhatsApp}
              className="w-full py-3 rounded-xl gold-gradient text-slate-950 font-bold text-xs shadow flex items-center justify-center gap-2 hover:brightness-110 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat via WhatsApp</span>
            </button>
          </div>

        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
              Send Us A Message
            </h2>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-center space-y-3 text-emerald-900 dark:text-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="font-heading font-bold text-xl">Message Delivered!</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                  Thank you for reaching out to the Progressive Optimist Club of Barbados. Your message has been sent to <strong>info@ProgressiveOptimist.org</strong>. We will get back to you shortly!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Your Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Maria Walcott"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="info@ProgressiveOptimist.org"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                  <select
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Membership Application">Membership Application</option>
                    <option value="Volunteering">Volunteering Opportunities</option>
                    <option value="Laptop Drive Donation">Laptop & Tablet Drive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Message Details *</label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="How can we assist you or collaborate?"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-optimist-blue hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-optimist-gold" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
