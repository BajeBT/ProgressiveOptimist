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
  Download,
  ShieldCheck,
  Check,
  Search,
  UserCheck,
  DollarSign,
  Edit3
} from 'lucide-react';

export const MembershipPage = ({ onOpenPostModal }) => {
  const {
    currentUser,
    login,
    registerMember,
    updateDuesStatus,
    memberRoster,
    updateMemberDuesByTreasurer,
    logout,
    projects,
    memberGallery,
    addGalleryPhoto
  } = useAuth();
  
  // Auth state tabs (when logged out)
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'apply'
  
  // Dashboard tabs (when logged in)
  const [dashboardTab, setDashboardTab] = useState('projects'); // 'projects' | 'gallery' | 'resources' | 'dues' | 'treasurer'

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
  
  // Dues payment status message state
  const [duesPaymentMsg, setDuesPaymentMsg] = useState(false);

  // Treasurer Search Filter
  const [rosterSearch, setRosterSearch] = useState('');
  const [treasurerMsg, setTreasurerMsg] = useState('');

  // Handle Demo Member Login
  const handleDemoLogin = () => {
    login('member@progressiveoptimist.org', 'optimist2025');
  };

  // Handle Demo Treasurer Login
  const handleTreasurerLogin = () => {
    login('treasurer@progressiveoptimist.org', 'treasurer2025');
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

  const handlePayDues = () => {
    updateDuesStatus('Active Member in Good Standing (2025/2026)');
    setDuesPaymentMsg(true);
  };

  const handleTreasurerUpdateStatus = (memberId, memberName, newStatus) => {
    updateMemberDuesByTreasurer(memberId, newStatus, "$100 BBD");
    setTreasurerMsg(`Updated ${memberName}'s record to: ${newStatus}`);
    setTimeout(() => setTreasurerMsg(''), 4000);
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

  const filteredRoster = memberRoster.filter(m =>
    m.name.toLowerCase().includes(rosterSearch.toLowerCase()) ||
    m.email.toLowerCase().includes(rosterSearch.toLowerCase()) ||
    m.id.toLowerCase().includes(rosterSearch.toLowerCase())
  );

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
              className="w-20 h-20 rounded-2xl bg-slate-800 border-2 border-optimist-gold p-1 shadow-lg object-cover"
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
            My Dues Record
          </button>

          {/* Dedicated Treasurer Management Tab */}
          <button
            onClick={() => setDashboardTab('treasurer')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              dashboardTab === 'treasurer'
                ? 'bg-amber-500 text-slate-950 shadow font-extrabold'
                : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 hover:bg-amber-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Treasurer Dues Console</span>
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

        {/* Tab 4: Member Dues Record */}
        {dashboardTab === 'dues' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-5 shadow-xl">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-amber-400" />
                    Annual Membership Dues Record
                  </h2>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300">
                    2025 / 2026 Fiscal Year
                  </span>
                </div>

                {duesPaymentMsg ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 text-xs font-bold text-emerald-900 dark:text-emerald-200 space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span>Dues Record Updated Successfully!</span>
                    </div>
                    <p className="font-normal text-slate-600 dark:text-slate-300">
                      Your status is now <strong>Active Member in Good Standing (2025/2026)</strong>. A formal receipt has been emailed to <strong>{currentUser.email}</strong>.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      {currentUser.duesStatus}
                    </span>
                    <span>$0.00 Outstanding</span>
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                    Update / Pay Annual Membership Dues ($100 BBD)
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Annual dues support club operations, Caribbean District registration, and student mentorship projects across Barbados.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={handlePayDues}
                      className="px-5 py-3 rounded-xl gold-gradient text-slate-950 font-bold text-xs shadow hover:brightness-110 transition-all flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Pay Dues & Update Record ($100 BBD)</span>
                    </button>

                    <button
                      onClick={() => updateDuesStatus('Pending Dues Payment')}
                      className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      Set Dues Pending (Testing)
                    </button>
                  </div>
                </div>
              </div>

              {/* Dues History Log */}
              <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                  Recent Dues Payment History
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div>
                      <strong className="block text-slate-900 dark:text-white">2025/2026 Annual Dues</strong>
                      <span className="text-slate-400">Processed via Member Portal</span>
                    </div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">$100.00 BBD Paid</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div>
                      <strong className="block text-slate-900 dark:text-white">2024/2025 Annual Dues</strong>
                      <span className="text-slate-400">Processed October 2024</span>
                    </div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">$100.00 BBD Paid</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Treasurer Contact & Payment Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center space-x-3">
                  <img src="/avatars/treasurer_placeholder.jpg" alt="Treasurer" className="w-12 h-12 rounded-full border border-amber-400 object-cover" />
                  <div>
                    <h4 className="font-heading font-bold text-sm text-white">Sharon Mohammed</h4>
                    <span className="text-[10px] text-amber-400 uppercase font-bold">Club Treasurer</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  For bank transfer details, check payments, or treasurer receipts, contact <strong>treasurer@progressiveoptimist.org</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Dedicated TREASURER DUES MANAGEMENT CONSOLE */}
        {dashboardTab === 'treasurer' && (
          <div className="space-y-6">
            
            {/* Header Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1.5 w-fit">
                    <ShieldCheck className="w-3.5 h-3.5" /> Club Treasurer Administrative Console
                  </span>
                  <h2 className="font-heading text-2xl font-black text-white">
                    Member Dues Management Ledger
                  </h2>
                  <p className="text-xs text-slate-300">
                    As Club Treasurer (<strong>Sharon Mohammed</strong>), you can update member dues statuses, log offline cash/bank transfer payments, and maintain official records.
                  </p>
                </div>

                <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 text-right shrink-0">
                  <span className="text-xs text-slate-400 block">Total Active Members</span>
                  <strong className="font-heading text-2xl font-black text-emerald-400">
                    {memberRoster.filter(m => m.duesStatus.includes('Active')).length} / {memberRoster.length}
                  </strong>
                </div>
              </div>

              {treasurerMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{treasurerMsg}</span>
                </div>
              )}
            </div>

            {/* Controls Bar: Search & Export */}
            <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={rosterSearch}
                  onChange={e => setRosterSearch(e.target.value)}
                  placeholder="Search member name or ID..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
                />
              </div>

              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
                <span>Showing {filteredRoster.length} Member Records</span>
                <button
                  onClick={() => alert("Member Dues Ledger exported to CSV/PDF.")}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Export Ledger
                </button>
              </div>
            </div>

            {/* Member Ledger Table */}
            <div className="rounded-3xl overflow-hidden glass-card border border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Member Details</th>
                      <th className="p-4">Club Role</th>
                      <th className="p-4">Current Dues Status</th>
                      <th className="p-4">Last Payment Date</th>
                      <th className="p-4 text-right">Treasurer Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {filteredRoster.map((member) => (
                      <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-slate-900 dark:text-white text-sm">{member.name}</div>
                          <span className="text-slate-400 font-mono text-[10px]">{member.id} • {member.email}</span>
                        </td>
                        <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                          {member.role}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase inline-flex items-center gap-1 ${
                            member.duesStatus.includes('Active')
                              ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                              : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                          }`}>
                            {member.duesStatus.includes('Active') ? <Check className="w-3 h-3 text-emerald-500" /> : <AlertCircle className="w-3 h-3 text-amber-500" />}
                            {member.duesStatus}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500">
                          <strong>{member.lastPaymentDate}</strong> ({member.amountPaid})
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleTreasurerUpdateStatus(member.id, member.name, 'Active Member (2025/2026)')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow transition-colors"
                            title="Mark Dues Paid"
                          >
                            ✓ Mark Paid
                          </button>
                          <button
                            onClick={() => handleTreasurerUpdateStatus(member.id, member.name, 'Pending Dues Payment')}
                            className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 font-bold text-[10px] transition-colors"
                            title="Set Pending"
                          >
                            Set Pending
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

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
          Log in to publish new project posts, manage annual dues, and upload activity photos to the website, or apply for new membership with the Barbados club.
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
          
          <div className="flex flex-col gap-2">
            <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
              Log In To Your Account
            </h2>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={handleTreasurerLogin}
                className="text-[11px] font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-3.5 py-1.5 rounded-xl shadow flex items-center gap-1.5 transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>★ Log In as Treasurer (Sharon Mohammed)</span>
              </button>

              <button
                onClick={handleDemoLogin}
                className="text-[11px] font-bold text-optimist-blue dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 hover:underline"
              >
                Member Demo Login
              </button>
            </div>
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
                  placeholder="treasurer@progressiveoptimist.org"
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
