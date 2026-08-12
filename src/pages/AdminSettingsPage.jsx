import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Settings,
  Users,
  Sparkles,
  Edit3,
  Trash2,
  Plus,
  Save,
  CheckCircle2,
  AlertCircle,
  Lock,
  Search,
  Building2,
  Calendar,
  MapPin,
  Mail,
  Phone,
  DollarSign,
  TestTube,
  Check,
  X,
  ShieldAlert,
  FileSpreadsheet,
  Send,
  FileText,
  CreditCard,
  Eye,
  Download,
  Printer,
  MessageSquare,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

export const AdminSettingsPage = () => {
  const {
    currentUser,
    memberRoster,
    primaryInitiatives,
    updatePrimaryInitiatives,
    siteSettings,
    updateSiteSettings,
    updateMemberPermissions,
    updateMemberRecord,
    updateMemberDuesByTreasurer,
    updateMemberNotesByTreasurer,
    sendDuesStatementEmail,
    isSandboxMode,
    testEmailTarget,
    projects,
    approveProject,
    deleteProject,
    contactSubjects,
    addContactSubject,
    removeContactSubject,
    reorderContactSubject
  } = useAuth();

  const userAccess = currentUser?.access || 'member';
  const [activeTab, setActiveTab] = useState(userAccess === 'moderator' ? 'moderation' : 'variables'); // 'variables' | 'permissions' | 'treasurer' | 'moderation'
  
  // Treasurer Console State
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [tempNotesText, setTempNotesText] = useState('');
  const [statementModalMember, setStatementModalMember] = useState(null);
  const [treasurerMsg, setTreasurerMsg] = useState('');
  const [copiedBankInfo, setCopiedBankInfo] = useState(false);
  const [rosterSearch, setRosterSearch] = useState('');

  const bankDetails = {
    bank: "Scotiabank (Barbados) Ltd.",
    accountName: "Progressive Optimist Club of Barbados",
    accountNum: "000451801",
    branch: "Haggatt Hall Branch, St. Michael",
    routing: "66555"
  };

  const copyBankInfo = () => {
    const infoText = `Bank: ${bankDetails.bank}\nAccount Name: ${bankDetails.accountName}\nAccount #: ${bankDetails.accountNum}\nBranch: ${bankDetails.branch}\nRouting/Transit: ${bankDetails.routing}`;
    navigator.clipboard.writeText(infoText);
    setCopiedBankInfo(true);
    setTimeout(() => setCopiedBankInfo(false), 3000);
  };

  const toggleSelectMember = (id) => {
    setSelectedMemberIds(prev =>
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedMemberIds.length === filteredRoster.length) {
      setSelectedMemberIds([]);
    } else {
      setSelectedMemberIds(filteredRoster.map(m => m.id));
    }
  };

  const handleTreasurerUpdateStatus = async (memberId, memberName, newStatus) => {
    const res = await updateMemberDuesByTreasurer(memberId, newStatus);
    if (res.success) {
      setTreasurerMsg(`Updated dues record for ${memberName} to ${newStatus}. Formal receipt emailed.`);
      setTimeout(() => setTreasurerMsg(''), 5000);
    }
  };

  const handleSaveNotes = async (memberId) => {
    const res = await updateMemberNotesByTreasurer(memberId, tempNotesText);
    if (res.success) {
      setEditingNotesId(null);
      setTreasurerMsg('Updated treasurer notes for member record.');
      setTimeout(() => setTreasurerMsg(''), 4000);
    }
  };

  const handleSendEmailStatement = async (memberIds) => {
    const targets = Array.isArray(memberIds) ? memberIds : [memberIds];
    const res = await sendDuesStatementEmail(targets);
    if (res.success) {
      setTreasurerMsg(`Sent official dues balance statements to ${targets.length} member(s).`);
      setTimeout(() => setTreasurerMsg(''), 5000);
    }
  };
  
  // Site Variables Form State
  const [meetingSchedule, setMeetingSchedule] = useState(siteSettings?.meetingSchedule || "1st Monday of every month at 5:30 PM");
  const [meetingVenue, setMeetingVenue] = useState(siteSettings?.meetingVenue || "Ross University, Lloyd Erskine Sandiford Centre (LESC), Two Mile Hill, St. Michael, Barbados");
  const [supportEmail, setSupportEmail] = useState(siteSettings?.supportEmail || "info@progressiveoptimist.org");
  const [contactPhone, setContactPhone] = useState(siteSettings?.contactPhone || "+1 (246) 836-6185");
  const [annualDuesRate, setAnnualDuesRate] = useState(siteSettings?.annualDuesRate || "$250.00");
  const [themeTitle, setThemeTitle] = useState(siteSettings?.themeTitle || "C.A.R.E – Championing Authentic & Reinvigorating Engagement");
  
  // Primary Initiatives State
  const [initiativesList, setInitiativesList] = useState(primaryInitiatives || [
    "RISE Summer Experience & Challenge",
    "Easter Cheer Kite Giveaway (Westbury & Ignatius Byer Primary)",
    "Laptop & Tablet Fundraiser for Students",
    "Mini Millionaires in the Making Mentorship"
  ]);
  const [newInitiativeText, setNewInitiativeText] = useState('');
  const [newSubjectText, setNewSubjectText] = useState('');

  // Roster Editor Modal State
  const [selectedMemberToEdit, setSelectedMemberToEdit] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: '',
    access: 'member',
    duesRate: '',
    amountPaid: '',
    balanceDue: '',
    paymentMethod: '',
    duesStatus: '',
    lastPaymentDate: ''
  });

  const handleStartEdit = (m) => {
    setSelectedMemberToEdit(m);
    setEditForm({
      name: m.name || '',
      email: m.email || '',
      phone: m.phone || '',
      address: m.address || '',
      role: m.role || 'Active Member',
      access: m.access || 'member',
      duesRate: m.duesRate || '$250.00',
      amountPaid: m.amountPaid || '$250.00',
      balanceDue: m.balanceDue || '$0.00',
      paymentMethod: m.paymentMethod || 'Bank Transfer',
      duesStatus: m.duesStatus || 'Active Member (2025/2026)',
      lastPaymentDate: m.lastPaymentDate || '2025-10-01'
    });
  };

  const handleSaveMemberRecord = (e) => {
    e.preventDefault();
    if (!selectedMemberToEdit) return;
    updateMemberRecord(selectedMemberToEdit.id, editForm);
    setSelectedMemberToEdit(null);
    setStatusMsg(`Successfully updated member record details and dues for ${editForm.name}.`);
    setTimeout(() => setStatusMsg(''), 4000);
  };

  // Member Search State
  const [memberSearch, setMemberSearch] = useState('');

  // Feedback Message
  const [statusMsg, setStatusMsg] = useState('');

  // Handle auto-approval/deletion from moderation email links
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    const action = params.get('action');
    const id = params.get('id');

    if (tab) {
      setActiveTab(tab);
    }

    if (action && id && projects.length > 0) {
      if (action === 'approve') {
        approveProject(id);
        setStatusMsg(`Approved project initiative via moderation email action link.`);
        setTimeout(() => setStatusMsg(''), 5000);
      } else if (action === 'delete') {
        deleteProject(id);
        setStatusMsg(`Rejected and deleted project initiative via moderation email action link.`);
        setTimeout(() => setStatusMsg(''), 5000);
      }
      
      // Clean up URL query parameters so it does not keep triggering on navigation
      window.history.replaceState({}, document.title, window.location.pathname + (tab ? `?tab=${tab}` : ''));
    }
  }, [projects]);

  // Access check based on the new access level roles
  const isAuthorized = ['super admin', 'finance', 'admin', 'moderator'].includes(userAccess);
  const canManageSettings = ['super admin', 'finance', 'admin'].includes(userAccess);
  const canModerateProjects = ['super admin', 'finance', 'admin', 'moderator'].includes(userAccess);

  if (!isAuthorized) {
    return (
      <div className="py-16 max-w-3xl mx-auto px-4 text-center space-y-6">
        <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl space-y-4">
          <Lock className="w-16 h-16 text-amber-400 mx-auto" />
          <h1 className="font-heading text-3xl font-semibold">Restricted Administrator Area</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            The Admin & Site Settings Console is reserved for authorized Club Executive Officers, President Richelle Lucas, and Treasurer Sharon Mohammed.
          </p>
        </div>
      </div>
    );
  }

  // Save Site Variables & Initiatives
  const handleSaveVariables = (e) => {
    e.preventDefault();
    updateSiteSettings({
      meetingSchedule,
      meetingVenue,
      supportEmail,
      contactPhone,
      annualDuesRate,
      themeTitle
    });
    setStatusMsg("Site variables updated successfully!");
    setTimeout(() => setStatusMsg(''), 4000);
  };

  // Add Initiative
  const handleAddInitiative = () => {
    if (!newInitiativeText.trim()) return;
    setInitiativesList(prev => [...prev, newInitiativeText.trim()]);
    setNewInitiativeText('');
  };

  // Remove Initiative
  const handleRemoveInitiative = (index) => {
    setInitiativesList(prev => prev.filter((_, idx) => idx !== index));
  };

  // Toggle permission for member
  const handleTogglePermission = (memberId, permissionKey, currentVal) => {
    updateMemberPermissions(memberId, permissionKey, !currentVal);
    setStatusMsg(`Updated access permissions for member ${memberId}.`);
    setTimeout(() => setStatusMsg(''), 3000);
  };

  // Filter roster for permissions table
  const filteredRoster = memberRoster.filter(m =>
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.id.toLowerCase().includes(memberSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Admin Header */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white border border-amber-400/30 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1.5 w-fit">
              <ShieldCheck className="w-3.5 h-3.5" /> Club Executive Administrator Portal
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl font-semibold">
              Admin & Site Settings Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Manage live site variable information, update Primary Initiatives, and configure member access levels across the platform.
            </p>
          </div>

          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 text-right shrink-0">
            <span className="text-xs text-slate-400 block">Logged In Administrator</span>
            <strong className="font-heading text-sm text-amber-300">{currentUser.name}</strong>
            <span className="text-[10px] text-emerald-400 block">{currentUser.role}</span>
          </div>
        </div>

        {statusMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {canManageSettings && (
          <>
            <button
              onClick={() => setActiveTab('variables')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'variables'
                  ? 'bg-optimist-blue text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Site Variables & Primary Initiatives</span>
            </button>

            <button
              onClick={() => setActiveTab('permissions')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'permissions'
                  ? 'bg-optimist-blue text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Member Records ({memberRoster.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('treasurer')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'treasurer'
                  ? 'bg-amber-500 text-slate-950 shadow font-bold'
                  : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 hover:bg-amber-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Treasurer Dues Console</span>
            </button>
          </>
        )}

        {canModerateProjects && (
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'moderation'
                ? 'bg-optimist-blue text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span>Project Moderation Queue ({projects.filter(p => p.approved === false).length})</span>
          </button>
        )}
      </div>

      {/* TAB 1: SITE VARIABLES */}
      {activeTab === 'variables' && (
        <div className="space-y-8">
        <form onSubmit={handleSaveVariables} className="space-y-8">

          {/* Section 2: Club Details & Variable Information */}
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
            <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              <Building2 className="w-5 h-5 text-optimist-blue" />
              Club Information & Site Variables
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  Meeting Schedule *
                </label>
                <input
                  type="text"
                  value={meetingSchedule}
                  onChange={e => setMeetingSchedule(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  Annual Dues Rate *
                </label>
                <input
                  type="text"
                  value={annualDuesRate}
                  onChange={e => setAnnualDuesRate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  Meeting Venue Location *
                </label>
                <input
                  type="text"
                  value={meetingVenue}
                  onChange={e => setMeetingVenue(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  Club Theme Title (2025-26) *
                </label>
                <input
                  type="text"
                  value={themeTitle}
                  onChange={e => setThemeTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  Official Support Email *
                </label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={e => setSupportEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  Official Contact Phone Number *
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
                  required
                />
              </div>
            </div>

            {/* Sandbox Status Box */}
            <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between transition-colors ${
              isSandboxMode 
                ? 'bg-amber-400/10 border-amber-400/40 text-amber-900 dark:text-amber-200'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
            }`}>
              <div className="flex items-center space-x-3">
                {isSandboxMode ? <TestTube className="w-5 h-5 text-amber-500 shrink-0" /> : <ShieldCheck className="w-5 h-5 text-slate-400 shrink-0" />}
                <div>
                  <strong>Sandbox Mode</strong>: {isSandboxMode ? `Active (All test emails are automatically rerouted to ${testEmailTarget}).` : `Inactive (Standard delivery routing engaged).`}
                </div>
              </div>
              <span className={`font-bold text-[10px] uppercase px-2.5 py-0.5 rounded ${
                isSandboxMode 
                  ? 'bg-amber-400 text-slate-950' 
                  : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                {isSandboxMode ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-optimist-blue hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-amber-300" />
                Save Site Variables
              </button>
            </div>
          </div>

        </form>

        {/* Contact Page Subject Options Manager */}
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
          <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
            <MessageSquare className="w-5 h-5 text-optimist-blue" />
            Contact Page "Subject" Dropdown Options
          </h2>
          <p className="text-xs text-slate-500 -mt-2">
            Changes here apply immediately for every visitor to the Contact page - there's no separate save step.
          </p>

          <div className="space-y-2">
            {[...contactSubjects].sort((a, b) => a.sort_order - b.sort_order).map((subject, idx) => (
              <div key={subject.id} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="flex-1 text-xs font-semibold text-slate-800 dark:text-slate-200">{subject.label}</span>
                <button
                  type="button"
                  onClick={() => reorderContactSubject(subject.id, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => reorderContactSubject(subject.id, 'down')}
                  disabled={idx === contactSubjects.length - 1}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeContactSubject(subject.id)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-950/40"
                  title="Remove"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {contactSubjects.length === 0 && (
              <p className="text-xs text-slate-400 italic">No custom options yet - the Contact page is using its built-in defaults.</p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={newSubjectText}
              onChange={e => setNewSubjectText(e.target.value)}
              placeholder="e.g. Sponsorship Inquiry"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
            />
            <button
              type="button"
              onClick={() => { addContactSubject(newSubjectText); setNewSubjectText(''); }}
              className="px-4 py-2.5 rounded-xl bg-optimist-blue hover:bg-blue-800 text-white font-bold text-xs shadow transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </div>

        </div>
      )}

      {/* TAB 2: MEMBER ACCESS LEVELS & PERMISSIONS MATRIX */}
      {activeTab === 'permissions' && (
        <div className="space-y-6">
          
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-optimist-blue" />
                  Member Records & Access Control
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Grant or restrict specific access rights for all 21 active club members (e.g. Treasurer Console access, initiative editing, project posting).
                </p>
              </div>

              {/* Search Member */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={memberSearch}
                  onChange={e => setMemberSearch(e.target.value)}
                  placeholder="Search member name or ID..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
                />
              </div>
            </div>
          </div>

          {/* Permissions Table */}
          <div className="rounded-3xl overflow-hidden glass-card border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4 text-left">Member Name & ID</th>
                    <th className="p-4 text-left">Role(s)</th>
                    <th className="p-4 text-left">Dues Console</th>
                    <th className="p-4 text-left">Publish Projects & Photos</th>
                    <th className="p-4 text-left">Access</th>
                    <th className="p-4 text-left">Roster Profile Editor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredRoster.map((m) => {
                    const isSuperAdminUser = m.access === 'super admin' || m.email === 'edwin@jillandee.com' || m.email === 'richelle.lucas16@gmail.com';
                    const isTreasurerUser = m.email === 'sharon@topaz-bb.com' || m.id === '78008-0152';
                    const isPresidentUser = m.email === 'richelle.lucas16@gmail.com' || m.id === '78008-0150' || isSuperAdminUser;
                    const hasTreasurerAccess = isSuperAdminUser || isTreasurerUser || isPresidentUser || Boolean(m.hasTreasurerConsoleAccess);
                    const hasInitiativeAccess = isSuperAdminUser || isTreasurerUser || isPresidentUser || Boolean(m.hasInitiativeAccess);
                    const canPublishProjects = true; // All active members can post projects

                    return (
                      <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4">
                          <strong className="block text-slate-900 dark:text-white text-sm">{m.name}</strong>
                          <span className="text-slate-400 font-mono text-[10px]">{m.id} • {m.email}</span>
                        </td>

                        <td className="p-4 text-left">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase text-left block w-fit leading-relaxed ${
                            isPresidentUser || isTreasurerUser || isSuperAdminUser
                              ? 'gold-gradient text-slate-950'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            {m.role}
                          </span>
                        </td>

                        {/* Treasurer Console Access Toggle */}
                        <td className="p-4 text-left">
                          <button
                            onClick={() => !isSuperAdminUser && handleTogglePermission(m.id, 'hasTreasurerConsoleAccess', hasTreasurerAccess)}
                            disabled={isSuperAdminUser || !['super admin', 'finance'].includes(userAccess)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                              hasTreasurerAccess
                                ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-300'
                            } ${isSuperAdminUser || !['super admin', 'finance'].includes(userAccess) ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            {hasTreasurerAccess ? <Check className="w-3 h-3 text-emerald-500" /> : <X className="w-3 h-3 text-slate-400" />}
                            {hasTreasurerAccess ? 'Authorized' : 'Restricted'}
                          </button>
                        </td>

                        {/* Publish Projects & Photos */}
                        <td className="p-4 text-left">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 inline-flex items-center gap-1">
                            <Check className="w-3 h-3 text-blue-500" />
                            Member Access
                          </span>
                        </td>

                        {/* Access Select */}
                        <td className="p-4 text-left">
                          {m.access === 'pending' ? (
                            <button
                              onClick={() => {
                                if (['super admin', 'finance'].includes(userAccess)) {
                                  updateMemberPermissions(m.id, 'access', 'member');
                                  updateMemberPermissions(m.id, 'role', 'Active Member');
                                  setStatusMsg(`Approved ${m.name} as active club member!`);
                                  setTimeout(() => setStatusMsg(''), 4000);
                                }
                              }}
                              disabled={!['super admin', 'finance'].includes(userAccess)}
                              className={`px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase shadow transition-all ${
                                ['super admin', 'finance'].includes(userAccess)
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                                  : 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500'
                              }`}
                              title={['super admin', 'finance'].includes(userAccess) ? "Click to approve applicant and set to Active Member" : "Only Super Admin and Finance can approve membership applications."}
                            >
                              Approve Applicant
                            </button>
                          ) : (
                            <select
                               value={m.access || 'member'}
                               onChange={e => updateMemberPermissions(m.id, 'access', e.target.value)}
                               disabled={m.access === 'super admin' ? userAccess !== 'super admin' : !['super admin', 'finance'].includes(userAccess)}
                               className={`px-2.5 py-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-[11px] outline-none font-semibold text-slate-800 dark:text-slate-200 ${
                                 (m.access === 'super admin' ? userAccess !== 'super admin' : !['super admin', 'finance'].includes(userAccess)) ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                               }`}
                             >
                               {(userAccess === 'super admin' || m.access === 'super admin') && (
                                 <option value="super admin">super admin</option>
                               )}
                               <option value="finance">finance</option>
                               <option value="admin">admin</option>
                               <option value="moderator">moderator</option>
                               <option value="member">member</option>
                             </select>
                          )}
                        </td>

                        {/* Roster Profile Editor Action Button */}
                        <td className="p-4 text-left">
                          <button
                            onClick={() => handleStartEdit(m)}
                            className="px-3.5 py-1.5 rounded-xl gold-gradient hover:brightness-110 text-slate-950 font-bold text-xs inline-flex items-center gap-1 shadow transition-all"
                            title="Edit Member Profile & Dues Ledger details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Record</span>
                          </button>
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

      {/* TAB: TREASURER DUES MANAGEMENT CONSOLE */}
      {activeTab === 'treasurer' && canManageSettings && (
        <div className="space-y-6">
          
          {/* Header Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1.5 w-fit">
                  <ShieldCheck className="w-3.5 h-3.5" /> Club Treasurer Administrative Console
                </span>
                <h2 className="font-heading text-2xl font-semibold text-white">
                  Member Dues Management Ledger
                </h2>
                <p className="text-xs text-slate-300">
                  Optimist Fiscal Year runs <strong>October 1st to September 30th</strong>. As Club Treasurer (<strong>Sharon Mohammed</strong>) and Club Executives, you can record payments, view official statements, add notes, and email dues balance statements.
                </p>
              </div>

              <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 text-right shrink-0">
                <span className="text-xs text-slate-400 block">Total Active Settled Dues</span>
                <strong className="font-heading text-2xl font-semibold text-emerald-400">
                  {memberRoster.filter(m => m.duesStatus && m.duesStatus.includes('Active')).length} / {memberRoster.length}
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

          {/* Scotiabank Bank Transfer Info Box */}
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
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                (Total Members: {filteredRoster.length})
              </span>
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

          {/* Member Ledger Table */}
          <div className="rounded-3xl overflow-hidden glass-card border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4 w-12 text-center text-slate-400">#</th>
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
                  {filteredRoster.map((member, index) => {
                    const isSelected = selectedMemberIds.includes(member.id);
                    const isEditingNotes = editingNotesId === member.id;

                    return (
                      <tr key={member.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isSelected ? 'bg-amber-400/10' : ''}`}>
                        <td className="p-4 text-center font-mono text-slate-400 font-bold text-xs border-r border-slate-200 dark:border-slate-800">
                          {index + 1}
                        </td>
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
                          <span className="text-amber-600 dark:text-amber-400 font-bold">$250.00 Rate</span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 block">Paid: {member.amountPaid ? member.amountPaid.replace(' BBD', '') : ''}</span>
                          <span className={`text-[11px] font-bold ${(!member.balanceDue || member.balanceDue.replace(' BBD', '') === '$0.00') ? 'text-slate-400' : 'text-rose-600 dark:text-rose-400'}`}>
                            Due: {member.balanceDue ? member.balanceDue.replace(' BBD', '') : ''}
                          </span>
                        </td>
                        <td className="p-4 space-y-1">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                            member.duesStatus && member.duesStatus.includes('Active')
                              ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                              : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                          }`}>
                            {member.duesStatus && member.duesStatus.includes('Active') ? <Check className="w-3 h-3 text-emerald-500" /> : <AlertCircle className="w-3 h-3 text-amber-500" />}
                            {member.duesStatus || 'Active Member'}
                          </span>
                          <span className="text-[10px] text-slate-500 block">Method: {member.paymentMethod || 'Bank Transfer'}</span>
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

                        {/* Action Buttons */}
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
                  <h2 className="font-heading font-semibold text-lg text-slate-900 dark:text-white">
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
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Member Account Info</span>
                <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white">{statementModalMember.name}</h3>
                <p className="text-slate-600 dark:text-slate-300">Member ID: <strong>{statementModalMember.id}</strong></p>
                <p className="text-slate-600 dark:text-slate-300">Designation: <strong>{statementModalMember.role}</strong></p>
                <p className="text-slate-600 dark:text-slate-300">Email: <strong>{statementModalMember.email}</strong></p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 space-y-1">
                <span className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-300 block">Dues Status & Balance</span>
                <p className="text-slate-800 dark:text-slate-200">Fiscal Year: <strong>2025/2026 (Oct 1 - Sep 30)</strong></p>
                <p className="text-slate-800 dark:text-slate-200">Annual Dues Rate: <strong>$250.00</strong></p>
                <p className="text-slate-800 dark:text-slate-200">Amount Paid: <strong className="text-emerald-600 dark:text-emerald-400">{statementModalMember.amountPaid ? statementModalMember.amountPaid.replace(' BBD', '') : ''}</strong></p>
                <p className="text-slate-800 dark:text-slate-200">Current Balance Due: <strong className={(!statementModalMember.balanceDue || statementModalMember.balanceDue.replace(' BBD', '') === '$0.00') ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>{statementModalMember.balanceDue ? statementModalMember.balanceDue.replace(' BBD', '') : ''}</strong></p>
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
                  <Send className="w-4 h-4 text-amber-300" /> Email Statement
                </button>
              </div>

              <button
                onClick={() => setStatementModalMember(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition-colors"
              >
                Close Statement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROJECT MODERATION QUEUE */}
      {activeTab === 'moderation' && canModerateProjects && (
        <div className="space-y-6">
          
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
            <div>
              <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
                Project Activity Moderation Queue
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review and approve member-submitted project updates before they are featured and listed publicly on the homepage and projects page.
              </p>
            </div>
          </div>

          {/* Pending Projects List */}
          {projects.filter(p => p.approved === false).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.filter(p => p.approved === false).map((p) => (
                <div key={p.id} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-lg flex flex-col justify-between">
                  <div>
                    {/* Header Image */}
                    <div className="h-40 bg-slate-100 dark:bg-slate-800 relative">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 bg-optimist-blue text-white text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow">
                        {p.category}
                      </span>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                        <span>Submitted By: <strong>{p.author}</strong></span>
                        <span>•</span>
                        <span>Date: <strong>{p.postedAt || p.date}</strong></span>
                      </div>
                      <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white line-clamp-2">
                        {p.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-450 line-clamp-3">
                        {p.excerpt}
                      </p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-400/40 inline-block">
                        Children Impacted: {Number(p.childrenServed) || 0}
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex gap-2 justify-end">
                    <button
                      onClick={() => {
                        deleteProject(p.id);
                        setStatusMsg(`Rejected and deleted pending project post: "${p.title}"`);
                        setTimeout(() => setStatusMsg(''), 4000);
                      }}
                      className="px-3.5 py-1.5 rounded-xl border border-rose-300 hover:bg-rose-50 text-rose-650 font-bold text-xs transition-all"
                    >
                      Reject & Delete
                    </button>
                    <button
                      onClick={() => {
                        approveProject(p.id);
                        setStatusMsg(`Approved and published project post: "${p.title}"`);
                        setTimeout(() => setStatusMsg(''), 4000);
                      }}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow"
                    >
                      Approve & Publish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 space-y-3 shadow-md">
              <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">Moderation Queue is Clean</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                There are currently no pending member-submitted project activity posts waiting for approval.
              </p>
            </div>
          )}

        </div>
      )}

      {selectedMemberToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-900 text-white rounded-t-3xl">
              <div className="flex items-center space-x-2.5">
                <Users className="w-5 h-5 text-amber-300" />
                <div>
                  <h2 className="font-heading text-lg font-bold text-white">
                    Edit Member Roster Details
                  </h2>
                  <span className="text-[10px] font-mono text-slate-400">
                    ID: {selectedMemberToEdit.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedMemberToEdit(null)}
                className="p-1.5 rounded-xl hover:bg-slate-850 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMemberRecord} className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                    required
                  />
                </div>

                {/* 2. Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                    required
                  />
                </div>

                {/* 3. Phone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="+1 (246) ..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                  />
                </div>

                {/* 4. Role */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Roster Role
                  </label>
                  <input
                    type="text"
                    value={editForm.role}
                    onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                    placeholder="e.g. Active Member"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                  />
                </div>

                {/* 4b. Access */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Access Permission Level
                  </label>
                  <select
                    value={editForm.access}
                    onChange={e => setEditForm({ ...editForm, access: e.target.value })}
                    disabled={selectedMemberToEdit?.access === 'super admin' ? userAccess !== 'super admin' : !['super admin', 'finance'].includes(userAccess)}
                    className={`w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none font-semibold ${
                      (selectedMemberToEdit?.access === 'super admin' ? userAccess !== 'super admin' : !['super admin', 'finance'].includes(userAccess)) ? 'opacity-65 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    {(userAccess === 'super admin' || selectedMemberToEdit?.access === 'super admin') && (
                      <option value="super admin">super admin</option>
                    )}
                    <option value="finance">finance</option>
                    <option value="admin">admin</option>
                    <option value="moderator">moderator</option>
                    <option value="member">member</option>
                    <option value="pending">pending</option>
                  </select>
                </div>

                {/* 5. Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Postal Address
                  </label>
                  <textarea
                    rows={2}
                    value={editForm.address}
                    onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                    placeholder="Physical address in Barbados..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                  />
                </div>
              </div>

              {/* Dues Ledger Fields Divider */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-4">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 w-fit">
                  <DollarSign className="w-3.5 h-3.5" /> Dues Ledger & Payment Details
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* 6. Yearly Dues Amount */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Yearly Dues Rate *
                    </label>
                    <input
                      type="text"
                      value={editForm.duesRate}
                      onChange={e => setEditForm({ ...editForm, duesRate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                      required
                    />
                  </div>

                  {/* 7. Amount Paid */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Amount Paid *
                    </label>
                    <input
                      type="text"
                      value={editForm.amountPaid}
                      onChange={e => setEditForm({ ...editForm, amountPaid: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                      required
                    />
                  </div>

                  {/* 8. Balance Due */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Balance Due *
                    </label>
                    <input
                      type="text"
                      value={editForm.balanceDue}
                      onChange={e => setEditForm({ ...editForm, balanceDue: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                      required
                    />
                  </div>

                  {/* 9. Payment Method */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Payment Method
                    </label>
                    <select
                      value={['Bank Transfer', 'Credit Card', 'Cheque', 'Cash', 'In-kind', 'Pending'].includes(editForm.paymentMethod) ? editForm.paymentMethod : 'Other'}
                      onChange={e => {
                        const val = e.target.value;
                        if (val === 'Other') {
                          setEditForm({ ...editForm, paymentMethod: 'Other' });
                        } else {
                          setEditForm({ ...editForm, paymentMethod: val });
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                    >
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Cash">Cash</option>
                      <option value="In-kind">In-kind</option>
                      <option value="Pending">Pending</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Show text input if "Other" is chosen */}
                  {!['Bank Transfer', 'Credit Card', 'Cheque', 'Cash', 'In-kind', 'Pending'].includes(editForm.paymentMethod) && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          Specify Other Method *
                        </label>
                        <span className="text-[9px] text-slate-400 font-mono">Max 15 chars</span>
                      </div>
                      <input
                        type="text"
                        maxLength={15}
                        value={editForm.paymentMethod === 'Other' ? '' : editForm.paymentMethod}
                        onChange={e => setEditForm({ ...editForm, paymentMethod: e.target.value })}
                        placeholder="e.g. Card, Draft"
                        className="w-full px-3 py-2 rounded-xl border border-amber-400 dark:border-amber-400 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                        required
                      />
                    </div>
                  )}

                  {/* 10. Dues Status */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Dues Status
                    </label>
                    <select
                      value={editForm.duesStatus}
                      onChange={e => setEditForm({ ...editForm, duesStatus: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                    >
                      <option value="Active Member (2025/2026)">Active Member (2025/2026)</option>
                      <option value="Active Member in Good Standing">Active Member in Good Standing</option>
                      <option value="Pending Dues Payment">Pending Dues Payment</option>
                      <option value="Exempt / Honorary">Exempt / Honorary</option>
                    </select>
                  </div>

                  {/* 11. Last Payment Date */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Payment Date
                    </label>
                    <input
                      type="date"
                      value={editForm.lastPaymentDate}
                      onChange={e => setEditForm({ ...editForm, lastPaymentDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedMemberToEdit(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-750 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl gold-gradient hover:brightness-110 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4 text-slate-950" />
                  <span>Save Record Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
