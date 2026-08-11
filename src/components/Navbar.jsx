import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sun,
  Moon,
  User,
  LogOut,
  PlusCircle,
  Menu,
  X,
  ChevronDown,
  Globe,
  Award,
  Heart,
  Laptop,
  Users,
  Shield,
  FileText,
  Calendar,
  Layers,
  Sparkles,
  BookOpen,
  Lock,
  TestTube,
  ShieldAlert,
  Database,
  ShieldCheck
} from 'lucide-react';

export const Navbar = ({ onOpenPostModal }) => {
  const { currentUser, logout, isDarkMode, toggleDarkMode, isSandboxMode, testEmailTarget, dbConnected, siteSettings } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      
      {/* SANDBOX MODE & EMAIL REROUTING ALERT BAR */}
      {isSandboxMode && (
        <div className="bg-amber-400 text-slate-950 text-[11px] font-black py-1 px-4 text-center border-b border-amber-500 shadow-sm flex items-center justify-center gap-2">
          <TestTube className="w-3.5 h-3.5 text-slate-950 animate-bounce" />
          <span>SANDBOX TEST MODE ACTIVE • All test emails rerouted to: <u>{testEmailTarget}</u></span>
        </div>
      )}

      {/* 1. TOP ANNOUNCEMENT & UTILITY BAR */}
      <div className="bg-gradient-to-r from-optimist-blue via-optimist-royal to-slate-900 text-white text-xs py-2 px-4 border-b border-amber-400/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Left: District Theme & DB Status */}
          <div className="flex items-center space-x-3 shrink-0">
            <span className="inline-flex items-center gap-1.5 font-bold px-2.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              District 78 (CAR) • Club # 78008
            </span>

            {isSandboxMode && dbConnected && (
              <span className="hidden sm:inline-flex items-center gap-1 font-extrabold text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Database className="w-3 h-3 text-emerald-400" />
                Neon DB Live
              </span>
            )}

            <span className="hidden md:inline text-blue-100 font-medium">
              2025-26 Theme: <strong className="text-amber-300 font-bold">{siteSettings?.themeTitle || "C.A.R.E – Championing Authentic & Reinvigorating Engagement"}</strong>
            </span>
          </div>

          {/* Right: Global Network Links */}
          <div className="flex items-center space-x-4 font-semibold text-[11px] shrink-0">
            <Link to="/directory" className="hover:text-amber-300 transition-colors flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>Official Roster Directory</span>
              <Lock className="w-3 h-3 text-amber-400 opacity-80" />
            </Link>
            <span className="text-blue-300/40">•</span>
            <a
              href="https://oicaribbean.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5 text-blue-300" />
              <span className="hidden sm:inline">Caribbean District</span>
            </a>
            <span className="text-blue-300/40">•</span>
            <a
              href="https://optimist.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Optimist International</span>
            </a>
          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER NAVIGATION BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
           {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center space-x-3 group shrink-0 mr-12 md:mr-16 lg:mr-20">
            <img
              src="/logo.png"
              alt="Progressive Optimist Club of Barbados"
              className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Uniform Center Navigation Bar */}
          <nav className="hidden lg:flex items-center space-x-1">
            
            {/* Nav 1: Home */}
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive('/')
                  ? 'bg-optimist-blue text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Home
            </Link>

            {/* Nav 2: About Us Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('about')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to="/about"
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                  isActive('/about') || isActive('/directory')
                    ? 'bg-optimist-blue text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>About Us</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </Link>

              {activeDropdown === 'about' && (
                <div className="absolute top-full left-0 w-64 pt-2 z-50">
                  <div className="p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-1">
                    <Link
                      to="/about"
                      className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3 group"
                    >
                      <Users className="w-4 h-4 text-optimist-blue group-hover:scale-110 transition-transform" />
                      <div>
                        <strong className="block text-xs text-slate-900 dark:text-white">Who We Are & Mission</strong>
                        <span className="text-[10px] text-slate-500">History & Optimist Creed</span>
                      </div>
                    </Link>
                    <Link
                      to="/directory"
                      className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3 group"
                    >
                      <BookOpen className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                      <div>
                        <strong className="block text-xs text-slate-900 dark:text-white flex items-center gap-1">
                          Club Roster Directory <Lock className="w-3 h-3 text-amber-500" />
                        </strong>
                        <span className="text-[10px] text-slate-500">Members Only Access</span>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Nav 3: Activities */}
            <Link
              to="/projects"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive('/projects')
                  ? 'bg-optimist-blue text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Activities
            </Link>

            {/* Nav 4: Barbados & Global Network */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('network')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to="/barbados-clubs"
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                  isActive('/barbados-clubs') || isActive('/hierarchy')
                    ? 'bg-optimist-blue text-white shadow-md'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>Optimist Network</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </Link>

              {activeDropdown === 'network' && (
                <div className="absolute top-full left-0 w-72 pt-2 z-50">
                  <div className="p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-1">
                    <Link
                      to="/directory"
                      className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3 group"
                    >
                      <BookOpen className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                      <div>
                        <strong className="block text-xs text-slate-900 dark:text-white flex items-center gap-1">
                          Progressive Optimist Directory <Lock className="w-3.5 h-3.5 text-amber-500" />
                        </strong>
                        <span className="text-[10px] text-slate-500">Members Only Roster</span>
                      </div>
                    </Link>
                    <Link
                      to="/barbados-clubs"
                      className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3 group"
                    >
                      <Shield className="w-4 h-4 text-optimist-blue group-hover:scale-110 transition-transform" />
                      <div>
                        <strong className="block text-xs text-slate-900 dark:text-white">Barbados Clubs Directory</strong>
                        <span className="text-[10px] text-slate-500">Bridgetown, St. Michael, South</span>
                      </div>
                    </Link>
                    <Link
                      to="/hierarchy"
                      className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-3 group"
                    >
                      <Layers className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                      <div>
                        <strong className="block text-xs text-slate-900 dark:text-white">District & Global Hierarchy</strong>
                        <span className="text-[10px] text-slate-500">Local • Caribbean • International</span>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Nav 5: Donations & Fundraiser */}
            <Link
              to="/donate"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isActive('/donate')
                  ? 'bg-optimist-blue text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-optimist-gold fill-optimist-gold" />
              <span>Donate</span>
            </Link>

            {/* Nav 6: Membership */}
            <Link
              to="/membership"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive('/membership')
                  ? 'bg-optimist-blue text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Membership
            </Link>

            {/* Nav 7: Contact */}
            <Link
              to="/contact"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive('/contact')
                  ? 'bg-optimist-blue text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Contact
            </Link>

          </nav>

          {/* Right Controls & Member Actions */}
          <div className="flex items-center space-x-3">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Main Nav Session actions */}
            {currentUser ? (
              <button
                onClick={logout}
                className="hidden sm:inline-flex p-2 rounded-xl bg-red-600/90 hover:bg-red-600 text-white shadow transition-all items-center justify-center opacity-90 hover:opacity-100"
                title="Logout"
              >
                <LogOut className="w-2.5 h-2.5 text-white opacity-90" />
              </button>
            ) : (
              <Link
                to="/membership"
                className="flex items-center space-x-1.5 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl font-extrabold text-xs shadow-md transition-all border border-orange-400/40 hover:scale-105"
              >
                <User className="w-4 h-4 text-white" />
                <span>Member Portal</span>
              </Link>
            )}

            {/* Mobile Drawer Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* 3. LOGGED-IN UTILITY SUB-NAVBAR ROW (Hidden on /membership and /admin pages) */}
      {currentUser && !['/membership', '/admin', '/admin-settings'].includes(location.pathname) && (
        <div className="bg-slate-100/80 dark:bg-slate-900 border-t border-b border-slate-200 dark:border-slate-800 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            
            {/* Left: Friendly greeting */}
            <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium hidden sm:block">
              Logged in as <strong className="text-slate-800 dark:text-slate-200">{currentUser.name}</strong> ({currentUser.role})
            </div>

            {/* Right: Relocated buttons (+Post Project, Admin Settings, Member Profile link) */}
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
              
              <button
                onClick={onOpenPostModal}
                className="flex items-center space-x-1.5 gold-gradient text-slate-950 px-3.5 py-1.5 rounded-xl font-extrabold text-xs shadow hover:brightness-110 transition-all shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Post Project</span>
              </button>

              { (currentUser.access === 'super admin' || currentUser.isTreasurer || currentUser.role?.includes('President') || currentUser.role?.includes('Treasurer') || currentUser.role?.includes('Director') || currentUser.role?.includes('Admin') || currentUser.email?.toLowerCase().includes('sharon') || currentUser.email?.toLowerCase().includes('treasurer')) && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700 px-3 py-1.5 rounded-xl font-bold text-xs shadow transition-all shrink-0"
                  title="Admin & Site Settings Console"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Admin Settings</span>
                </Link>
              )}

              <Link
                to="/membership"
                className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-1.5 rounded-xl font-extrabold text-xs shadow transition-all shrink-0"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-5 h-5 rounded-full bg-slate-900 object-cover"
                />
                <span>{currentUser.name}</span>
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            About Us
          </Link>
          <Link
            to="/directory"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
          >
            <span>Club Roster Directory</span>
            <Lock className="w-3.5 h-3.5 text-amber-500" />
          </Link>
          <Link
            to="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Activities
          </Link>
          <Link
            to="/barbados-clubs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Barbados Clubs Directory
          </Link>
          <Link
            to="/hierarchy"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            District & Global Hierarchy
          </Link>
          <Link
            to="/donate"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Donate & Sponsorships
          </Link>
          <Link
            to="/membership"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Member Portal
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Contact Us
          </Link>

          {currentUser && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPostModal();
              }}
              className="w-full mt-2 flex items-center justify-center space-x-2 royal-gradient text-white py-3 rounded-xl font-bold text-sm shadow"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Post New Project / Activity</span>
            </button>
          )}
        </div>
      )}

    </header>
  );
};
