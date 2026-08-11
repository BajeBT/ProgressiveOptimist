import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectModal } from '../components/ProjectModal';
import { Search, PlusCircle, Sparkles, Filter } from 'lucide-react';

export const ProjectsPage = ({ onOpenPostModal }) => {
  const { projects, currentUser } = useAuth();
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Youth Mentorship & Summer Camp',
    'Community Outreach',
    'Skill Building & Mentorship',
    'Fundraiser & Fellowship',
    'Health & Nutrition',
    'Education & STEM',
    'Environment & Sustainability'
  ];

  const isModerator = currentUser && ['super admin', 'finance', 'admin', 'moderator'].includes(currentUser.access);

  const filteredProjects = projects.filter(project => {
    const isApproved = project.approved !== false;
    const isAuthor = currentUser && (project.authorId === currentUser.memberId || project.author === currentUser.name);
    
    // Non-moderators can only see approved projects, unless they are the author of a pending project.
    const isVisible = isApproved || isAuthor || isModerator;
    if (!isVisible) return false;

    const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (project.category && project.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (project.content && project.content.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-optimist-gold px-3 py-1 rounded bg-amber-400/20">
            Portfolio & Activities
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-black">
            Volunteer Projects & Fundraisers
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Explore authentic portfolio projects, annual fundraisers, school presentations, and youth mentorship drives across Barbados.
          </p>
        </div>

        {currentUser ? (
          <button
            onClick={onOpenPostModal}
            className="gold-gradient text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg hover:brightness-110 transition-all text-xs flex items-center gap-2 shrink-0"
          >
            <PlusCircle className="w-5 h-5" />
            <span>+ Post New Project</span>
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300 space-y-1">
            <span className="font-bold text-optimist-gold">Are you a club member?</span>
            <p>Log in as a member to post new pictures and projects live on the website.</p>
          </div>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4 p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search projects, flyers, or activities by keyword..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
            />
          </div>

          <div className="text-xs text-slate-500 font-semibold shrink-0">
            Showing <strong>{filteredProjects.length}</strong> of <strong>{projects.length}</strong> Initiatives
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-optimist-blue text-white shadow font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={setSelectedProject}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 p-8 rounded-3xl glass-card border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
          <Sparkles className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-heading font-bold text-lg">No Matching Projects Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or category filter. Members can also post new projects anytime!
          </p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

    </div>
  );
};
