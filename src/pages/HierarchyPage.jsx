import React from 'react';
import { HierarchyDiagram } from '../components/HierarchyDiagram';
import { Globe, Award, ExternalLink, ShieldCheck, Compass, Users } from 'lucide-react';

export const HierarchyPage = () => {
  return (
    <div className="space-y-12 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-optimist-gold px-3 py-1 rounded bg-amber-400/20">
          Global Organizational Hierarchy
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-black">
          Barbados, Caribbean & International Structure
        </h1>
        <p className="text-slate-300 text-xs sm:text-base max-w-3xl leading-relaxed">
          Learn how the Progressive Optimist Club of Barbados connects to the Optimist Caribbean District (District 43) and Optimist International worldwide.
        </p>

        <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold">
          <a
            href="https://oicaribbean.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-optimist-blue hover:bg-blue-800 text-white transition-colors flex items-center gap-2 border border-blue-400/30"
          >
            <Globe className="w-4 h-4 text-optimist-gold" />
            <span>Optimist Caribbean District</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href="https://optimist.org"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl gold-gradient text-slate-950 hover:brightness-110 transition-colors flex items-center gap-2 shadow"
          >
            <Award className="w-4 h-4" />
            <span>Optimist International Official Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Interactive Diagram Component */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Interactive Hierarchy Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Click on any tier below to view its full responsibilities, website links, and scope.
          </p>
        </div>

        <HierarchyDiagram />
      </section>

      {/* Narrative Breakdown */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        <div className="p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-optimist-blue text-amber-400 flex items-center justify-center font-bold">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-xl font-bold">The Caribbean District Connection</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            The Progressive Optimist Club of Barbados operates under District 43 (Caribbean District). District leadership helps coordinate regional oratorical contests, Caribbean junior golf tournaments, and leadership conferences uniting clubs in Barbados, Jamaica, Antigua, Trinidad, and St. Lucia.
          </p>
          <a
            href="https://oicaribbean.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-optimist-blue dark:text-amber-400 hover:underline"
          >
            <span>Visit oicaribbean.org</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-xl font-bold">Global Impact via Optimist International</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Founded in 1919, Optimist International provides global standards, youth program resources, and international contest platforms. Through our membership, Bajan students participate in world-renowned contests with access to global college scholarships.
          </p>
          <a
            href="https://optimist.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-optimist-blue dark:text-amber-400 hover:underline"
          >
            <span>Visit Optimist.org</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

    </div>
  );
};
