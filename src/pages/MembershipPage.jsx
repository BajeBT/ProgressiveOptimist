import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Lock,
  Mail,
  Phone,
  Sparkles,
  PlusCircle,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  FileText,
  CreditCard,
  LogOut,
  Upload,
  Calendar,
  Award,
  Download
} from 'lucide-react';

export const MembershipPage = ({ onOpenPostModal }) => {
  const { currentUser, login, registerMember, logout, projects, memberGallery, addGalleryPhoto } = useAuth();
  
  // Auth state tabs (when logged out)
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'apply'
  
  // Dashboard tabs (when logged in)
  const [dashboardTab, setDashboardTab] = useState('projects'); // 'projects' | 'gallery' | 'resources' | 'dues'

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Application form state
  const [appForm, setAppForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profession: '',
    sponsorName: '',
    reason: ''
  });
  const [appSuccess, setAppSuccess] = useState(false);

  // Gallery photo upload state
  const [photoUploadModal, setPhotoUploadModal] = useState(false);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);

  // Handle Demo Login
  const handleDemoLogin = () => {
    login('member@progressiveoptimist.org', 'optimist2025');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    const res = login(loginEmail, loginPassword);
    if (!res.success) {
      setLoginError(res.message);
    }
  };

  const handleAppSubmit = (e) => {
    e.preventDefault();
    const res = registerMember(appForm);
    if (res.success) {
      setAppSuccess(true);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setPhotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitPhoto = (e) => {
    e.preventDefault();
    if (!photoTitle || !photoUrl) return;

    addGalleryPhoto({
      title: photoTitle,
      caption: photoCaption,
      image: photoUrl
    });

    setPhotoUploadModal(false);
    setPhotoTitle('');
    setPhotoCaption('');
    setPhotoUrl('');
    setPhotoPreview(null);
  };

  // If user is LOGGED IN: Render Member Portal Dashboard
  if (currentUser) {
    const myProjects = projects.filter(p => p.authorId === currentUser.memberId || p.author === currentUser.name);

    return (
      <div className="space-y-8 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-optimist-navy via-optimist-blue to-slate-900 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-2xl bg-slate-800 border-2 border-optimist-gold p-1 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                  Welcome, {currentUser.name}!
                </h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded gold-gradient text-slate-950">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-1">
                Member ID: <strong className="text-amber-300">{currentUser.memberId}</strong> • Status: <strong className="text-emerald-400">{currentUser.duesStatus}</strong>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Progressive Optimist Club of Barbados Member Portal</p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenPostModal}
              className="gold-gradient text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow hover:brightness-110 transition-all text-xs flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Post Project</span>
            </button>

            <button
              onClick={() => setPhotoUploadModal(true)}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition-all text-xs flex items-center gap-2"
            >
              <Upload className="w-4 h-4 text-amber-400" />
              <span>Upload Photo</span>
            </button>

            <button
              onClick={logout}
              className="p-2.5 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <button
            onClick={() => setDashboardTab('projects')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              dashboardTab === 'projects'
                ? 'bg-optimist-blue text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            My Published Projects ({myProjects.length})
          </button>

          <button
            onClick={() => setDashboardTab('gallery')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              dashboardTab === 'gallery'
                ? 'bg-optimist-blue text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Member Photo Gallery ({memberGallery.length})
          </button>

          <button
            onClick={() => setDashboardTab('resources')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              dashboardTab === 'resources'
                ? 'bg-optimist-blue text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Internal Documents & Minutes
          </button>

          <button
            onClick={() => setDashboardTab('dues')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              dashboardTab === 'dues'
                ? 'bg-optimist-blue text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Annual Dues Record
          </button>
        </div>

        {/* Tab 1: Member Projects */}
        {dashboardTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
                Projects Published By You
              </h2>
              <button
                onClick={onOpenPostModal}
                className="text-xs font-bold text-optimist-blue dark:text-amber-400 flex items-center gap-1 hover:underline"
              >
                <PlusCircle className="w-4 h-4" /> Add Another Project
              </button>
            </div>

            {myProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myProjects.map((p) => (
                  <div key={p.id} className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 flex gap-4">
                    <img src={p.image} alt={p.title} className="w-24 h-24 rounded-xl object-cover shrink-0" />
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-optimist-blue">{p.category}</span>
                      <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{p.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{p.excerpt}</p>
                      <span className="text-[10px] text-slate-400 block pt-1">Posted on {p.postedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl glass-card border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
                <p className="text-xs text-slate-500">You haven't posted any projects yet. Click below to publish your first activity!</p>
                <button
                  onClick={onOpenPostModal}
                  className="px-4 py-2 rounded-xl bg-optimist-blue text-white font-bold text-xs shadow"
                >
                  Publish First Project
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Member Photo Gallery */}
        {dashboardTab === 'gallery' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
                Optimist Activity Photo Album
              </h2>
              <button
                onClick={() => setPhotoUploadModal(true)}
                className="text-xs font-bold text-optimist-blue dark:text-amber-400 flex items-center gap-1 hover:underline"
              >
                <Upload className="w-4 h-4" /> Upload New Photo
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {memberGallery.map((g) => (
                <div key={g.id} className="rounded-2xl overflow-hidden glass-card border border-slate-200 dark:border-slate-800 group">
                  <div className="h-48 bg-slate-900 overflow-hidden relative">
                    <img src={g.image} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-4 space-y-1">
                    <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white">{g.title}</h3>
                    <p className="text-xs text-slate-500">{g.caption}</p>
                    <div className="text-[10px] text-slate-400 pt-2 flex justify-between">
                      <span>Uploaded by {g.uploader}</span>
                      <span>{g.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Internal Documents */}
        {dashboardTab === 'resources' && (
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
              Member Resources & Meeting Minutes
            </h2>
            <div className="space-y-3">
              {[
                { name: "Monthly Meeting Minutes - July 2025", date: "July 7, 2025", size: "320 KB" },
                { name: "Progressive Optimist Constitution & Bylaws", date: "Annual Revision", size: "1.4 MB" },
                { name: "RISE 2025 Volunteer Schedule & Roster", date: "June 2025", size: "450 KB" }
              ].map((doc, idx) => (
                <div key={idx} className="p-4 rounded-xl glass-card border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-optimist-blue" />
                    <div>
                      <strong className="block text-slate-900 dark:text-white">{doc.name}</strong>
                      <span className="text-slate-400">{doc.date} • {doc.size}</span>
                    </div>
                  </div>
                  <button onClick={() => alert(`Downloading ${doc.name}...`)} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold hover:bg-optimist-blue hover:text-white transition-colors">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Dues Record */}
        {dashboardTab === 'dues' && (
          <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4 max-w-xl">
            <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-400" />
              Annual Membership Dues Status
            </h2>
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Active Member in Good Standing (2025/2026)
              </span>
              <span>$0.00 Outstanding</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Annual dues support club operational expenses, Caribbean District registration, and school outreach materials in Barbados.
            </p>
          </div>
        )}

        {/* PHOTO UPLOAD MODAL */}
        {photoUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">Upload Member Photo</h3>
              
              <form onSubmit={submitPhoto} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Photo Title *</label>
                  <input
                    type="text"
                    value={photoTitle}
                    onChange={e => setPhotoTitle(e.target.value)}
                    placeholder="e.g. Kite Workshop at Westbury"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Caption</label>
                  <input
                    type="text"
                    value={photoCaption}
                    onChange={e => setPhotoCaption(e.target.value)}
                    placeholder="Short description of the photo..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Select Photo File</label>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="w-full text-xs text-slate-500" />
                </div>

                {photoPreview && (
                  <img src={photoPreview} alt="Preview" className="h-32 w-full object-cover rounded-xl border" />
                )}

                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setPhotoUploadModal(false)} className="px-4 py-2 rounded-xl text-xs font-bold border">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded-xl bg-optimist-blue text-white text-xs font-bold shadow">Save Photo</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    );
  }

  // If user is LOGGED OUT: Render Login & Registration Tabs
  return (
    <div className="space-y-8 py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-optimist-gold px-3 py-1 rounded bg-amber-400/20">
          Member Access & Registration
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Progressive Optimist Member Portal
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Log in to publish new project posts and upload activity photos to the website, or apply for new membership with the Barbados club.
        </p>
      </div>

      {/* Switcher Tabs */}
      <div className="flex justify-center">
        <div className="bg-slate-200 dark:bg-slate-800 p-1.5 rounded-2xl flex space-x-2 max-w-md w-full">
          <button
            onClick={() => setAuthTab('login')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              authTab === 'login'
                ? 'bg-optimist-blue text-white shadow'
                : 'text-slate-700 dark:text-slate-300 hover:text-black'
            }`}
          >
            Member Login
          </button>
          <button
            onClick={() => setAuthTab('apply')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              authTab === 'apply'
                ? 'bg-optimist-blue text-white shadow'
                : 'text-slate-700 dark:text-slate-300 hover:text-black'
            }`}
          >
            New Member Application
          </button>
        </div>
      </div>

      {/* LOGIN FORM */}
      {authTab === 'login' && (
        <div className="p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 shadow-xl max-w-lg mx-auto space-y-6">
          
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
              Log In To Your Account
            </h2>
            <button
              onClick={handleDemoLogin}
              className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-3 py-1 rounded-lg border border-amber-300 dark:border-amber-700 hover:underline"
            >
              ★ One-Click Demo Member Login
            </button>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Member Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="member@progressiveoptimist.org"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-optimist-blue hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-colors"
            >
              Sign In As Member
            </button>
          </form>

        </div>
      )}

      {/* NEW MEMBER APPLICATION FORM */}
      {authTab === 'apply' && (
        <div className="p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 shadow-xl max-w-2xl mx-auto space-y-6">
          <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
            Online Membership Application
          </h2>

          {appSuccess ? (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-heading font-bold text-lg">Application Submitted!</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Welcome to the Progressive Optimist Club of Barbados! Your member portal account has been activated.
              </p>
            </div>
          ) : (
            <form onSubmit={handleAppSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={appForm.firstName}
                    onChange={e => setAppForm({ ...appForm, firstName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={appForm.lastName}
                    onChange={e => setAppForm({ ...appForm, lastName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={appForm.email}
                    onChange={e => setAppForm({ ...appForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={appForm.phone}
                    onChange={e => setAppForm({ ...appForm, phone: e.target.value })}
                    placeholder="+1 (246) ..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Why do you want to join Optimist in Barbados?</label>
                <textarea
                  rows={3}
                  value={appForm.reason}
                  onChange={e => setAppForm({ ...appForm, reason: e.target.value })}
                  placeholder="Share your passion for helping Bajan children and community work..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl gold-gradient text-slate-950 font-bold text-xs shadow hover:brightness-110 transition-all"
              >
                Submit Application & Activate Account
              </button>
            </form>
          )}
        </div>
      )}

    </div>
  );
};
