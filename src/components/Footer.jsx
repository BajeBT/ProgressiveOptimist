import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Heart, Mail, MapPin, ExternalLink, ShieldCheck, Award, BookOpen } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 pt-16 pb-12 transition-colors duration-300">
      
      {/* 1. TOP CREED & IMPACT BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-optimist-blue via-optimist-royal to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase font-bold text-amber-300 tracking-widest">
              The Optimist Motto
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              "Bringing Out The Best In Children"
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              By providing hope and positive vision, Optimists bring out the best in youth, our communities, and ourselves.
            </p>
          </div>

          <Link
            to="/donate"
            className="gold-gradient text-slate-950 px-6 py-3.5 rounded-xl font-bold text-xs shrink-0 shadow-lg hover:brightness-110 transition-all flex items-center gap-2"
          >
            <Heart className="w-4 h-4 fill-slate-950" />
            <span>Support Student Drive</span>
          </Link>
        </div>
      </div>

      {/* 2. MAIN FOOTER LINKS & CONTACT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Col 1: About & Logo */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Progressive Optimist Club" className="h-10 w-auto" />
            <div>
              <h4 className="font-heading font-bold text-sm text-white">
                Progressive Optimist
              </h4>
              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                Club of Barbados (# 78008)
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            A premier non-profit service organization in Barbados dedicated to empowering youth through education, mentorship, and community cheer.
          </p>
          <div className="text-xs text-slate-400 space-y-1 pt-1">
            <p><strong>Meeting Time:</strong> 1st Working Monday of Month • 6:00 PM for Guests</p>
            <p><strong>Location:</strong> Ross University, LESC, St. Michael</p>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div className="space-y-4">
          <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider text-amber-400">
            Quick Navigation
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            <li>
              <Link to="/about" className="hover:text-amber-300 transition-colors">
                Who We Are & Mission
              </Link>
            </li>
            <li>
              <Link to="/directory" className="hover:text-amber-300 transition-colors text-amber-300 font-bold flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Club Roster Directory (21 Members)</span>
              </Link>
            </li>
            <li>
              <Link to="/projects" className="hover:text-amber-300 transition-colors">
                RISE Summer & Projects
              </Link>
            </li>
            <li>
              <Link to="/barbados-clubs" className="hover:text-amber-300 transition-colors">
                Barbados Clubs Directory
              </Link>
            </li>
            <li>
              <Link to="/hierarchy" className="hover:text-amber-300 transition-colors">
                District & Global Hierarchy
              </Link>
            </li>
            <li>
              <Link to="/donate" className="hover:text-amber-300 transition-colors">
                Laptop & Tablet Fundraiser
              </Link>
            </li>
            <li>
              <Link to="/membership" className="hover:text-amber-300 transition-colors">
                Member Portal & Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Optimist Network Hierarchy */}
        <div className="space-y-4">
          <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider text-amber-400">
            Optimist Structure
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="p-2 rounded-xl bg-slate-800/80 border border-slate-700">
              <strong className="block text-white">Local Barbados Clubs</strong>
              <span className="text-[10px] text-slate-400">Progressive (# 78008), Bridgetown, St. Michael, South</span>
            </li>
            <li>
              <a
                href="https://oicaribbean.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-300 transition-colors flex items-center justify-between group"
              >
                <span>Caribbean District 78</span>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-300" />
              </a>
            </li>
            <li>
              <a
                href="https://optimist.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-300 transition-colors flex items-center justify-between group"
              >
                <span>Optimist International</span>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-amber-300" />
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact & Socials */}
        <div className="space-y-4">
          <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider text-amber-400">
            Contact & Address
          </h4>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>Ross University, Lloyd Erskine Sandiford Centre (LESC), Two Mile Hill, St. Michael, Barbados</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <a href="mailto:info@ProgressiveOptimist.org" className="hover:underline">
                info@ProgressiveOptimist.org
              </a>
            </div>
          </div>

          <div className="pt-2 flex items-center space-x-3">
            <a
              href="https://www.facebook.com/groups/ProgressiveOptimist/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-800 hover:bg-optimist-blue transition-colors text-white"
              title="Facebook Group"
            >
              <Globe className="w-4 h-4" />
            </a>
            <a
              href="https://www.instagram.com/progressiveoptimistclub/tagged/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-800 hover:bg-pink-600 transition-colors text-white"
              title="Instagram Tagged"
            >
              <Award className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>

      {/* 3. BOTTOM COPYRIGHT & CREDITS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Progressive Optimist Club of Barbados. All rights reserved.</p>
        <p className="flex items-center gap-1.5">
          <span>Made with ❤️ by</span>
          <a
            href="https://bajanthings.biz"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-amber-400 hover:underline"
          >
            Bajan Things
          </a>
        </p>
      </div>

    </footer>
  );
};
