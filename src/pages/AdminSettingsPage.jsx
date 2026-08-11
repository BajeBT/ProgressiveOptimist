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
  ShieldAlert
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
    isSandboxMode,
    testEmailTarget,
    projects,
    approveProject,
    deleteProject
  } = useAuth();

  const userAccess = currentUser?.access || 'member';
  const [activeTab, setActiveTab] = useState(userAccess === 'moderator' ? 'moderation' : 'variables'); // 'variables' | 'permissions' | 'moderation'
  
  // Site Variables Form State
  const [meetingSchedule, setMeetingSchedule] = useState(siteSettings?.meetingSchedule || "1st Monday of every month at 5:30 PM");
  const [meetingVenue, setMeetingVenue] = useState(siteSettings?.meetingVenue || "Ross University, Lloyd Erskine Sandiford Centre (LESC), Two Mile Hill, St. Michael, Barbados");
  const [supportEmail, setSupportEmail] = useState(siteSettings?.supportEmail || "info@progressiveoptimist.org");
  const [contactPhone, setContactPhone] = useState(siteSettings?.contactPhone || "+1 (246) 836-6185");
  const [annualDuesRate, setAnnualDuesRate] = useState(siteSettings?.annualDuesRate || "$250.00");
  
  // Primary Initiatives State
  const [initiativesList, setInitiativesList] = useState(primaryInitiatives || [
    "RISE Summer Experience & Challenge",
    "Easter Cheer Kite Giveaway (Westbury & Ignatius Byer Primary)",
    "Laptop & Tablet Fundraiser for Students",
    "Mini Millionaires in the Making Mentorship"
  ]);
  const [newInitiativeText, setNewInitiativeText] = useState('');

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
          <h1 className="font-heading text-3xl font-black">Restricted Administrator Area</h1>
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
      annualDuesRate
    });
    updatePrimaryInitiatives(initiativesList);
    setStatusMsg("Site variables and primary initiatives updated successfully!");
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
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1.5 w-fit">
              <ShieldCheck className="w-3.5 h-3.5" /> Club Executive Administrator Portal
            </span>
            <h1 className="font-heading text-3xl sm:text-4xl font-black">
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
              <span>Member Access & Permissions Matrix ({memberRoster.length})</span>
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
            <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/40 text-xs flex items-center justify-between text-amber-900 dark:text-amber-200">
              <div className="flex items-center space-x-3">
                <TestTube className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <strong>Sandbox Mode Active</strong>: All test emails are automatically rerouted to <u>{testEmailTarget}</u>.
                </div>
              </div>
              <span className="font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded bg-amber-400 text-slate-950">Active</span>
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
      )}

      {/* TAB 2: MEMBER ACCESS LEVELS & PERMISSIONS MATRIX */}
      {activeTab === 'permissions' && (
        <div className="space-y-6">
          
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-optimist-blue" />
                  Member Permissions & Access Control Matrix
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
                    const isTreasurerUser = m.email === 'sharon@topaz-bb.com' || m.id === '78008-0152';
                    const isPresidentUser = m.email === 'richelle.lucas16@gmail.com' || m.id === '78008-0150';
                    const hasTreasurerAccess = isTreasurerUser || isPresidentUser || Boolean(m.hasTreasurerConsoleAccess);
                    const hasInitiativeAccess = isTreasurerUser || isPresidentUser || Boolean(m.hasInitiativeAccess);
                    const canPublishProjects = true; // All active members can post projects

                    return (
                      <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4">
                          <strong className="block text-slate-900 dark:text-white text-sm">{m.name}</strong>
                          <span className="text-slate-400 font-mono text-[10px]">{m.id} • {m.email}</span>
                        </td>

                        <td className="p-4 text-left">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase text-left block w-fit leading-relaxed ${
                            isPresidentUser || isTreasurerUser
                              ? 'gold-gradient text-slate-950'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            {m.role}
                          </span>
                        </td>

                        {/* Treasurer Console Access Toggle */}
                        <td className="p-4 text-left">
                          <button
                            onClick={() => handleTogglePermission(m.id, 'hasTreasurerConsoleAccess', hasTreasurerAccess)}
                            className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase inline-flex items-center gap-1 ${
                              hasTreasurerAccess
                                ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-300'
                            }`}
                          >
                            {hasTreasurerAccess ? <Check className="w-3 h-3 text-emerald-500" /> : <X className="w-3 h-3 text-slate-400" />}
                            {hasTreasurerAccess ? 'Authorized' : 'Restricted'}
                          </button>
                        </td>

                        {/* Publish Projects & Photos */}
                        <td className="p-4 text-left">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 inline-flex items-center gap-1">
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
                              className={`px-3 py-1.5 rounded-xl font-extrabold text-[10px] uppercase shadow transition-all ${
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
                              disabled={!['super admin', 'finance'].includes(userAccess)}
                              className={`px-2.5 py-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-[11px] outline-none font-semibold text-slate-800 dark:text-slate-200 ${
                                !['super admin', 'finance'].includes(userAccess) ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                              }`}
                            >
                              <option value="super admin">super admin</option>
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
                      {p.childrenServed > 0 && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-400/40 inline-block">
                          Children Served: {p.childrenServed}
                        </span>
                      )}
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
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow"
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
                    disabled={!['super admin', 'finance'].includes(userAccess)}
                    className={`w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none font-semibold ${
                      !['super admin', 'finance'].includes(userAccess) ? 'opacity-65 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <option value="super admin">super admin</option>
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
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 w-fit">
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
                      value={['Bank Transfer', 'Online Bank Transfer', 'Cheque', 'Cash', 'In-kind', 'Pending'].includes(editForm.paymentMethod) ? editForm.paymentMethod : 'Other'}
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
                      <option value="Online Bank Transfer">Online Bank Transfer</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Cash">Cash</option>
                      <option value="In-kind">In-kind</option>
                      <option value="Pending">Pending</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Show text input if "Other" is chosen */}
                  {!['Bank Transfer', 'Online Bank Transfer', 'Cheque', 'Cash', 'In-kind', 'Pending'].includes(editForm.paymentMethod) && (
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
                  className="px-5 py-2 rounded-xl gold-gradient hover:brightness-110 text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
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
