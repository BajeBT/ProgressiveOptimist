import React, { useState } from 'react';
import { barbadosClubs } from '../data/clubsData';
import { MapPin, Phone, Mail, Globe, Calendar, ExternalLink, Shield, CheckCircle, Search } from 'lucide-react';

export const BarbadosClubsPage = () => {
  const [search, setSearch] = useState('');

  const filteredClubs = barbadosClubs.filter(club =>
    club.name.toLowerCase().includes(search.toLowerCase()) ||
    club.description.toLowerCase().includes(search.toLowerCase()) ||
    club.motto.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-optimist-gold px-3 py-1 rounded bg-amber-400/20">
          Local Barbados Network
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-black">
          Optimist Clubs of Barbados
        </h1>
        <p className="text-slate-300 text-xs sm:text-base max-w-2xl leading-relaxed">
          Directory of Optimist Clubs and Junior Octagon chapters serving children and families across Barbados. Explore meeting times, contacts, and project highlights for each club.
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

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredClubs.map((club) => (
          <div
            key={club.id}
            className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
              club.isHost
                ? 'bg-gradient-to-br from-optimist-navy via-optimist-blue to-slate-900 text-white border-optimist-gold shadow-2xl ring-2 ring-optimist-gold/50'
                : 'glass-card border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
            }`}
          >
            <div>
              {/* Badge & Charter */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full ${
                    club.isHost
                      ? 'gold-gradient text-slate-950 shadow'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  }`}
                >
                  {club.isHost ? '★ Host Organization' : 'Barbados Chapter'}
                </span>
                <span className="text-xs font-semibold opacity-80">Chartered {club.charterYear}</span>
              </div>

              <h2 className="font-heading text-2xl font-bold mb-1">
                {club.name}
              </h2>
              <p className={`text-xs italic mb-4 font-serif ${club.isHost ? 'text-amber-300' : 'text-optimist-blue dark:text-amber-400'}`}>
                "{club.motto}"
              </p>

              <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${club.isHost ? 'text-slate-200' : 'text-slate-600 dark:text-slate-300'}`}>
                {club.description}
              </p>

              {/* Key Details List */}
              <div className="space-y-2.5 text-xs mb-6">
                <div className="flex items-start space-x-2.5">
                  <Calendar className={`w-4 h-4 shrink-0 mt-0.5 ${club.isHost ? 'text-optimist-gold' : 'text-optimist-blue'}`} />
                  <span><strong>Meetings:</strong> {club.meetingSchedule}</span>
                </div>

                <div className="flex items-start space-x-2.5">
                  <MapPin className={`w-4 h-4 shrink-0 mt-0.5 ${club.isHost ? 'text-optimist-gold' : 'text-optimist-blue'}`} />
                  <span><strong>Venue:</strong> {club.location}</span>
                </div>

                <div className="flex items-center space-x-2.5">
                  <Phone className={`w-4 h-4 shrink-0 ${club.isHost ? 'text-optimist-gold' : 'text-optimist-blue'}`} />
                  <span><strong>Phone:</strong> {club.phone}</span>
                </div>

                <div className="flex items-center space-x-2.5">
                  <Mail className={`w-4 h-4 shrink-0 ${club.isHost ? 'text-optimist-gold' : 'text-optimist-blue'}`} />
                  <span><strong>Email:</strong> {club.email}</span>
                </div>
              </div>

              {/* Key Projects */}
              <div className="mb-6 pt-4 border-t border-slate-200/20">
                <span className={`text-[10px] uppercase font-bold tracking-wider block mb-2 ${club.isHost ? 'text-optimist-gold' : 'text-slate-500 dark:text-slate-400'}`}>
                  Primary Initiatives
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {club.keyProjects.map((p, idx) => (
                    <span
                      key={idx}
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg ${
                        club.isHost
                          ? 'bg-slate-800/80 text-slate-100 border border-slate-700'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      • {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* External Web Link */}
            <div className="pt-4 border-t border-slate-200/20 flex justify-end">
              <a
                href={club.website}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  club.isHost
                    ? 'gold-gradient text-slate-950 shadow hover:brightness-110'
                    : 'bg-optimist-blue text-white hover:bg-blue-800'
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
