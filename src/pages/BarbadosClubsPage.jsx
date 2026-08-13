import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MapPin, Phone, Mail, Calendar, ExternalLink, Search } from 'lucide-react';

export const BarbadosClubsPage = () => {
  const { barbadosClubs } = useAuth();
  const [search, setSearch] = useState('');

  const filteredClubs = barbadosClubs.filter(c =>
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.location || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.motto || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-optimist-gold px-3 py-1 rounded bg-amber-400/20">
              Barbados Optimist Directory
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl font-semibold mt-2">
              Optimist Clubs of Barbados
            </h1>
          </div>
          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 text-center shrink-0">
            <span className="text-xs text-slate-400 block">District 78 (CAR)</span>
            <strong className="text-amber-300 font-heading text-lg">Zone 8 Barbados Network</strong>
          </div>
        </div>
        <p className="text-slate-300 text-xs sm:text-base max-w-3xl leading-relaxed">
          Discover active Optimist International clubs serving children, primary schools, and youth organizations across the island of Barbados.
        </p>

        {/* Search Bar */}
        <div className="pt-2 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Barbados clubs by name or parish..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:ring-2 focus:ring-optimist-blue"
          />
        </div>
      </div>

      {/* Clubs Grid - All Cards Styled in Light Green */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredClubs.map((club) => (
          <div
            key={club.id}
            className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
              club.isHost
                ? 'bg-gradient-to-br from-emerald-100 via-green-100 to-emerald-200 dark:from-emerald-950 dark:via-emerald-900 dark:to-slate-900 text-slate-900 dark:text-white border-emerald-400 shadow-2xl ring-2 ring-emerald-400/50'
                : 'bg-gradient-to-br from-emerald-50 via-green-50/60 to-emerald-100/50 dark:from-emerald-950/60 dark:via-emerald-900/40 dark:to-slate-900 text-slate-900 dark:text-white border-emerald-200 dark:border-emerald-800 shadow-lg'
            }`}
          >
            <div>
              {/* Badge & Charter */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                    club.isHost
                      ? 'gold-gradient text-slate-950 shadow'
                      : 'bg-emerald-200/80 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                  }`}
                >
                  {club.isHost ? '★ Host Organization' : 'Barbados Chapter'}
                </span>
                <span className="text-xs font-semibold opacity-80">Chartered {club.charterYear}</span>
              </div>

              <h2 className="font-heading text-2xl font-bold mb-1">
                {club.name}
              </h2>
              <p className={`text-xs italic mb-4 font-serif ${club.isHost ? 'text-emerald-900 dark:text-amber-300 font-bold' : 'text-emerald-800 dark:text-emerald-400 font-semibold'}`}>
                "{club.motto}"
              </p>

              <p className="text-xs sm:text-sm leading-relaxed mb-6 text-slate-800 dark:text-slate-200">
                {club.description}
              </p>

              {/* Key Details List */}
              <div className="space-y-2.5 text-xs mb-6">
                <div className="flex items-start space-x-2.5">
                  <Calendar className="w-4 h-4 shrink-0 mt-0.5 text-emerald-700 dark:text-optimist-gold" />
                  <span><strong>Meetings:</strong> {club.meetingSchedule}</span>
                </div>

                <div className="flex items-start space-x-2.5">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-emerald-700 dark:text-optimist-gold" />
                  <span><strong>Venue:</strong> {club.location}</span>
                </div>

                <div className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 shrink-0 text-emerald-700 dark:text-optimist-gold" />
                  <span><strong>Phone:</strong> {club.phone}</span>
                </div>

                <div className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4 shrink-0 text-emerald-700 dark:text-optimist-gold" />
                  <span><strong>Email:</strong> {club.email}</span>
                </div>
              </div>

              {/* Key Projects */}
              <div className="mb-6 pt-4 border-t border-emerald-200/60 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold tracking-wider block mb-2 text-emerald-900 dark:text-optimist-gold">
                  Primary Initiatives
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {club.initiatives.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-200/80 text-emerald-950 dark:bg-slate-800/80 dark:text-slate-100 border border-emerald-300/80 dark:border-slate-700 font-bold"
                    >
                      • {item}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Action */}
            <div className="pt-4 border-t border-emerald-200/60 dark:border-slate-800 flex justify-end">
              <a
                href={club.website}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  club.isHost
                    ? 'gold-gradient text-slate-950 shadow hover:brightness-110'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow'
                }`}
              >
                <span>Visit Club Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
