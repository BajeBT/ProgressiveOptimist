import React from 'react';
import { Calendar, User, Tag, ArrowRight, Award } from 'lucide-react';

export const ProjectCard = ({ project, onClick }) => {
  return (
    <div
      onClick={() => onClick(project)}
      className="group cursor-pointer rounded-2xl overflow-hidden glass-card hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-slate-200/80 dark:border-slate-800"
    >
      {/* Image Banner */}
      <div className="relative h-48 overflow-hidden bg-slate-900">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
        
        {/* Category Tag */}
        <span className="absolute top-3 left-3 bg-optimist-blue text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-md">
          {project.category}
        </span>

        {/* Pending Approval Badge */}
        {project.approved === false && (
          <span className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-md animate-pulse">
            Pending Approval
          </span>
        )}

        {/* Impact Badge */}
        {project.impact && (
          <span className="absolute bottom-3 right-3 bg-amber-400 text-slate-950 text-xs font-extrabold px-2.5 py-1 rounded-lg shadow flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            {project.impact}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-optimist-blue" />
              {project.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-amber-500" />
              {project.author}
            </span>
          </div>

          <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white group-hover:text-optimist-blue dark:group-hover:text-amber-400 transition-colors line-clamp-2">
            {project.title}
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
            {project.excerpt}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-optimist-blue dark:text-amber-400 group-hover:translate-x-1 transition-transform">
          <span>Read Full Initiative</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
