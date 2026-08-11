import React, { useState } from 'react';
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
  X
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
    isSandboxMode,
    testEmailTarget
  } = useAuth();

  const [activeTab, setActiveTab] = useState('variables'); // 'variables' | 'permissions'
  
  // Site Variables Form State
  const [meetingSchedule, setMeetingSchedule] = useState(siteSettings?.meetingSchedule || "1st Monday of every month at 5:30 PM");
  const [meetingVenue, setMeetingVenue] = useState(siteSettings?.meetingVenue || "Ross University, Lloyd Erskine Sandiford Centre (LESC), Two Mile Hill, St. Michael, Barbados");
  const [supportEmail, setSupportEmail] = useState(siteSettings?.supportEmail || "info@progressiveoptimist.org");
  const [contactPhone, setContactPhone] = useState(siteSettings?.contactPhone || "+1 (246) 836-6185");
  const [annualDuesRate, setAnnualDuesRate] = useState(siteSettings?.annualDuesRate || "$250.00 BBD");
  
  // Primary Initiatives State
  const [initiativesList, setInitiativesList] = useState(primaryInitiatives || [
    "RISE Summer Experience & Challenge",
    "Easter Cheer Kite Giveaway (Westbury & Ignatius Byer Primary)",
    "Laptop & Tablet Fundraiser for Students",
    "Mini Millionaires in the Making Mentorship"
  ]);
  const [newInitiativeText, setNewInitiativeText] = useState('');

  // Member Search State
  const [memberSearch, setMemberSearch] = useState('');

  // Feedback Message
  const [statusMsg, setStatusMsg] = useState('');

  // Access check
  const isAuthorized = currentUser && (
    Boolean(currentUser.isTreasurer) ||
    currentUser.role?.includes('President') ||
    currentUser.role?.includes('Treasurer') ||
    currentUser.role?.includes('Admin') ||
    currentUser.role?.includes('Director') ||
    currentUser.email?.toLowerCase().includes('sharon') ||
    currentUser.email?.toLowerCase().includes('treasurer') ||
    currentUser.email?.toLowerCase().includes('president') ||
    currentUser.email === 'richelle.lucas16@gmail.com' ||
    currentUser.email === 'sharon@topaz-bb.com'
  );

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
          <span>Member Access Levels & Permissions Matrix ({memberRoster.length})</span>
        </button>
      </div>

      {/* TAB 1: SITE VARIABLES & PRIMARY INITIATIVES */}
      {activeTab === 'variables' && (
        <form onSubmit={handleSaveVariables} className="space-y-8">
          
          {/* Section 1: Primary Initiatives Editor */}
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Primary Initiatives Management
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add, edit, or remove the primary club initiatives displayed on the Barbados Clubs Directory and homepage.
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-50 text-optimist-blue dark:bg-blue-950 dark:text-blue-300">
                {initiativesList.length} Active Initiatives
              </span>
            </div>

            {/* List of Initiatives */}
            <div className="space-y-3">
              {initiativesList.map((init, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-optimist-blue text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">{init}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveInitiative(idx)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Remove Initiative"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Initiative Form */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newInitiativeText}
                onChange={e => setNewInitiativeText(e.target.value)}
                placeholder="Enter new Primary Initiative title (e.g., Annual Youth Science Fair)..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
              />
              <button
                type="button"
                onClick={handleAddInitiative}
                className="px-4 py-2.5 rounded-xl gold-gradient text-slate-950 font-bold text-xs shadow hover:brightness-110 transition-all flex items-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" /> Add Initiative
              </button>
            </div>
          </div>

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
                Save Site Variables & Initiatives
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
                    <th className="p-4">Member Name & ID</th>
                    <th className="p-4">Current Role & Tier</th>
                    <th className="p-4 text-center">Treasurer Dues Console</th>
                    <th className="p-4 text-center">Manage Primary Initiatives</th>
                    <th className="p-4 text-center">Publish Projects & Photos</th>
                    <th className="p-4 text-right">Access Level Tier</th>
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

                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            isPresidentUser || isTreasurerUser
                              ? 'gold-gradient text-slate-950'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            {m.role}
                          </span>
                        </td>

                        {/* Treasurer Console Access Toggle */}
                        <td className="p-4 text-center">
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

                        {/* Primary Initiatives Access Toggle */}
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleTogglePermission(m.id, 'hasInitiativeAccess', hasInitiativeAccess)}
                            className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase inline-flex items-center gap-1 ${
                              hasInitiativeAccess
                                ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-300'
                            }`}
                          >
                            {hasInitiativeAccess ? <Check className="w-3 h-3 text-emerald-500" /> : <X className="w-3 h-3 text-slate-400" />}
                            {hasInitiativeAccess ? 'Authorized' : 'Restricted'}
                          </button>
                        </td>

                        {/* Publish Projects & Photos */}
                        <td className="p-4 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 inline-flex items-center gap-1">
                            <Check className="w-3 h-3 text-blue-500" />
                            Member Access
                          </span>
                        </td>

                        {/* Access Level Tier Select */}
                        <td className="p-4 text-right">
                          <select
                            value={m.accessTier || (isPresidentUser ? 'Super Admin' : isTreasurerUser ? 'Treasurer Admin' : m.role.includes('Director') ? 'Officer' : 'Standard Member')}
                            onChange={e => updateMemberPermissions(m.id, 'accessTier', e.target.value)}
                            className="px-2.5 py-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-[11px] outline-none"
                          >
                            <option value="Super Admin">Super Admin</option>
                            <option value="Treasurer Admin">Treasurer Admin</option>
                            <option value="Officer">Officer</option>
                            <option value="Standard Member">Standard Member</option>
                          </select>
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

    </div>
  );
};
