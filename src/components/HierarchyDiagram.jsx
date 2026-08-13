import React, { useState } from 'react';
import { hierarchyLevels } from '../data/hierarchyData';
import { ExternalLink, Layers, CheckCircle2, ChevronDown, ArrowDown } from 'lucide-react';

export const HierarchyDiagram = () => {
  const [selectedLevel, setSelectedLevel] = useState(hierarchyLevels[0]);
  const [expandedDomain, setExpandedDomain] = useState(null);

  const toggleDomain = (idx) => {
    setExpandedDomain(expandedDomain === idx ? null : idx);
  };

  return (
    <div className="py-10">
      
      {/* Visual Level Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {hierarchyLevels.map((lvl, index) => {
          const isSelected = selectedLevel.id === lvl.id;
          return (
            <div
              key={lvl.id}
              onClick={() => setSelectedLevel(lvl)}
              className={`cursor-pointer p-6 rounded-2xl transition-all duration-300 relative border ${
                isSelected
                  ? 'bg-optimist-blue text-white shadow-xl ring-2 ring-optimist-gold border-optimist-gold scale-102'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 shadow-sm'
              }`}
            >
              {/* Level Badge */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  }`}
                >
                  {lvl.badge}
                </span>
                <span className={`text-2xl font-semibold font-heading ${isSelected ? 'text-optimist-gold' : 'text-slate-400'}`}>
                  0{lvl.level}
                </span>
              </div>

              <h3 className={`font-heading text-lg font-bold mb-1 ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                {lvl.title}
              </h3>
              <p className={`text-xs font-medium mb-4 ${isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                {lvl.subtitle}
              </p>

              <div className="pt-4 border-t border-slate-200/20 flex items-center justify-between text-xs font-semibold">
                <span>{lvl.stats}</span>
                <span className="flex items-center gap-1">
                  View Specs <ChevronDown className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-180 text-optimist-gold' : ''}`} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Level Detail Panel */}
      <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-[#c1c4c7] dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-800 shadow-2xl relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-400/50 dark:border-slate-800">
          <div>
            <span className="text-xs uppercase font-bold text-optimist-gold tracking-widest">
              Selected Level Details • Level 0{selectedLevel.level}
            </span>
            <h3 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {selectedLevel.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              {selectedLevel.level === 1
                ? `${selectedLevel.subtitle} - ${selectedLevel.scope}`
                : `${selectedLevel.subtitle} (${selectedLevel.scope})`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={selectedLevel.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="gold-gradient text-slate-950 px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg hover:brightness-110 transition-all flex items-center gap-2"
            >
              <span>Visit Official Website</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <p className="mt-6 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          {selectedLevel.description}
        </p>

        {selectedLevel.domains ? (
          <div className="mt-8 space-y-8">
            {/* 4 Operational Domains */}
            <div className="space-y-4">
              {selectedLevel.domains.map((dom, domIdx) => {
                const isExpanded = expandedDomain === domIdx;
                return (
                  <div key={domIdx} className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 overflow-hidden transition-all duration-300">
                    <button
                      type="button"
                      onClick={() => toggleDomain(domIdx)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors gap-4"
                    >
                      <h4 className="font-heading text-base sm:text-lg font-bold text-amber-700 dark:text-amber-400">{dom.title}</h4>
                      <ChevronDown className={`w-5 h-5 text-amber-600 dark:text-amber-400 transition-transform duration-300 shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 space-y-4 border-t border-slate-200 dark:border-slate-700 animate-fadeIn">
                        <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                          <strong>Primary Objective:</strong> {dom.objective}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                          {dom.points.map((pt, ptIdx) => (
                            <div key={ptIdx} className="flex items-start space-x-2.5 text-xs text-slate-700 dark:text-slate-200">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                              <span>{pt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Core Values Section */}
            {selectedLevel.coreValues && (
              <div className="pt-6 border-t border-slate-400/50 dark:border-slate-800">
                <h4 className="text-xs uppercase font-bold text-optimist-gold tracking-wider mb-4">
                  Foundational Core Values & Purposes
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {selectedLevel.coreValues.map((val, valIdx) => (
                    <div key={valIdx} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs">
                      <strong className="block text-amber-700 dark:text-amber-400 font-heading mb-1">{val.name}</strong>
                      <span className="text-slate-600 dark:text-slate-300 leading-relaxed">{val.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6">
            <h4 className="text-xs uppercase font-bold text-optimist-gold tracking-wider mb-3">
              Key Responsibilities & Scope
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedLevel.responsibilities.map((resp, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{resp}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
