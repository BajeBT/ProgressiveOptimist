import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { OptimistCreed } from '../components/OptimistCreed';
import { HierarchyDiagram } from '../components/HierarchyDiagram';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectModal } from '../components/ProjectModal';
import { barbadosClubs } from '../data/clubsData';
import {
  HeartHandshake,
  Sparkles,
  Users,
  Award,
  BookOpen,
  Laptop,
  ArrowRight,
  Shield,
  Calendar,
  MapPin,
  ExternalLink,
  ChevronRight,
  PlusCircle,
  Sun,
  CheckCircle2
} from 'lucide-react';

export const HomePage = ({ onOpenPostModal }) => {
  const { projects, currentUser } = useAuth();
  const [selectedProject, setSelectedProject] = useState(null);

  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white my-4 shadow-2xl border border-slate-800">
        
        {/* Decorative Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=2000&q=80"
            alt="Barbados Youth Outreach"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-optimist-blue/60"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-optimist-gold/20 border border-optimist-gold/40 text-optimist-gold text-xs font-extrabold uppercase tracking-widest">
              <Sun className="w-4 h-4" /> Progressive Optimist Club of Barbados
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl xl:text-6xl font-black leading-tight text-white tracking-tight">
              Bringing Out The Best In <span className="text-gold-gradient">Children</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-light">
              We are a dedicated non-profit service organization empowering youth across Barbados through educational mentorship, computer drives, healthy living programs, and community outreach.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/membership"
                className="gold-gradient text-slate-950 font-bold px-7 py-3.5 rounded-xl shadow-lg hover:brightness-110 transition-all text-sm flex items-center gap-2"
              >
                <span>Join As A Member</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/donate"
                className="bg-optimist-blue hover:bg-blue-800 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg transition-all text-sm border border-blue-400/30 flex items-center gap-2"
              >
                <HeartHandshake className="w-4 h-4 text-optimist-gold" />
                <span>Support Our Programs</span>
              </Link>

              {currentUser && (
                <button
                  onClick={onOpenPostModal}
                  className="bg-slate-800/90 hover:bg-slate-700 text-white font-semibold px-5 py-3.5 rounded-xl text-sm border border-slate-700 flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4 text-amber-400" />
                  <span>Post Project</span>
                </button>
              )}
            </div>

            {/* Quick Meeting Info Badge */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-300">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-optimist-gold shrink-0" />
                <span>1st Working Monday @ 6:00 PM (Guests)</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-optimist-gold shrink-0" />
                <span>Ross University, Lloyd Erskine Sandiford Centre (LESC)</span>
              </div>
            </div>
          </div>

          {/* Right Card Feature */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 shadow-2xl text-slate-900 dark:text-white space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-optimist-blue dark:text-optimist-gold">
                  Our Impact In Barbados
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-amber-400/20 text-amber-900 dark:text-amber-300">
                  Est. 2011
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <div className="font-heading text-3xl font-extrabold text-optimist-blue dark:text-amber-400">
                    1,200+
                  </div>
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
                    Youth Reached
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/30">
                  <div className="font-heading text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    150 / 150
                  </div>
                  <div className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-300 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Devices Fulfilled
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <div className="font-heading text-3xl font-extrabold text-optimist-blue dark:text-amber-400">
                    25+
                  </div>
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
                    School Projects
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                  <div className="font-heading text-3xl font-extrabold text-optimist-blue dark:text-amber-400">
                    14+
                  </div>
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1">
                    Years of Service
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-optimist-blue/10 border border-optimist-blue/20 flex items-start space-x-3 text-xs text-slate-700 dark:text-slate-300">
                <Sparkles className="w-5 h-5 text-optimist-blue dark:text-optimist-gold shrink-0 mt-0.5" />
                <span>
                  <strong>RISE 2025 Summer Experience</strong> is currently active! Help us equip Bajan children with key life skills and mentorship.
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURED PROJECTS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-optimist-blue dark:text-optimist-gold">
              Volunteer Work & Outreach
            </span>
            <h2 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Featured Community Initiatives
            </h2>
          </div>

          <Link
            to="/projects"
            className="text-xs font-bold text-optimist-blue dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>View All Projects ({projects.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={setSelectedProject}
            />
          ))}
        </div>
      </section>

      {/* OPTIMIST CREED COMPONENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <OptimistCreed />
      </div>

      {/* BARBADOS CLUBS SNIPPET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-widest text-optimist-blue dark:text-optimist-gold">
            Local Barbados Community
          </span>
          <h2 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Optimist Clubs in Barbados
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            The Progressive Optimist Club of Barbados works alongside peer clubs and school chapters across the island.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {barbadosClubs.slice(0, 3).map((club) => (
            <div
              key={club.id}
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                club.isHost
                  ? 'bg-optimist-blue text-white border-optimist-gold shadow-lg'
                  : 'glass-card border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded ${
                    club.isHost
                      ? 'bg-amber-400 text-slate-950 font-extrabold'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  }`}
                >
                  {club.isHost ? 'Host Club' : 'Barbados Chapter'}
                </span>
                <span className="text-xs opacity-75">Est. {club.charterYear}</span>
              </div>

              <h3 className="font-heading text-lg font-bold mb-2">{club.name}</h3>
              <p className={`text-xs mb-4 line-clamp-2 ${club.isHost ? 'text-blue-100' : 'text-slate-600 dark:text-slate-400'}`}>
                {club.description}
              </p>

              <div className="pt-3 border-t border-slate-200/20 text-xs flex justify-between items-center font-semibold">
                <span>{club.phone}</span>
                <Link to="/barbados-clubs" className="hover:underline flex items-center gap-1">
                  Details <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HIERARCHY OVERVIEW COMPONENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-widest text-optimist-blue dark:text-optimist-gold">
            Organizational Structure
          </span>
          <h2 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            How We Fit Into The Global Optimist Movement
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            Explore how our local Barbados club links directly into District 43 (Caribbean District) and Optimist International.
          </p>
        </div>

        <HierarchyDiagram />
      </section>

      {/* PROJECT MODAL IF SELECTED */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

    </div>
  );
};
