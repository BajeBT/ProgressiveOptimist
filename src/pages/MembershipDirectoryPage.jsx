import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  clubMetadata,
  currentOfficers2025,
  officersElect2026,
  activeRoster21
} from '../data/rosterData';
import {
  Users,
  Search,
  MapPin,
  Calendar,
  Building2,
  Mail,
  Phone,
  Award,
  Crown,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Download,
  BookOpen,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Lock,
  ShieldAlert,
  User
} from 'lucide-react';

export const MembershipDirectoryPage = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [tab, setTab] = useState('roster'); // 'roster' | 'officers' | 'club-info'
  const [expandedMemberId, setExpandedMemberId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedMemberId(prev => (prev === id ? null : id));
  };

  const filteredRoster = activeRoster21.filter(m =>
    m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ACCESS CONTROL CHECK: Member roster is restricted to logged-in members ONLY
  if (!currentUser) {
    return (
      <div className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
        
        <div className="p-10 sm:p-14 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl space-y-6 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 px-3 py-1 rounded bg-amber-400/10 border border-amber-400/20">
              Members Only Access
            </span>
            <h1 className="font-heading text-3xl font-black text-white">
              Official Member Roster Restricted
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
              The official membership directory, contact phone numbers, addresses, and officer roster for <strong>{clubMetadata.legalName}</strong> are accessible exclusively to authenticated club members.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/membership"
              className="w-full sm:w-auto px-6 py-3 rounded-xl gold-gradient text-slate-950 font-bold text-xs shadow hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>Log In To Member Portal</span>
            </Link>

            <Link
              to="/contact"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors"
            >
              Contact Executive Officers
            </Link>
          </div>
        </div>

        {/* Public Club Metadata Summary */}
        <div className="p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 max-w-2xl mx-auto text-left space-y-3">
          <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-optimist-blue" />
            Public Charter Information (Club # {clubMetadata.clubNumber})
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            <strong>District:</strong> {clubMetadata.district} • <strong>Charter Date:</strong> {clubMetadata.charterDate}<br />
            <strong>Meeting Place:</strong> {clubMetadata.meetingPlace.venue} (1st Monday of Month @ 5:30 PM)
          </p>
        </div>

      </div>
    );
  }

  // IF LOGGED IN: Render Full Interactive Directory
  return (
    <div className="space-y-12 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-slate-900 text-white p-8 sm:p-12 overflow-hidden border border-slate-800 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-optimist-gold px-3 py-1 rounded bg-amber-400/20 border border-amber-400/30">
              Club # {clubMetadata.clubNumber} • District {clubMetadata.district}
            </span>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 px-3 py-1 rounded bg-emerald-950/60 border border-emerald-500/40">
              Status: {clubMetadata.status}
            </span>
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-300 px-3 py-1 rounded bg-blue-950/60 border border-blue-500/40">
              Authenticated Member: {currentUser.name}
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl font-black text-white">
            Official Club Directory & Active Roster
          </h1>
          
          <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
            Official Optimist International Member Directory for <strong>{clubMetadata.legalName}</strong>. Chartered on {clubMetadata.charterDate} in {clubMetadata.location}.
          </p>
        </div>
      </div>

      {/* Navigation Switcher Tabs */}
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTab('roster')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              tab === 'roster'
                ? 'bg-optimist-blue text-white shadow'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Active Member Roster (21 Members)
          </button>

          <button
            onClick={() => setTab('officers')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              tab === 'officers'
                ? 'bg-optimist-blue text-white shadow'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Current Officers & Elect Leadership
          </button>

          <button
            onClick={() => setTab('club-info')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              tab === 'club-info'
                ? 'bg-optimist-blue text-white shadow'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Club Charter & Meeting Details
          </button>
        </div>

        <button
          onClick={() => alert("Exporting Official Club Roster (21 Members with phone numbers and addresses)...")}
          className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Directory</span>
        </button>
      </div>

      {/* TAB 1: ACTIVE MEMBER ROSTER */}
      {tab === 'roster' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search name, phone, address or ID..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
              />
            </div>

            <span className="text-xs font-bold text-slate-500">
              Showing {filteredRoster.length} of 21 Active Members (Click row for details)
            </span>
          </div>

          <div className="rounded-3xl overflow-hidden glass-card border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Member ID</th>
                    <th className="p-4">Member Name</th>
                    <th className="p-4">Contact Phone & Email</th>
                    <th className="p-4">Role / Designation</th>
                    <th className="p-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredRoster.map((m) => {
                    const isExpanded = expandedMemberId === m.id;
                    return (
                      <React.Fragment key={m.id}>
                        <tr
                          onClick={() => toggleExpand(m.id)}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                        >
                          <td className="p-4 font-mono font-bold text-slate-500 dark:text-slate-400">
                            {m.id}
                          </td>
                          <td className="p-4">
                            <strong className="font-heading text-sm text-slate-900 dark:text-white block">
                              {m.fullName}
                            </strong>
                            <span className="text-[10px] text-slate-400">{m.gender} • Joined {m.joinDate}</span>
                          </td>
                          <td className="p-4 space-y-0.5">
                            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                              <Phone className="w-3 h-3 text-optimist-blue" />
                              <span>{m.phone}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Mail className="w-3 h-3 text-optimist-blue" />
                              <a href={`mailto:${m.email}`} onClick={e => e.stopPropagation()} className="hover:underline text-optimist-blue dark:text-amber-400">
                                {m.email}
                              </a>
                            </div>
                          </td>
                          <td className="p-4 text-slate-700 dark:text-slate-300 font-semibold">
                            {m.role}
                          </td>
                          <td className="p-4 text-right">
                            <button className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </td>
                        </tr>

                        {/* Expandable Details Row */}
                        {isExpanded && (
                          <tr className="bg-slate-50/80 dark:bg-slate-850">
                            <td colSpan={5} className="p-4 space-y-2 border-t border-slate-200 dark:border-slate-700">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                <div>
                                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Residential / Mailing Address</span>
                                  <p className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5">{m.address}</p>
                                </div>
                                <div>
                                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Sponsor / Endorsement</span>
                                  <p className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5">{m.sponsor}</p>
                                </div>
                                <div>
                                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Member Status</span>
                                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                                    {m.status} (Chartered {m.joinDate})
                                  </span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CURRENT OFFICERS & ELECT LEADERSHIP */}
      {tab === 'officers' && (
        <div className="space-y-12">
          
          {/* Current Officers 2025 - 2026 */}
          <section className="space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-optimist-blue dark:text-optimist-gold">
                October 1st, 2025 – September 30th, 2026
              </span>
              <h2 className="font-heading text-2xl font-black text-slate-900 dark:text-white">
                Current Executive Officers & Board Directors
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentOfficers2025.map((officer, idx) => (
                <div key={idx} className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4 shadow-lg flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={officer.avatar}
                        alt={officer.name}
                        className="w-14 h-14 rounded-2xl border-2 border-amber-400 object-cover shadow"
                      />
                      <div>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300">
                          {officer.role}
                        </span>
                        <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white mt-1">
                          {officer.name}
                        </h3>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {officer.id}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-optimist-blue shrink-0 mt-0.5" />
                        <span>{officer.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-optimist-blue shrink-0" />
                        <span>{officer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-optimist-blue shrink-0" />
                        <a href={`mailto:${officer.email}`} className="text-optimist-blue dark:text-amber-400 hover:underline">
                          {officer.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Officers-Elect 2026 - 2027 */}
          <section className="space-y-6">
            <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl space-y-6">
              <div className="space-y-1 border-b border-slate-800 pb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-optimist-gold flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-400" /> Incoming Executive Committee
                </span>
                <h2 className="font-heading text-2xl font-black text-white">
                  Club Officers-Elect (October 1st, 2026 – September 30th, 2027)
                </h2>
                <p className="text-xs text-slate-400">
                  Confirmed leadership team elected to guide the Progressive Optimist Club of Barbados into the 2026/2027 term.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {officersElect2026.map((elect, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700 space-y-3 shadow">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 block w-fit">
                      {elect.role}
                    </span>
                    <h3 className="font-heading font-bold text-base text-white">
                      {elect.name}
                    </h3>
                    <div className="text-xs text-slate-300 space-y-1">
                      <p><strong>Address:</strong> {elect.address}</p>
                      <p><strong>Phone:</strong> {elect.phone}</p>
                      <p><strong>Email:</strong> <a href={`mailto:${elect.email}`} className="text-amber-300 hover:underline">{elect.email}</a></p>
                      <span className="text-[10px] text-slate-400 font-mono block pt-1">ID: {elect.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      )}

      {/* TAB 3: CLUB CHARTER & MEETING DETAILS */}
      {tab === 'club-info' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Charter Info Left */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
              <h2 className="font-heading text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-6 h-6 text-optimist-blue" />
                Charter & Governance Metadata
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Official Club Number</span>
                  <strong className="text-sm font-heading font-black text-slate-900 dark:text-white">{clubMetadata.clubNumber}</strong>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">District & Zone</span>
                  <strong className="text-sm font-heading font-black text-slate-900 dark:text-white">{clubMetadata.district} ({clubMetadata.zone})</strong>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Charter Date</span>
                  <strong className="text-sm font-heading font-black text-slate-900 dark:text-white">{clubMetadata.charterDate}</strong>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Legal Name</span>
                  <strong className="text-xs font-heading font-bold text-slate-900 dark:text-white">{clubMetadata.legalName}</strong>
                </div>
              </div>

              {/* Meeting Place */}
              <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-2">
                <h3 className="font-heading font-bold text-sm text-optimist-blue dark:text-amber-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Official Club Meeting Venue
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  <strong>Venue:</strong> {clubMetadata.meetingPlace.venue}<br />
                  <strong>Address:</strong> {clubMetadata.meetingPlace.address}<br />
                  <strong>Schedule:</strong> {clubMetadata.meetingPlace.schedule}
                </p>
              </div>
            </div>
          </div>

          {/* Sponsors Right */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-6 shadow-xl">
              <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Sponsoring & Youth Clubs
              </h2>

              <div className="space-y-4 text-xs">
                {clubMetadata.sponsors.map((sp, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-amber-400 block">{sp.type}</span>
                    <strong className="text-sm font-heading text-white block">{sp.name}</strong>
                    <span className="text-[10px] text-slate-400 font-mono">{sp.number}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
