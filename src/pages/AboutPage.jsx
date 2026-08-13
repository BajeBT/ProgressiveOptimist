import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  FileText,
  Download,
  HeartHandshake,
  Target,
  Compass,
  Crown,
  Search,
  UserCheck
} from 'lucide-react';

export const AboutPage = () => {
  const { siteSettings } = useAuth();

  // Executive Officers with custom role placeholder images
  const currentOfficers = [
    {
      name: "Richelle Lucas",
      title: "Club President & Immediate Past President",
      role: "Executive Leadership & Strategic Direction",
      email: "president@progressiveoptimist.org",
      image: "/avatars/president_placeholder.jpg"
    },
    {
      name: "Charmaine London",
      title: "Club Secretary",
      role: "Member Records & Official Communications",
      email: "secretary@progressiveoptimist.org",
      image: "/avatars/secretary_placeholder.jpg"
    },
    {
      name: "Sharon Mohammed",
      title: "Club Treasurer",
      role: "Financial Stewardship & Dues Management",
      email: "treasurer@progressiveoptimist.org",
      image: "/avatars/treasurer_placeholder.jpg"
    },
    {
      name: "Edwin Workman",
      title: "OI Representative",
      role: "Optimist International & Caribbean District Liaison (non-voting)",
      email: "oirep@progressiveoptimist.org",
      image: "/avatars/oirep_placeholder.jpg"
    }
  ];

  const executiveRoles = [
    { title: "President", holder: "Richelle Lucas", badge: "Executive Head" },
    { title: "President Elect", holder: "Cameron P. Sobers", badge: "Leadership" },
    { title: "Vice President - Internal", holder: "Executive Committee", badge: "Internal Ops" },
    { title: "Vice President - External", holder: "Executive Committee", badge: "Outreach & Public" },
    { title: "Immediate Past President", holder: "Richelle Lucas", badge: "Advisory" },
    { title: "Secretary", holder: "Charmaine London", badge: "Administration" },
    { title: "Treasurer", holder: "Sharon Mohammed", badge: "Finance" },
    { title: "OI Representative", holder: "Edwin Workman", badge: "International (non-voting)" }
  ];

  const currentDirectors = [
    { name: "Omolara DeRiggs-Morris", role: "Board Director & Past President (2023)", image: "/avatars/director_placeholder.jpg" },
    { name: "Dawn-Marie Watson", role: "Board Director", image: "/avatars/director_placeholder.jpg" },
    { name: "Deborah Bayne", role: "Board Director", image: "/avatars/director_placeholder.jpg" },
    { name: "Cameron Sobers", role: "President-Elect & Past President (2014)", image: "/avatars/director_placeholder.jpg" }
  ];

  // Complete Past Presidents List from 2010 to 2025
  const pastPresidents = [
    { year: "2025", name: "Richelle Lucas", badge: "Current President" },
    { year: "2024", name: "Richelle Lucas" },
    { year: "2023", name: "Omolara DeRiggs Morris" },
    { year: "2022", name: "Edwin Workman" },
    { year: "2021", name: "Shaina McAllister" },
    { year: "2020", name: "Eleanor Rice" },
    { year: "2019", name: "Shirley Hoyte" },
    { year: "2018", name: "Maureen Dottin" },
    { year: "2017", name: "Charmaine London" },
    { year: "2016", name: "Margot Aquan", badge: "Distinguished" },
    { year: "2015", name: "Janelle Ottley" },
    { year: "2014", name: "Cameron Sobers", badge: "Distinguished" },
    { year: "2013", name: "Edwin Workman", badge: "Distinguished" },
    { year: "2012", name: "Simeon Ellis" },
    { year: "2011", name: "Carmel Haynes" },
    { year: "2010", name: "JoyAnn Carter", badge: "Charter Year" }
  ];

  const [presidentFilter, setPresidentFilter] = useState('');

  const filteredPresidents = pastPresidents.filter(p =>
    p.name.toLowerCase().includes(presidentFilter.toLowerCase()) ||
    p.year.includes(presidentFilter)
  );

  const downloads = [
    { title: "New Member Application Form", file: "/documents/application-form.pdf", size: "145 KB" },
    { title: "Progressive Optimist Club Brochure", file: "/documents/club-brochure.pdf", size: "1.2 MB" },
    { title: "RISE 2025 Summer Program Overview", file: "/documents/rise-2025-overview.pdf", size: "890 KB" },
    { title: "Optimist International Constitution", file: "/documents/constitution.pdf", size: "540 KB" }
  ];

  return (
    <div className="space-y-16 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-slate-900 text-white p-8 sm:p-12 overflow-hidden border border-slate-800 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-optimist-gold px-3 py-1 rounded bg-amber-400/20">
            About Our Organization
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-semibold text-white">
            Who We Are & Leadership
          </h1>
          <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
            The Progressive Optimist Club of Barbados was chartered to serve the children, schools, and communities across Barbados. Meet our executive officers, board directors, and historical past presidents.
          </p>
        </div>
      </div>

      {/* Mission, Vision, District Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-optimist-blue text-optimist-gold flex items-center justify-center font-bold shadow">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-xl font-bold">Our Mission</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            By providing hope and positive vision, Optimists bring out the best in youth, our communities and ourselves.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-optimist-blue text-optimist-gold flex items-center justify-center font-bold shadow">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-xl font-bold">Caribbean District Theme</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {siteSettings?.themeTitle || "C.A.R.E – Championing Authentic & Reinvigorating Engagement"}
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-optimist-blue text-optimist-gold flex items-center justify-center font-bold shadow">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-xl font-bold">Community Service</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Providing laptops, tablets, kites, and mentorship to primary school students (Westbury Primary, Ignatius Byer, Milton Lynch).
          </p>
        </div>
      </div>

      {/* 1. EXECUTIVE OFFICERS & ROLES */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-optimist-blue dark:text-optimist-gold">
            Executive Officers & Leadership Structure
          </span>
          <h2 className="font-heading text-3xl font-bold text-slate-900 dark:text-white mt-1">
            Club Executive Committee
          </h2>
        </div>

        {/* Featured Officers Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentOfficers.map((officer, idx) => (
            <div key={idx} className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 text-center p-6 space-y-3 shadow-lg hover:shadow-xl transition-all">
              <div className="w-24 h-24 rounded-full mx-auto p-1 bg-gradient-to-tr from-optimist-blue to-optimist-gold shadow-md">
                <img
                  src={officer.image}
                  alt={officer.name}
                  className="w-full h-full rounded-full object-cover bg-white"
                />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                  {officer.name}
                </h3>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold uppercase">
                  {officer.title}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {officer.role}
              </p>
            </div>
          ))}
        </div>

        {/* Executive Roles Breakdown */}
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4 shadow-lg">
          <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-optimist-blue dark:text-amber-400" />
            Executive Officers Roster
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {executiveRoles.map((role, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-optimist-blue dark:text-amber-400 block mb-0.5">
                    {role.title}
                  </span>
                  <strong className="text-sm font-heading text-slate-900 dark:text-white">
                    {role.holder}
                  </strong>
                </div>
                <span className="mt-2 self-start text-[9px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  {role.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. BOARD OF DIRECTORS */}
      <section className="space-y-6">
        <div className="p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
                Board of Directors
              </h2>
              <p className="text-xs text-slate-500">Current Club Directors serving the Barbados community</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentDirectors.map((dir, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-optimist-blue shrink-0 shadow">
                  <img
                    src={dir.image}
                    alt={dir.name}
                    className="w-full h-full rounded-full object-cover bg-white"
                  />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs text-slate-900 dark:text-white">
                    {dir.name}
                  </h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{dir.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HISTORICAL PAST PRESIDENTS HONOR ROLL */}
      <section className="space-y-6">
        <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-optimist-gold flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400" /> Executive Honor Roll
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                Past Presidents of Barbados (2010 – 2025)
              </h2>
              <p className="text-xs text-slate-400">
                Honoring the past leaders who built and guided the Progressive Optimist Club of Barbados.
              </p>
            </div>

            {/* Search Filter */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={presidentFilter}
                onChange={e => setPresidentFilter(e.target.value)}
                placeholder="Search by name or year..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:ring-2 focus:ring-optimist-blue"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPresidents.map((p, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-amber-400/50 transition-all flex items-center justify-between group shadow"
              >
                <div>
                  <span className="text-xs font-semibold text-optimist-gold block font-heading">
                    {p.year}
                  </span>
                  <h4 className="font-heading font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                    {p.name}
                  </h4>
                </div>

                {p.badge && (
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                    p.badge === 'Distinguished'
                      ? 'gold-gradient text-slate-950 font-semibold shadow-sm'
                      : 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                  }`}>
                    {p.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meeting Location Card */}
      <div className="p-8 rounded-3xl bg-optimist-blue text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs uppercase font-bold text-optimist-gold tracking-widest">
            Join Us At Our Next Meeting
          </span>
          <h3 className="font-heading text-2xl font-bold text-white">
            Meetings Held Monthly in St. Michael
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
            <strong>Schedule:</strong> {siteSettings?.meetingSchedule || '1st Monday of every month at 5:30 PM (6:00 PM for Guests)'}.<br />
            <strong>Location:</strong> {siteSettings?.meetingVenue || 'Ross University, Lloyd Erskine Sandiford Centre (LESC), Two Mile Hill, St. Michael, Barbados'}.
          </p>
        </div>

        <Link
          to="/contact"
          className="gold-gradient text-slate-950 px-6 py-3 rounded-xl font-bold text-xs shrink-0 shadow-lg hover:brightness-110 transition-all"
        >
          Get Meeting Directions
        </Link>
      </div>

      {/* Downloads & Resources Library */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-optimist-blue dark:text-optimist-gold">
            Brochures & Documents
          </span>
          <h2 className="font-heading text-3xl font-bold text-slate-900 dark:text-white mt-1">
            Resource Library
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {downloads.map((doc, idx) => (
            <div key={idx} className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                    {doc.title}
                  </h4>
                  <span className="text-[10px] text-slate-500">PDF • {doc.size}</span>
                </div>
              </div>

              <a
                href={doc.file}
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Downloading ${doc.title}...`);
                }}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-optimist-blue hover:text-white transition-colors"
                title="Download PDF"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
