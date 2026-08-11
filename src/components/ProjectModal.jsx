import React from 'react';
import { X, Calendar, User, Tag, Award, Share2, Heart, ExternalLink, Image as ImageIcon } from 'lucide-react';

export const ProjectModal = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-slate-950 transition-colors shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-64 sm:h-80 bg-slate-950">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <span className="bg-optimist-gold text-slate-950 font-bold text-xs uppercase px-3 py-1 rounded-full tracking-wider shadow">
              {project.category}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold mt-3 text-white leading-tight">
              {project.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800 dark:text-slate-200">
          
          {/* Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-optimist-blue" />
                {project.date}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-500" />
                Posted by {project.author}
              </span>
            </div>

            {project.impact && (
              <span className="bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-bold px-3 py-1 rounded-lg border border-amber-300 dark:border-amber-700 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                {project.impact}
              </span>
            )}
          </div>

          {/* Excerpt Lead */}
          <p className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-100 italic border-l-4 border-optimist-blue pl-4 py-1">
            "{project.excerpt}"
          </p>

          {/* Main Body Content */}
          <div className="prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 space-y-4">
            <p>{project.content}</p>
            <p>
              The Progressive Optimist Club of Barbados remains committed to sustaining this initiative with the generous support of our community partners, volunteers, and member donors.
            </p>
          </div>

          {/* Official Flyer Button if available */}
          {project.flyerUrl && (
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <ImageIcon className="w-5 h-5 text-optimist-blue dark:text-optimist-gold shrink-0" />
                <div>
                  <strong className="block text-xs text-slate-900 dark:text-white">Official Event Flyer Available</strong>
                  <span className="text-[11px] text-slate-500">Full-resolution promotional flyer / photo</span>
                </div>
              </div>
              <a
                href={project.flyerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl gold-gradient text-slate-950 font-bold text-xs shadow hover:brightness-110 transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>View Full Flyer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Footer Call to Action */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Published under Progressive Optimist Club of Barbados Youth Services.
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => alert("Project link copied to clipboard!")}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Share2 className="w-4 h-4" /> Share Initiative
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-optimist-blue text-white text-xs font-bold shadow hover:bg-blue-800 transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
