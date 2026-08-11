import React, { useState } from 'react';
import { optimistCreed } from '../data/creedData';
import {
  ShieldCheck,
  MessageSquareHeart,
  Sparkles,
  Sun,
  Trophy,
  HeartHandshake,
  Rocket,
  Smile,
  Brain,
  Anchor,
  CheckCircle,
  Copy,
  Filter
} from 'lucide-react';

const iconMap = {
  ShieldCheck,
  MessageSquareHeart,
  Sparkles,
  Sun,
  Trophy,
  HeartHandshake,
  Rocket,
  Smile,
  Brain,
  Anchor
};

export const OptimistCreed = () => {
  const [copiedId, setCopiedId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Inner Strength');

  const categories = [...new Set(optimistCreed.map(c => c.category)), 'All'];

  const filteredCreed = activeCategory === 'All'
    ? optimistCreed
    : optimistCreed.filter(c => c.category === activeCategory);

  const handleCopy = (item) => {
    navigator.clipboard.writeText(item.text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="py-16 bg-slate-900 text-white relative overflow-hidden rounded-3xl my-8">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-optimist-blue/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-optimist-gold/20 text-optimist-gold border border-optimist-gold/40 text-xs font-bold uppercase tracking-widest">
            <Sun className="w-3.5 h-3.5" /> Guiding Philosophy
          </span>
          <h2 className="mt-4 font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white">
            The Official <span className="text-gold-gradient">Optimist Creed</span>
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            Written by Christian D. Larson in 1912 and officially adopted by Optimist International in 1922, these ten principles guide our daily lives and youth service in Barbados.
          </p>

          {/* Full Creed Text Block */}
          <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-slate-850/60 border border-slate-750 max-w-3xl mx-auto text-left space-y-3.5 shadow-inner">
            <h3 className="font-heading text-base font-bold text-amber-400 border-b border-slate-800 pb-2 text-center uppercase tracking-wider">
              Promise Yourself:
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed font-serif italic">
              {optimistCreed.map(item => (
                <div key={item.id} className="flex items-start gap-3">
                  <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-12 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? 'gold-gradient text-slate-950 shadow-md font-bold'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 10 Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredCreed.map((item) => {
            const IconComponent = iconMap[item.icon] || Sun;
            return (
              <div
                key={item.id}
                className="group p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 hover:border-amber-400/50 hover:bg-slate-800/90 transition-all duration-300 flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-optimist-blue/80 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                          Principle #{item.id} • {item.category}
                        </span>
                        <h3 className="font-heading text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                          {item.principle}
                        </h3>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopy(item)}
                      className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-700 transition-colors"
                      title="Copy Principle"
                    >
                      {copiedId === item.id ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <p className="text-sm text-slate-200 italic leading-relaxed font-serif pl-2 border-l-2 border-amber-400/60">
                    "{item.text}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
