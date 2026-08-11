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
  Edit3,
  Send,
  MessageSquare,
  FileSpreadsheet,
  Building2,
  Copy,
  Printer,
  X
} from 'lucide-react';

export const MembershipPage = ({ onOpenPostModal }) => {
  const {
    currentUser,
    login,
    registerMember,
    updateDuesStatus,
    memberRoster,
    updateMemberDuesByTreasurer,
    updateMemberNotesByTreasurer,
    sendDuesStatementEmail,
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
  
  // Member Statement Modal state
  const [statementModalMember, setStatementModalMember] = useState(null);

  // Dues payment status message state
  const [duesPaymentMsg, setDuesPaymentMsg] = useState(false);
  const [copiedBankInfo, setCopiedBankInfo] = useState(false);

  // Treasurer Search Filter & Checkbox selection state
  const [rosterSearch, setRosterSearch] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [tempNotesText, setTempNotesText] = useState('');
  const [treasurerMsg, setTreasurerMsg] = useState('');

  const bankDetails = {
    bank: "Scotiabank",
    accountName: "Progressive Optimist",
    accountNum: "000451801",
    branch: "Haggatt Hall",
    routing: "66555"
  };

  const copyBankInfo = () => {
    const text = `To pay your Dues via Bank Deposit/Transfer:\nBank: ${bankDetails.bank}\nAccount Name: ${bankDetails.accountName}\nAccount #: ${bankDetails.accountNum}\nBranch: ${bankDetails.branch}\nTransit/Routing #: ${bankDetails.routing}`;
    navigator.clipboard.writeText(text);
    setCopiedBankInfo(true);
    setTimeout(() => setCopiedBankInfo(false), 3000);
  };

  // Handle Demo Member Login
  const handleDemoLogin = () => {
    login('member@progressiveoptimist.org', 'optimist2025');
  };

  // Handle Demo Treasurer Login with specified credentials
  const handleTreasurerLogin = () => {
    setLoginEmail('treasurer@progressiveoptimist.org');
    setLoginPassword('Temp@1234');
    login('treasurer@progressiveoptimist.org', 'Temp@1234');
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
    updateMemberDuesByTreasurer(memberId, newStatus, "$250.00 BBD", "Bank Transfer");
    setTreasurerMsg(`Updated ${memberName}'s dues record to: ${newStatus}`);
    setTimeout(() => setTreasurerMsg(''), 4000);
  };

  const handleSaveNotes = (memberId) => {
    updateMemberNotesByTreasurer(memberId, tempNotesText);
    setEditingNotesId(null);
    setTreasurerMsg("Treasurer notes saved successfully.");
    setTimeout(() => setTreasurerMsg(''), 3000);
  };

  const handleSendEmailStatement = (memberIds) => {
    const res = sendDuesStatementEmail(memberIds);
    setTreasurerMsg(res.message);
    setTimeout(() => setTreasurerMsg(''), 5000);
  };

  const toggleSelectMember = (id) => {
    setSelectedMemberIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedMemberIds.length === filteredRoster.length) {
      setSelectedMemberIds([]);
    } else {
      setSelectedMemberIds(filteredRoster.map(m => m.id));
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
        <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-100 via-green-100 to-emerald-200 dark:from-emerald-950 dark:via-emerald-900 dark:to-slate-900 text-slate-900 dark:text-white shadow-xl border border-emerald-300 dark:border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 border-2 border-emerald-500 p-1 shadow-lg object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  Welcome, {currentUser.name}!
                </h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded gold-gradient text-slate-950">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1">
                Member ID: <strong className="text-emerald-950 dark:text-amber-300">{currentUser.memberId}</strong> • Status: <strong className="text-emerald-700 dark:text-emerald-400">{currentUser.duesStatus}</strong>
              </p>
              <p className="text-xs text-emerald-700 dark:text-slate-400 mt-0.5">Progressive Optimist Club of Barbados Member Portal</p>
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
            My Dues Record ($250 BBD)
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
                    2025 / 2026 Optimist Year
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-xs text-amber-900 dark:text-amber-300 font-bold flex items-center justify-between">
                  <span>Optimist Fiscal Year: Oct 1, 2025 – Sep 30, 2026</span>
                  <strong className="text-sm text-optimist-blue dark:text-amber-400 font-heading">Dues: BDS$ 250.00 / Year</strong>
                </div>

                {duesPaymentMsg ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 text-xs font-bold text-emerald-900 dark:text-emerald-200 space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span>Dues Record Updated Successfully!</span>
                    </div>
                    <p className="font-normal text-slate-600 dark:text-slate-300">
                      Your status is now <strong>Active Member in Good Standing (2025/2026)</strong>. A formal receipt for BDS$ 250.00 has been emailed to <strong>{currentUser.email}</strong>.
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
                    Pay Annual Membership Dues ($250 BBD)
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Annual dues (BDS$ 250.00 / year) support club operations, Caribbean District registration, and primary school student projects in Barbados.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={handlePayDues}
                      className="px-5 py-3 rounded-xl gold-gradient text-slate-950 font-bold text-xs shadow hover:brightness-110 transition-all flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Pay Dues & Update Record ($250 BBD)</span>
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
                      <strong className="block text-slate-900 dark:text-white">2025/2026 Optimist Year (Oct 1 - Sep 30)</strong>
                      <span className="text-slate-400">Processed via Member Portal</span>
                    </div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">$250.00 BBD Paid</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div>
                      <strong className="block text-slate-900 dark:text-white">2024/2025 Optimist Year (Oct 1 - Sep 30)</strong>
                      <span className="text-slate-400">Processed October 2024</span>
                    </div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">$250.00 BBD Paid</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Bank Deposit Instructions & Treasurer Info */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Scotiabank Bank Deposit Instructions Card */}
              <div className="p-6 rounded-3xl bg-slate-900 text-white border border-amber-400/40 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    To Pay Your Dues via Bank Transfer:
                  </h4>
                  <button onClick={copyBankInfo} className="text-[10px] text-amber-300 font-bold hover:underline">
                    {copiedBankInfo ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                <div className="space-y-2 text-xs bg-slate-800/90 p-4 rounded-2xl border border-slate-700 font-mono">
                  <p><strong>Bank:</strong> {bankDetails.bank}</p>
                  <p><strong>Account Name:</strong> {bankDetails.accountName}</p>
                  <p><strong>Account #:</strong> <span className="text-emerald-400 font-bold">{bankDetails.accountNum}</span></p>
                  <p><strong>Branch:</strong> {bankDetails.branch}</p>
                  <p><strong>Transit/Routing #:</strong> <span className="text-amber-300 font-bold">{bankDetails.routing}</span></p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center space-x-3">
                  <img src="/avatars/treasurer_placeholder.jpg" alt="Treasurer" className="w-12 h-12 rounded-full border border-amber-400 object-cover" />
                  <div>
                    <h4 className="font-heading font-bold text-sm text-white">Sharon Mohammed</h4>
                    <span className="text-[10px] text-amber-400 uppercase font-bold">Club Treasurer</span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  For bank transfer details, check payments, or treasurer receipts, contact <strong>sharon@topaz-bb.com</strong> or <strong>treasurer@progressiveoptimist.org</strong>.
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
                    Member Dues Management Ledger (BDS$ 250.00 / Year)
                  </h2>
                  <p className="text-xs text-slate-300">
                    Optimist Fiscal Year runs <strong>October 1st to September 30th</strong>. As Club Treasurer (<strong>Sharon Mohammed</strong>), you can record payments, click member names to view statements, add notes, and email dues balance statements.
                  </p>
                </div>

                <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 text-right shrink-0">
                  <span className="text-xs text-slate-400 block">Total Active Settled Dues</span>
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

            {/* Scotiabank Bank Transfer Info Box for Treasurer */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white border border-amber-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs space-y-0.5">
                <strong className="text-amber-400 font-bold block">Official Scotiabank Dues Deposit Account:</strong>
                <p className="text-slate-300 font-mono">
                  Bank: <strong>Scotiabank</strong> • Account Name: <strong>Progressive Optimist</strong> • Account #: <strong className="text-emerald-400">000451801</strong> • Branch: <strong>Haggatt Hall</strong> • Transit/Routing #: <strong className="text-amber-300">66555</strong>
                </p>
              </div>
              <button onClick={copyBankInfo} className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shrink-0">
                {copiedBankInfo ? 'Copied!' : 'Copy Bank Details'}
              </button>
            </div>

            {/* Controls Bar: Search, Select All, Bulk Email & Export */}
            <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={rosterSearch}
                    onChange={e => setRosterSearch(e.target.value)}
                    placeholder="Search member name or ID..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
                  />
                </div>

                <button
                  onClick={toggleSelectAll}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  {selectedMemberIds.length === filteredRoster.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {selectedMemberIds.length > 0 && (
                  <button
                    onClick={() => handleSendEmailStatement(selectedMemberIds)}
                    className="px-4 py-2 rounded-xl bg-optimist-blue text-white text-xs font-bold shadow hover:bg-blue-800 transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-300" />
                    <span>Email Balance Statement to Selected ({selectedMemberIds.length})</span>
                  </button>
                )}

                <button
                  onClick={() => alert("Full Member Dues Ledger exported to CSV/Excel.")}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5 text-slate-700 dark:text-slate-200"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" /> Export Excel Ledger
                </button>
              </div>
            </div>

            {/* Member Ledger Table with Notes & Email Buttons */}
            <div className="rounded-3xl overflow-hidden glass-card border border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4 w-10">
                        <input
                          type="checkbox"
                          checked={selectedMemberIds.length === filteredRoster.length && filteredRoster.length > 0}
                          onChange={toggleSelectAll}
                          className="rounded border-slate-300"
                        />
                      </th>
                      <th className="p-4">Member Name (Click for Statement)</th>
                      <th className="p-4">Fiscal Year & Rate</th>
                      <th className="p-4">Paid / Balance Due</th>
                      <th className="p-4">Payment Method & Status</th>
                      <th className="p-4">Treasurer Notes</th>
                      <th className="p-4 text-right">Treasurer Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {filteredRoster.map((member) => {
                      const isSelected = selectedMemberIds.includes(member.id);
                      const isEditingNotes = editingNotesId === member.id;

                      return (
                        <tr key={member.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isSelected ? 'bg-amber-400/10' : ''}`}>
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectMember(member.id)}
                              className="rounded border-slate-300"
                            />
                          </td>

                          {/* Member Name Link -> Opens Member Statement Modal */}
                          <td className="p-4">
                            <button
                              onClick={() => setStatementModalMember(member)}
                              className="font-bold text-optimist-blue dark:text-amber-400 hover:underline text-sm text-left flex items-center gap-1.5 group"
                              title="Click to view Official Dues Statement"
                            >
                              <span>{member.name}</span>
                              <FileText className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 text-amber-500 transition-opacity" />
                            </button>
                            <span className="text-slate-400 font-mono text-[10px] block">{member.id}</span>
                            <span className="text-slate-500 text-[10px]">{member.email}</span>
                          </td>

                          <td className="p-4 font-medium text-slate-700 dark:text-slate-300">
                            <strong className="block text-slate-900 dark:text-white">2025/2026</strong>
                            <span className="text-amber-600 dark:text-amber-400 font-bold">$250.00 BBD Rate</span>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 block">Paid: {member.amountPaid}</span>
                            <span className={`text-[11px] font-bold ${member.balanceDue === '$0.00 BBD' ? 'text-slate-400' : 'text-rose-600 dark:text-rose-400'}`}>
                              Due: {member.balanceDue}
                            </span>
                          </td>
                          <td className="p-4 space-y-1">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase inline-flex items-center gap-1 ${
                              member.duesStatus.includes('Active')
                                ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                                : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                            }`}>
                              {member.duesStatus.includes('Active') ? <Check className="w-3 h-3 text-emerald-500" /> : <AlertCircle className="w-3 h-3 text-amber-500" />}
                              {member.duesStatus}
                            </span>
                            <span className="text-[10px] text-slate-500 block">Method: {member.paymentMethod}</span>
                          </td>
                          
                          {/* Editable Notes Field */}
                          <td className="p-4 max-w-xs">
                            {isEditingNotes ? (
                              <div className="space-y-1">
                                <textarea
                                  rows={2}
                                  value={tempNotesText}
                                  onChange={e => setTempNotesText(e.target.value)}
                                  className="w-full p-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                                />
                                <div className="flex gap-1 justify-end">
                                  <button onClick={() => setEditingNotesId(null)} className="px-2 py-0.5 rounded text-[10px] border">Cancel</button>
                                  <button onClick={() => handleSaveNotes(member.id)} className="px-2 py-0.5 rounded text-[10px] bg-optimist-blue text-white font-bold">Save</button>
                                </div>
                              </div>
                            ) : (
                              <div
                                onClick={() => {
                                  setEditingNotesId(member.id);
                                  setTempNotesText(member.notes || '');
                                }}
                                className="group p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-amber-400 transition-colors"
                              >
                                <p className="text-[11px] text-slate-700 dark:text-slate-300 italic line-clamp-2">
                                  "{member.notes || 'Click to add treasurer notes...'}"
                                </p>
                                <span className="text-[9px] font-bold text-optimist-blue dark:text-amber-400 group-hover:underline flex items-center gap-1 mt-1">
                                  <Edit3 className="w-2.5 h-2.5" /> Edit Notes
                                </span>
                              </div>
                            )}
                          </td>

                          {/* Action Buttons: View Statement, Mark Paid & Send Email Statement */}
                          <td className="p-4 text-right space-y-1.5">
                            <button
                              onClick={() => setStatementModalMember(member)}
                              className="w-full px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] shadow transition-colors flex items-center justify-center gap-1"
                            >
                              <FileText className="w-3 h-3" /> View Statement
                            </button>

                            <button
                              onClick={() => handleTreasurerUpdateStatus(member.id, member.name, 'Active Member (2025/2026)')}
                              className="w-full px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow transition-colors flex items-center justify-center gap-1"
                              title="Mark $250 Dues Paid"
                            >
                              <Check className="w-3 h-3" /> Mark $250 Paid
                            </button>

                            <button
                              onClick={() => handleSendEmailStatement(member.id)}
                              className="w-full px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-optimist-blue hover:text-white text-slate-700 dark:text-slate-300 font-bold text-[10px] transition-colors flex items-center justify-center gap-1 border border-slate-200 dark:border-slate-700"
                              title="Send Email Statement"
                            >
                              <Send className="w-3 h-3 text-amber-500" /> Email Statement
                            </button>
                            
                            {member.emailLastSent && (
                              <span className="text-[9px] text-slate-400 block text-center">
                                Statement Sent: {member.emailLastSent}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* OFFICIAL MEMBER DUES STATEMENT MODAL */}
        {statementModalMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
              
              {/* Modal Close Button */}
              <button
                onClick={() => setStatementModalMember(null)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Statement Header */}
              <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-3">
                <div className="flex items-center space-x-3">
                  <img src="/logo.png" alt="Progressive Optimist" className="h-12 w-auto" />
                  <div>
                    <h2 className="font-heading font-black text-lg text-slate-900 dark:text-white">
                      PROGRESSIVE OPTIMIST CLUB OF BARBADOS
                    </h2>
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                      Club # 78008 • District 78 (CAR) • Zone 8
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <span><strong>Document:</strong> Official Annual Dues Statement</span>
                  <span><strong>Statement Date:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span><strong>Ref #:</strong> STMT-78008-2025-{statementModalMember.id}</span>
                </div>
              </div>

              {/* Member Details & Account Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Member Account Info</span>
                  <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white">{statementModalMember.name}</h3>
                  <p className="text-slate-600 dark:text-slate-300">Member ID: <strong>{statementModalMember.id}</strong></p>
                  <p className="text-slate-600 dark:text-slate-300">Designation: <strong>{statementModalMember.role}</strong></p>
                  <p className="text-slate-600 dark:text-slate-300">Email: <strong>{statementModalMember.email}</strong></p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-amber-700 dark:text-amber-300 block">Dues Status & Balance</span>
                  <p className="text-slate-800 dark:text-slate-200">Fiscal Year: <strong>2025/2026 (Oct 1 - Sep 30)</strong></p>
                  <p className="text-slate-800 dark:text-slate-200">Annual Dues Rate: <strong>BDS$ 250.00</strong></p>
                  <p className="text-slate-800 dark:text-slate-200">Amount Paid: <strong className="text-emerald-600 dark:text-emerald-400">{statementModalMember.amountPaid}</strong></p>
                  <p className="text-slate-800 dark:text-slate-200">Current Balance Due: <strong className={statementModalMember.balanceDue === '$0.00 BBD' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>{statementModalMember.balanceDue}</strong></p>
                </div>
              </div>

              {/* Payment History Breakdown */}
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  Fiscal Year Dues Ledger Transactions
                </h4>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-[10px] font-bold uppercase text-slate-600 dark:text-slate-300">
                      <tr>
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Description</th>
                        <th className="p-2.5">Method</th>
                        <th className="p-2.5 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      <tr>
                        <td className="p-2.5 font-mono text-slate-500">{statementModalMember.lastPaymentDate}</td>
                        <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">Annual Club Dues (2025/2026)</td>
                        <td className="p-2.5 text-slate-500">{statementModalMember.paymentMethod}</td>
                        <td className="p-2.5 text-right font-bold text-emerald-600 dark:text-emerald-400">{statementModalMember.amountPaid}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bank Transfer Instructions */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-1 text-xs font-mono">
                <span className="text-[10px] font-bold text-amber-400 uppercase block font-sans">Payment Instructions: Scotiabank Bank Transfer</span>
                <p>Bank: <strong>Scotiabank</strong> • Account Name: <strong>Progressive Optimist</strong></p>
                <p>Account #: <strong className="text-emerald-400">000451801</strong> • Branch: <strong>Haggatt Hall</strong> • Transit #: <strong className="text-amber-300">66555</strong></p>
              </div>

              {/* Remarks & Notes */}
              {statementModalMember.notes && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs italic text-slate-600 dark:text-slate-300">
                  <strong>Treasurer Notes:</strong> "{statementModalMember.notes}"
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" /> Print / Save PDF
                  </button>

                  <button
                    onClick={() => {
                      handleSendEmailStatement(statementModalMember.id);
                      alert(`Statement dispatched for ${statementModalMember.name}! Copies rerouted to dev@bajanthings.biz.`);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-optimist-blue hover:bg-blue-800 text-white text-xs font-bold shadow transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-4 h-4 text-amber-300" /> Email Statement to Member
                  </button>
                </div>

                <button
                  onClick={() => setStatementModalMember(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition-colors"
                >
                  Close Statement
                </button>
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
          Log in to publish new project posts, manage annual dues ($250 BBD / year), and upload activity photos to the website, or apply for new membership with the Barbados club.
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
                <span>★ Auto-Fill & Login as Treasurer (Sharon Mohammed)</span>
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
