import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MEMBER_ROLES } from '../../lib/roles';
import { BarbadosClubModal } from '../components/BarbadosClubModal';
import {
  ShieldCheck,
  Settings,
  Users,
  Edit3,
  Trash2,
  Archive,
  RotateCcw,
  Plus,
  Save,
  CheckCircle2,
  AlertCircle,
  Lock,
  Search,
  Building2,
  Phone,
  DollarSign,
  TestTube,
  Check,
  X,
  ShieldAlert,
  FileSpreadsheet,
  Send,
  FileText,
  Printer,
  MessageSquare,
  ChevronUp,
  ChevronDown,
  UserX,
  UserCheck
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
    addMembers,
    approveMemberRecord,
    archiveMemberRecord,
    archivedApplicants,
    restoreArchivedRecord,
    deleteArchivedRecord,
    deleteMemberRecord,
    deactivateMemberRecord,
    reactivateMemberRecord,
    resetMemberPassword,
    updateMemberPayments,
    updateMemberNotesByTreasurer,
    sendDuesStatementEmail,
    loadNameChangeRequests,
    reviewNameChange,
    isSandboxMode,
    testEmailTarget,
    projects,
    approveProject,
    deleteProject,
    contactSubjects,
    addContactSubject,
    removeContactSubject,
    reorderContactSubject,
    barbadosClubs,
    deleteBarbadosClub
  } = useAuth();

  const userAccess = currentUser?.access || 'member';
  const [activeTab, setActiveTab] = useState(userAccess === 'moderator' ? 'moderation' : 'variables'); // 'variables' | 'permissions' | 'treasurer' | 'moderation' | 'clubs'

  // Barbados Clubs Directory Manager State
  const [clubModalOpen, setClubModalOpen] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  
  // Treasurer Console State
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [tempNotesText, setTempNotesText] = useState('');
  const [statementModalMember, setStatementModalMember] = useState(null);
  const [statementPayments, setStatementPayments] = useState([]);
  const [treasurerMsg, setTreasurerMsg] = useState('');
  const [copiedBankInfo, setCopiedBankInfo] = useState(false);
  const [rosterSearch, setRosterSearch] = useState('');

  // Up to 4 individually-dated payments per fiscal year, replacing the old
  // single Amount Paid / Payment Date / Payment Method fields in Edit Record.
  const emptyPaymentRow = { date: '', amount: '', method: 'Bank Transfer' };
  const [paymentRows, setPaymentRows] = useState([{ ...emptyPaymentRow }, { ...emptyPaymentRow }, { ...emptyPaymentRow }, { ...emptyPaymentRow }]);
  const [stripePaymentsForEdit, setStripePaymentsForEdit] = useState([]);
  const [isSavingPayments, setIsSavingPayments] = useState(false);

  const fetchMemberPayments = async (memberId) => {
    try {
      const token = localStorage.getItem('optimist_token') || '';
      const res = await fetch(`/api/dues?memberId=${encodeURIComponent(memberId)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      return (res.ok && data.success && Array.isArray(data.payments)) ? data.payments : [];
    } catch (err) {
      console.warn('Failed to load payment history:', err);
      return [];
    }
  };

  const updatePaymentRow = (index, field, value) => {
    setPaymentRows(prev => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const handleOpenStatement = async (member) => {
    setStatementModalMember(member);
    setStatementPayments([]);
    const payments = await fetchMemberPayments(member.id);
    const fiscalYear = member.fiscalYear || '2025/2026 (Oct 1 - Sep 30)';
    setStatementPayments(
      payments
        .filter(p => p.fiscal_year === fiscalYear)
        .sort((a, b) => new Date(a.paid_at) - new Date(b.paid_at))
    );
  };

  // Live-computed from the 4 rows as the Treasurer types, purely for display
  // before saving - the authoritative totals come back from the server.
  const paymentRowsTotal = paymentRows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const copyBankInfo = () => {
    const infoText = `Bank: ${siteSettings?.bankName}\nAccount Name: ${siteSettings?.bankAccountName}\nAccount #: ${siteSettings?.bankAccountNumber}\nBranch: ${siteSettings?.bankBranch}\nRouting/Transit: ${siteSettings?.bankRoutingNumber}`;
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
    if (selectedMemberIds.length === treasurerRoster.length) {
      setSelectedMemberIds([]);
    } else {
      setSelectedMemberIds(treasurerRoster.map(m => m.id));
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
  const [meetingSchedule, setMeetingSchedule] = useState(siteSettings?.meetingSchedule || "1st Monday of every month at 5:30 PM (6:00 PM for Guests)");
  const [meetingVenue, setMeetingVenue] = useState(siteSettings?.meetingVenue || "Ross University, Lloyd Erskine Sandiford Centre (LESC), Two Mile Hill, St. Michael, Barbados");
  const [contactEmail, setContactEmail] = useState(siteSettings?.contactEmail || "info@progressiveoptimist.org");
  const [annualDuesRate, setAnnualDuesRate] = useState(siteSettings?.annualDuesRate || "$200.00");
  const [themeTitle, setThemeTitle] = useState(siteSettings?.themeTitle || "C.A.R.E – Championing Authentic & Reinvigorating Engagement");
  const [homepageAnnouncement, setHomepageAnnouncement] = useState(siteSettings?.homepageAnnouncement || "");
  const [bankName, setBankName] = useState(siteSettings?.bankName || "Not yet configured");
  const [bankAccountName, setBankAccountName] = useState(siteSettings?.bankAccountName || "Not yet configured");
  const [bankAccountNumber, setBankAccountNumber] = useState(siteSettings?.bankAccountNumber || "Not yet configured");
  const [bankBranch, setBankBranch] = useState(siteSettings?.bankBranch || "Not yet configured");
  const [bankRoutingNumber, setBankRoutingNumber] = useState(siteSettings?.bankRoutingNumber || "Not yet configured");

  useEffect(() => {
    if (siteSettings) {
      if (siteSettings.meetingSchedule) setMeetingSchedule(siteSettings.meetingSchedule);
      if (siteSettings.meetingVenue) setMeetingVenue(siteSettings.meetingVenue);
      if (siteSettings.contactEmail) setContactEmail(siteSettings.contactEmail);
      if (siteSettings.annualDuesRate) setAnnualDuesRate(siteSettings.annualDuesRate);
      if (siteSettings.themeTitle) setThemeTitle(siteSettings.themeTitle);
      if (siteSettings.homepageAnnouncement !== undefined) setHomepageAnnouncement(siteSettings.homepageAnnouncement);
      if (siteSettings.bankName) setBankName(siteSettings.bankName);
      if (siteSettings.bankAccountName) setBankAccountName(siteSettings.bankAccountName);
      if (siteSettings.bankAccountNumber) setBankAccountNumber(siteSettings.bankAccountNumber);
      if (siteSettings.bankBranch) setBankBranch(siteSettings.bankBranch);
      if (siteSettings.bankRoutingNumber) setBankRoutingNumber(siteSettings.bankRoutingNumber);
    }
  }, [siteSettings]);
  
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
    duesStatus: ''
  });

  const handleStartEdit = async (m) => {
    setSelectedMemberToEdit(m);
    setEditForm({
      name: m.name || '',
      email: m.email || '',
      phone: m.phone || '',
      address: m.address || '',
      role: m.role || 'Active Member',
      access: m.access || 'member',
      duesRate: m.duesRate || siteSettings?.annualDuesRate || '$200.00',
      amountPaid: m.amountPaid || '$0.00',
      balanceDue: m.balanceDue || '$0.00',
      duesStatus: m.duesStatus || 'Active Member (Dues Paid)'
    });

    // Manual (Treasurer-entered) payments populate the 4 edit rows; real
    // Stripe payments are shown separately as read-only context.
    setPaymentRows([{ ...emptyPaymentRow }, { ...emptyPaymentRow }, { ...emptyPaymentRow }, { ...emptyPaymentRow }]);
    setStripePaymentsForEdit([]);
    const payments = await fetchMemberPayments(m.id);
    const fiscalYear = m.fiscalYear || '2025/2026 (Oct 1 - Sep 30)';
    const forThisYear = payments.filter(p => p.fiscal_year === fiscalYear);
    const manual = forThisYear.filter(p => !p.stripe_session_id);
    const stripe = forThisYear.filter(p => p.stripe_session_id);

    if (manual.length > 0) {
      setPaymentRows(prev => prev.map((row, i) => (
        manual[i] ? { date: String(manual[i].paid_at).split('T')[0], amount: String(manual[i].amount_bbd), method: manual[i].payment_method } : row
      )));
    }
    setStripePaymentsForEdit(stripe);
  };

  const handleSaveMemberRecord = async (e) => {
    e.preventDefault();
    if (!selectedMemberToEdit) return;
    setIsSavingPayments(true);

    updateMemberRecord(selectedMemberToEdit.id, editForm);
    const fiscalYear = selectedMemberToEdit.fiscalYear || '2025/2026 (Oct 1 - Sep 30)';
    await updateMemberPayments(selectedMemberToEdit.id, fiscalYear, editForm.duesRate, paymentRows);

    setIsSavingPayments(false);
    setSelectedMemberToEdit(null);
    setStatusMsg(`Successfully updated member record, dues, and payments for ${editForm.name}.`);
    setTimeout(() => setStatusMsg(''), 4000);
  };

  // Add Member (individual) modal state
  const emptyAddForm = {
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'Active Member',
    access: 'member',
    duesRate: siteSettings?.annualDuesRate || '$200.00',
    amountPaid: '$0.00',
    balanceDue: siteSettings?.annualDuesRate || '$200.00',
    paymentMethod: 'Pending',
    duesStatus: 'Unpaid (Dues Owed)'
  };
  const [showAddMember, setShowAddMember] = useState(false);
  const [addForm, setAddForm] = useState(emptyAddForm);

  // Bulk Add modal state - members are typed straight into the grid.
  const emptyBulkRow = { name: '', email: '', phone: '', role: 'Active Member' };
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [bulkRows, setBulkRows] = useState([{ ...emptyBulkRow }, { ...emptyBulkRow }, { ...emptyBulkRow }]);

  const [isSavingMembers, setIsSavingMembers] = useState(false);
  const [addMemberError, setAddMemberError] = useState('');

  // Both add paths report through the same summary so the outcome reads the
  // same whether one member or twenty were entered.
  const reportAddResult = (res) => {
    if (!res.success) {
      setAddMemberError(res.message || 'Could not save the member record(s).');
      return false;
    }
    const skipped = Array.isArray(res.skipped) ? res.skipped : [];
    const skippedNote = skipped.length > 0
      ? ` ${skipped.length} skipped (${skipped.map(s => `${s.email}: ${s.reason}`).join('; ')}).`
      : '';
    setStatusMsg(`${res.message}${skippedNote}`);
    setTimeout(() => setStatusMsg(''), 8000);
    return true;
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setAddMemberError('');
    setIsSavingMembers(true);
    const res = await addMembers(addForm);
    setIsSavingMembers(false);
    if (reportAddResult(res)) {
      setShowAddMember(false);
      setAddForm(emptyAddForm);
    }
  };

  const handleBulkAdd = async (e) => {
    e.preventDefault();
    setAddMemberError('');

    const filled = bulkRows.filter(r => r.name.trim() || r.email.trim());
    if (filled.length === 0) {
      setAddMemberError('Enter at least one member.');
      return;
    }
    const incomplete = filled.find(r => !r.name.trim() || !r.email.trim());
    if (incomplete) {
      setAddMemberError('Every row needs both a name and an email address.');
      return;
    }

    setIsSavingMembers(true);
    const res = await addMembers(filled);
    setIsSavingMembers(false);
    if (reportAddResult(res)) {
      setShowBulkAdd(false);
      setBulkRows([{ ...emptyBulkRow }, { ...emptyBulkRow }, { ...emptyBulkRow }]);
    }
  };

  const updateBulkRow = (index, field, value) => {
    setBulkRows(prev => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const handleApproveMember = async (memberId, memberName) => {
    const confirmed = window.confirm(`Are you sure you want to approve ${memberName} as a member of the Progressive Optimist Club?`);
    if (!confirmed) return;
    const res = await approveMemberRecord(memberId);
    if (res.success) {
      setStatusMsg(`${memberName} approved successfully.`);
    } else {
      setStatusMsg(res.message || `Could not approve ${memberName}.`);
    }
    setTimeout(() => setStatusMsg(''), 5000);
  };

  const handleArchiveMember = async (memberId, memberName) => {
    const confirmed = window.confirm(`Are you sure you want to archive applicant ${memberName}? This will move their details to the applicant archive database.`);
    if (!confirmed) return;
    const res = await archiveMemberRecord(memberId);
    if (res.success) {
      setStatusMsg(`${memberName} archived successfully.`);
    } else {
      setStatusMsg(res.message || `Could not archive ${memberName}.`);
    }
    setTimeout(() => setStatusMsg(''), 5000);
  };

  const handleDeleteMember = async (memberId, memberName) => {
    const confirmed = window.confirm(`Are you sure you want to PERMANENTLY delete applicant ${memberName}? This action cannot be undone.`);
    if (!confirmed) return;
    const res = await deleteMemberRecord(memberId);
    if (res.success) {
      setStatusMsg(`${memberName} deleted permanently.`);
    } else {
      setStatusMsg(res.message || `Could not delete ${memberName}.`);
    }
    setTimeout(() => setStatusMsg(''), 5000);
  };

  const handleDeactivateMember = async (memberId, memberName) => {
    const confirmed = window.confirm(`Move ${memberName} to Inactive Members? They'll be removed from the active roster and public directory, but their dues history is kept and they can be reactivated later.`);
    if (!confirmed) return;
    const res = await deactivateMemberRecord(memberId);
    if (res.success) {
      setStatusMsg(`${memberName} moved to Inactive Members.`);
    } else {
      setStatusMsg(res.message || `Could not deactivate ${memberName}.`);
    }
    setTimeout(() => setStatusMsg(''), 5000);
  };

  const handleReactivateMember = async (memberId, memberName) => {
    const confirmed = window.confirm(`Restore ${memberName} to the active member roster?`);
    if (!confirmed) return;
    const res = await reactivateMemberRecord(memberId);
    if (res.success) {
      setStatusMsg(`${memberName} restored to the active member roster.`);
    } else {
      setStatusMsg(res.message || `Could not reactivate ${memberName}.`);
    }
    setTimeout(() => setStatusMsg(''), 5000);
  };

  const handleRestoreArchivedMember = async (id, name) => {
    const confirmed = window.confirm(`Are you sure you want to review and restore applicant ${name} back to the Membership Intake queue awaiting approval?`);
    if (!confirmed) return;
    const res = await restoreArchivedRecord(id);
    if (res.success) {
      setStatusMsg(`${name} restored to Membership Intake awaiting approval.`);
      setActiveTab('permissions');
    } else {
      setStatusMsg(res.message || `Could not restore ${name}.`);
    }
    setTimeout(() => setStatusMsg(''), 5000);
  };

  const handleDeleteArchivedApplicant = async (id, name) => {
    const confirmed = window.confirm(`Are you sure you want to PERMANENTLY delete archived applicant ${name}? This action cannot be undone.`);
    if (!confirmed) return;
    const res = await deleteArchivedRecord(id);
    if (res.success) {
      setStatusMsg(`${name} permanently deleted from archive.`);
    } else {
      setStatusMsg(res.message || `Could not delete ${name}.`);
    }
    setTimeout(() => setStatusMsg(''), 5000);
  };

  // Only the President, Treasurer, Secretary, or the super admin account may
  // clear a record added by someone else.
  const currentMemberRecord = memberRoster.find(m => m.id === currentUser?.memberId);
  const canApproveMembers = Boolean(
    currentMemberRecord?.hasInitiativeAccess ||
    currentMemberRecord?.hasTreasurerConsoleAccess ||
    currentMemberRecord?.hasSecretaryAccess ||
    currentUser?.email === 'admin@progressiveoptimist.org'
  );
  // Name change requests: members can ask for their roster name to be changed,
  // and an officer other than the requester signs it off.
  const [nameChangeRequests, setNameChangeRequests] = useState([]);
  const [nameChangeMsg, setNameChangeMsg] = useState('');
  const [reviewingRequestId, setReviewingRequestId] = useState(null);

  const refreshNameChanges = async () => {
    setNameChangeRequests(await loadNameChangeRequests());
  };

  useEffect(() => {
    if (activeTab === 'names' && canApproveMembers) refreshNameChanges();
  }, [activeTab, canApproveMembers]);

  const handleReviewNameChange = async (requestId, decision) => {
    setReviewingRequestId(requestId);
    const res = await reviewNameChange(requestId, decision);
    setReviewingRequestId(null);
    setNameChangeMsg(res.message || '');
    await refreshNameChanges();
    setTimeout(() => setNameChangeMsg(''), 5000);
  };

  // Reset Password: super admin only. Choosing a method opens resetPasswordTarget;
  // the result is shown once via resetPasswordResult so it can be copied and
  // handed to the member - never persisted or logged anywhere client-side.
  const [resetPasswordTarget, setResetPasswordTarget] = useState(null);
  const [resetPasswordMode, setResetPasswordMode] = useState('random');
  const [customPassword, setCustomPassword] = useState('');
  const [customPasswordConfirm, setCustomPasswordConfirm] = useState('');
  const [resetPasswordError, setResetPasswordError] = useState('');
  const [resetPasswordResult, setResetPasswordResult] = useState(null);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [copiedResetPassword, setCopiedResetPassword] = useState(false);

  const openResetPassword = (member) => {
    setResetPasswordTarget(member);
    setResetPasswordMode('random');
    setCustomPassword('');
    setCustomPasswordConfirm('');
    setResetPasswordError('');
  };

  const handleConfirmResetPassword = async (e) => {
    e.preventDefault();
    setResetPasswordError('');

    let passwordToSet;
    if (resetPasswordMode === 'custom') {
      if (customPassword.length < 8) {
        setResetPasswordError('Password must be at least 8 characters long.');
        return;
      }
      if (customPassword !== customPasswordConfirm) {
        setResetPasswordError('Passwords do not match.');
        return;
      }
      passwordToSet = customPassword;
    }

    setIsResettingPassword(true);
    const res = await resetMemberPassword(resetPasswordTarget.id, passwordToSet);
    setIsResettingPassword(false);

    if (res.success) {
      setResetPasswordResult({ name: resetPasswordTarget.name, email: resetPasswordTarget.email, password: res.password });
      setResetPasswordTarget(null);
    } else {
      setResetPasswordError(res.message || `Could not reset the password for ${resetPasswordTarget.name}.`);
    }
  };

  // The intake pipeline. Most records arrive from the public ProgressiveOCB
  // Membership Application (added_by is null); admin-entered ones are the
  // secondary route. Applicants still verifying their email are shown too, so
  // the queue reflects the whole pipeline rather than only its last step.
  const pendingApprovalMembers = memberRoster
    .filter(m => m.approvalStatus === 'pending_approval' || m.access === 'pending_verification')
    .map(m => ({
      ...m,
      fromApplication: !m.addedBy,
      awaitingVerification: m.access === 'pending_verification'
    }));

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
      contactEmail,
      annualDuesRate,
      themeTitle,
      homepageAnnouncement,
      bankName,
      bankAccountName,
      bankAccountNumber,
      bankBranch,
      bankRoutingNumber
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

  // Official @progressiveoptimist.org accounts (admin@, treasurer@, etc.) are
  // login/admin utility accounts for whoever holds that office, not separate
  // members - each real office-holder already has their own personal-email
  // record. They stay visible everywhere on the admin page (admins need to
  // manage them), but are excluded from member counts and sorted to the
  // bottom of every roster listing so they don't read as duplicate people.
  const isOfficialAccount = m => Boolean(m.email && m.email.toLowerCase().endsWith('@progressiveoptimist.org'));
  const realMemberCount = memberRoster.filter(m => !isOfficialAccount(m) && m.memberStatus !== 'inactive').length;

  // Filter roster for permissions table. Deactivated members live in their
  // own Inactive Members tab, not the active record listings.
  const filteredRoster = memberRoster
    .filter(m => m.memberStatus !== 'inactive')
    .filter(m =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.id.toLowerCase().includes(memberSearch.toLowerCase())
    )
    .sort((a, b) => Number(isOfficialAccount(a)) - Number(isOfficialAccount(b)));

  // The Treasurer Dues console is about tracking real dues payments, which
  // official utility accounts don't have (they're seeded Exempt/Honorary) -
  // unlike the Permissions tab, they're excluded here entirely rather than
  // just sorted to the bottom.
  const treasurerRoster = filteredRoster.filter(m => !isOfficialAccount(m));

  const inactiveMembers = memberRoster
    .filter(m => m.memberStatus === 'inactive')
    .filter(m =>
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
              <span>Member Records ({realMemberCount})</span>
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

            <button
              onClick={() => setActiveTab('clubs')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'clubs'
                  ? 'bg-optimist-blue text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Barbados Clubs ({barbadosClubs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('archived')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'archived'
                  ? 'bg-optimist-blue text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Archive className="w-4 h-4 text-amber-500" />
              <span>Archived Applicants ({archivedApplicants.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('inactive')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'inactive'
                  ? 'bg-optimist-blue text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <UserX className="w-4 h-4 text-rose-500" />
              <span>Inactive Members ({memberRoster.filter(m => m.memberStatus === 'inactive').length})</span>
            </button>

            {canApproveMembers && (
              <button
                onClick={() => setActiveTab('names')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'names'
                    ? 'bg-optimist-blue text-white shadow'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <UserCheck className="w-4 h-4 text-emerald-500" />
                <span>Name Changes ({nameChangeRequests.filter(r => r.status === 'pending').length})</span>
              </button>
            )}
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

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  Official Contact Email *
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  Homepage Active Announcement / Featured Message (Optional)
                </label>
                <textarea
                  rows={2}
                  value={homepageAnnouncement}
                  onChange={e => setHomepageAnnouncement(e.target.value)}
                  placeholder="e.g. Laptop Drive 2026 is currently active! Help us equip Bajan children with laptops. (Leave blank to hide message banner)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Displays a prominent highlight banner on the homepage hero impact section. Leave blank to hide the banner.
                </p>
              </div>

              <div className="md:col-span-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mt-4 mb-1">
                  Official Bank Deposit Account
                </h3>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  Bank Name *
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  Account Name *
                </label>
                <input
                  type="text"
                  value={bankAccountName}
                  onChange={e => setBankAccountName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  Account # *
                </label>
                <input
                  type="text"
                  value={bankAccountNumber}
                  onChange={e => setBankAccountNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  Branch *
                </label>
                <input
                  type="text"
                  value={bankBranch}
                  onChange={e => setBankBranch(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                  Transit/Routing # *
                </label>
                <input
                  type="text"
                  value={bankRoutingNumber}
                  onChange={e => setBankRoutingNumber(e.target.value)}
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
                    const isSuperAdminUser = m.access === 'super admin';
                    const isTreasurerUser = m.access === 'finance' || Boolean(m.hasTreasurerConsoleAccess);
                    const isPresidentUser = isSuperAdminUser || Boolean(m.hasInitiativeAccess);
                    const hasTreasurerAccess = isSuperAdminUser || isTreasurerUser || isPresidentUser || Boolean(m.hasTreasurerConsoleAccess);
                    const hasInitiativeAccess = isSuperAdminUser || isTreasurerUser || isPresidentUser || Boolean(m.hasInitiativeAccess);
                    const canPublishProjects = true; // All active members can post projects

                    return (
                      <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4">
                          <strong className="block text-slate-900 dark:text-white text-sm">
                            {isOfficialAccount(m) ? m.role : m.name}
                          </strong>
                          <span className="text-slate-400 font-mono text-[10px] block">{m.id} • {m.email}</span>
                          {m.approved_by && (
                            <span className="text-emerald-600 dark:text-emerald-400 text-[10px] block mt-0.5 font-semibold">
                              Approved by {m.approved_by} {m.approved_at ? `on ${new Date(m.approved_at).toLocaleDateString()}` : ''}
                            </span>
                          )}
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
                            <option value="pending">pending</option>
                          </select>
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
          <div className="p-6 sm:p-8 rounded-3xl bg-[#c1c4c7] dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-800 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-400/40 flex items-center gap-1.5 w-fit">
                  <ShieldCheck className="w-3.5 h-3.5" /> Club Treasurer Administrative Console
                </span>
                <h2 className="font-heading text-2xl font-semibold text-slate-900 dark:text-white">
                  Member Dues Management Ledger
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Optimist Fiscal Year runs <strong>October 1st to September 30th</strong>. As Club Treasurer (<strong>Sharon Mohammed</strong>) and Club Executives, you can record payments, view official statements, add notes, and email dues balance statements.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-300 dark:border-slate-700 text-right shrink-0">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Total Active Settled Dues</span>
                <strong className="font-heading text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
                  {memberRoster.filter(m => !isOfficialAccount(m) && m.duesStatus && m.duesStatus.includes('Active')).length} / {realMemberCount}
                </strong>
              </div>
            </div>

            {treasurerMsg && (
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 border border-emerald-400/40 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{treasurerMsg}</span>
              </div>
            )}
          </div>

          {/* Scotiabank Bank Transfer Info Box */}
          <div className="p-4 rounded-2xl bg-[#c1c4c7] dark:bg-slate-900 text-slate-900 dark:text-white border border-amber-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs space-y-0.5">
              <strong className="text-amber-700 dark:text-amber-400 font-bold block">Official {siteSettings?.bankName} Dues Deposit Account:</strong>
              <p className="text-slate-600 dark:text-slate-300 font-mono">
                Bank: <strong>{siteSettings?.bankName}</strong> • Account Name: <strong>{siteSettings?.bankAccountName}</strong> • Account #: <strong className="text-emerald-600 dark:text-emerald-400">{siteSettings?.bankAccountNumber}</strong> • Branch: <strong>{siteSettings?.bankBranch}</strong> • Transit/Routing #: <strong className="text-amber-700 dark:text-amber-400">{siteSettings?.bankRoutingNumber}</strong>
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
                {selectedMemberIds.length === treasurerRoster.length ? 'Deselect All' : 'Select All'}
              </button>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                (Total Members: {treasurerRoster.length})
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => { setAddMemberError(''); setShowAddMember(true); }}
                className="px-4 py-2 rounded-xl gold-gradient hover:brightness-110 text-slate-950 text-xs font-bold shadow transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add Member
              </button>

              <button
                onClick={() => { setAddMemberError(''); setShowBulkAdd(true); }}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold shadow transition-colors flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5 text-amber-300" /> Bulk Add Members
              </button>

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

          {/* Members awaiting an officer's approval. Records the Treasurer adds
              are active immediately and never appear here. */}
          {pendingApprovalMembers.length > 0 && (
            <div className="p-5 rounded-2xl glass-card border border-amber-400/50 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white">
                  Membership Intake ({pendingApprovalMembers.length})
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {canApproveMembers
                  ? 'Applications from the Become a Member form, plus any records entered here by an admin other than the Treasurer. Approve to activate.'
                  : 'Only the President, Treasurer, or Secretary can approve these records.'}
              </p>

              <div className="space-y-2">
                {pendingApprovalMembers.map(m => (
                  <div
                    key={m.id}
                    className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900"
                  >
                    <div className="text-xs space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <strong className="text-slate-900 dark:text-white">{m.name}</strong>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                          m.fromApplication
                            ? 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {m.fromApplication ? 'Membership Application' : 'Added by Admin'}
                        </span>
                        {m.awaitingVerification && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                            Awaiting Email Verification
                          </span>
                        )}
                      </div>
                      <span className="text-slate-500 font-mono text-[10px] block">{m.id} • {m.email}</span>
                      <span className="text-slate-500 text-[10px] block">Role: {m.role}</span>
                      {m.phone && <span className="text-slate-500 text-[10px] block">Phone: {m.phone}</span>}
                      {m.address && <span className="text-slate-500 text-[10px] block">Address: {m.address}</span>}
                      {/* Everything the applicant entered on the application form. */}
                      {m.notes && (
                        <p className="text-[10px] text-slate-600 dark:text-slate-400 italic break-words pt-0.5">
                          {m.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 shrink-0">
                      <button
                        onClick={() => handleApproveMember(m.id, m.name)}
                        disabled={!canApproveMembers || m.awaitingVerification}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase shadow transition-all ${
                          canApproveMembers && !m.awaitingVerification
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500'
                        }`}
                        title={
                          m.awaitingVerification
                            ? 'This applicant must verify their email and set a password first'
                            : canApproveMembers
                              ? 'Approve and activate this member record'
                              : 'Reserved for the President, Treasurer, or Secretary'
                        }
                      >
                        <Check className="w-3 h-3 inline mr-1" /> Approve
                      </button>
                      <button
                        onClick={() => handleArchiveMember(m.id, m.name)}
                        disabled={!canApproveMembers}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase shadow transition-all ${
                          canApproveMembers
                            ? 'bg-amber-600 hover:bg-amber-700 text-white cursor-pointer'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500'
                        }`}
                        title={canApproveMembers ? "Archive this applicant" : "Reserved for President, Treasurer, or Secretary"}
                      >
                        <Archive className="w-3 h-3 inline mr-1" /> Archive
                      </button>
                      <button
                        onClick={() => handleDeleteMember(m.id, m.name)}
                        disabled={!canApproveMembers}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase shadow transition-all ${
                          canApproveMembers
                            ? 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500'
                        }`}
                        title={canApproveMembers ? "Permanently delete this applicant" : "Reserved for President, Treasurer, or Secretary"}
                      >
                        <Trash2 className="w-3 h-3 inline mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                        checked={selectedMemberIds.length === treasurerRoster.length && treasurerRoster.length > 0}
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
                  {treasurerRoster.map((member, index) => {
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
                            onClick={() => handleOpenStatement(member)}
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
                          <span className="text-amber-600 dark:text-amber-400 font-bold">{member.duesRate ? member.duesRate.replace(' BBD', '') : ''} Rate</span>
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
                            onClick={() => handleOpenStatement(member)}
                            className="w-full px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] shadow transition-colors flex items-center justify-center gap-1"
                          >
                            <FileText className="w-3 h-3" /> View Statement
                          </button>

                          <button
                            onClick={() => handleSendEmailStatement(member.id)}
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-optimist-blue hover:text-white text-slate-700 dark:text-slate-300 font-bold text-[10px] transition-colors flex items-center justify-center gap-1 border border-slate-200 dark:border-slate-700"
                            title="Send Email Statement"
                          >
                            <Send className="w-3 h-3 text-amber-500" /> Email Statement
                          </button>

                          <button
                            onClick={() => handleDeactivateMember(member.id, member.name)}
                            disabled={!canApproveMembers}
                            className={`w-full px-3 py-1.5 rounded-xl font-bold text-[10px] transition-colors flex items-center justify-center gap-1 border ${
                              canApproveMembers
                                ? 'bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-900 cursor-pointer'
                                : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed'
                            }`}
                            title={canApproveMembers ? "Move this member to Inactive Members" : "Reserved for President, Treasurer, or Secretary"}
                          >
                            <UserX className="w-3 h-3" /> Deactivate
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
                <p className="text-slate-800 dark:text-slate-200">Annual Dues Rate: <strong>{statementModalMember.duesRate ? statementModalMember.duesRate.replace(' BBD', '') : (siteSettings?.annualDuesRate || '$200.00')}</strong></p>
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
                    {statementPayments.length > 0 ? (
                      statementPayments.map(p => (
                        <tr key={p.id}>
                          <td className="p-2.5 font-mono text-slate-500">{String(p.paid_at).split('T')[0]}</td>
                          <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">
                            Annual Club Dues ({statementModalMember.fiscalYear || '2025/2026'})
                            {p.stripe_session_id && <span className="ml-1.5 text-[9px] font-bold uppercase text-blue-500">Card</span>}
                          </td>
                          <td className="p-2.5 text-slate-500">{p.payment_method}</td>
                          <td className="p-2.5 text-right font-bold text-emerald-600 dark:text-emerald-400">${Number(p.amount_bbd).toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-3 text-center text-slate-400 italic">No payments recorded for this fiscal year yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bank Transfer Instructions */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-1 text-xs font-mono">
              <span className="text-[10px] font-bold text-amber-400 uppercase block font-sans">Payment Instructions: {siteSettings?.bankName} Bank Transfer</span>
              <p>Bank: <strong>{siteSettings?.bankName}</strong> • Account Name: <strong>{siteSettings?.bankAccountName}</strong></p>
              <p>Account #: <strong className="text-emerald-400">{siteSettings?.bankAccountNumber}</strong> • Branch: <strong>{siteSettings?.bankBranch}</strong> • Transit #: <strong className="text-amber-300">{siteSettings?.bankRoutingNumber}</strong></p>
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

                <button
                  onClick={() => {
                    handleStartEdit(statementModalMember);
                    setStatementModalMember(null);
                  }}
                  className="px-4 py-2.5 rounded-xl gold-gradient hover:brightness-110 text-slate-950 text-xs font-bold shadow transition-all flex items-center gap-1.5"
                  title="Edit this member's roster record"
                >
                  <Edit3 className="w-4 h-4" /> Edit Roster Record
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
      {activeTab === 'names' && canApproveMembers && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-500" />
            <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white">Member Name Changes</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Members can update their own contact details, but a change to the name on the roster needs an
            officer's approval. You cannot approve your own request - another officer must review it.
          </p>

          {nameChangeMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
              {nameChangeMsg}
            </div>
          )}

          {nameChangeRequests.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
              No name change requests have been submitted.
            </div>
          ) : (
            <div className="space-y-3">
              {nameChangeRequests.map(request => {
                const isOwnRequest = request.member_id === currentUser?.memberId;
                return (
                  <div
                    key={request.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {request.current_name} <span className="text-slate-400">to</span> {request.requested_name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {request.email || request.member_id}
                        {request.requested_at && ` - requested ${new Date(request.requested_at).toLocaleDateString()}`}
                      </p>
                    </div>

                    {request.status === 'pending' ? (
                      isOwnRequest ? (
                        <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                          Another officer must approve this
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleReviewNameChange(request.id, 'approved')}
                            disabled={reviewingRequestId === request.id}
                            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold disabled:opacity-60"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReviewNameChange(request.id, 'declined')}
                            disabled={reviewingRequestId === request.id}
                            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-60"
                          >
                            Decline
                          </button>
                        </div>
                      )
                    ) : (
                      <span className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded ${
                        request.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {request.status}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

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

      {/* TAB 4: BARBADOS CLUBS DIRECTORY */}
      {activeTab === 'clubs' && canManageSettings && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-optimist-blue" />
                Barbados Clubs Directory
              </h2>
              <button
                onClick={() => { setEditingClub(null); setClubModalOpen(true); }}
                className="px-4 py-2.5 rounded-xl bg-optimist-blue hover:bg-blue-800 text-white font-bold text-xs shadow transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Club
              </button>
            </div>

            <p className="text-xs text-slate-500 -mt-1">
              Managed here, shown live on the public <strong>/barbados-clubs</strong> page.
            </p>

            <div className="space-y-3">
              {barbadosClubs.map(club => (
                <div key={club.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm text-slate-900 dark:text-white truncate">{club.name}</strong>
                      {club.isHost && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full gold-gradient text-slate-950 shrink-0">
                          Host
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{club.location || 'No location set'}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => { setEditingClub(club); setClubModalOpen(true); }}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete "${club.name}" from the Barbados Clubs directory? This cannot be undone.`)) {
                          deleteBarbadosClub(club.id);
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-xl border border-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 font-bold text-xs transition-all flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {barbadosClubs.length === 0 && (
                <p className="text-xs text-slate-400 italic text-center py-8">No clubs added yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      <BarbadosClubModal
        isOpen={clubModalOpen}
        onClose={() => setClubModalOpen(false)}
        club={editingClub}
      />

      {/* TAB 5: ARCHIVED APPLICANTS */}
      {activeTab === 'archived' && canManageSettings && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Archive className="w-5 h-5 text-amber-500" />
                  Archived Membership Applicants ({archivedApplicants.length})
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  List of archived applicant records. Click <strong>Review</strong> to restore an applicant back to the active Membership Intake queue for approval, or <strong>Delete</strong> to permanently purge the record.
                </p>
              </div>

              <div className="relative shrink-0 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search archived..."
                  value={memberSearch}
                  onChange={e => setMemberSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-optimist-blue"
                />
              </div>
            </div>

            {archivedApplicants.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <Archive className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
                <h3 className="font-heading text-sm font-semibold text-slate-700 dark:text-slate-300">No Archived Applicants</h3>
                <p className="text-xs text-slate-500">There are currently no archived membership applications.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4 w-12 text-center text-slate-400">#</th>
                      <th className="p-4">Applicant Name & ID</th>
                      <th className="p-4">Contact Info</th>
                      <th className="p-4">Application Details / Notes</th>
                      <th className="p-4">Archived Info</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {archivedApplicants
                      .filter(a =>
                        (a.name || '').toLowerCase().includes(memberSearch.toLowerCase()) ||
                        (a.email || '').toLowerCase().includes(memberSearch.toLowerCase()) ||
                        (a.member_id || '').toLowerCase().includes(memberSearch.toLowerCase())
                      )
                      .map((arch, index) => (
                        <tr key={arch.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-4 text-center font-mono text-slate-400 font-bold text-xs border-r border-slate-200 dark:border-slate-800">
                            {index + 1}
                          </td>
                          <td className="p-4">
                            <strong className="block text-slate-900 dark:text-white text-sm">{arch.name}</strong>
                            <span className="text-slate-400 font-mono text-[10px] block">{arch.member_id || arch.id}</span>
                          </td>
                          <td className="p-4 space-y-0.5">
                            <span className="text-slate-800 dark:text-slate-200 text-xs block">{arch.email}</span>
                            {arch.phone && <span className="text-slate-500 text-[10px] block">Phone: {arch.phone}</span>}
                            {arch.address && <span className="text-slate-500 text-[10px] block truncate max-w-xs">Address: {arch.address}</span>}
                          </td>
                          <td className="p-4 max-w-xs">
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 italic break-words line-clamp-3">
                              "{arch.notes || 'No extra application details'}"
                            </p>
                          </td>
                          <td className="p-4 space-y-0.5">
                            <span className="text-amber-600 dark:text-amber-400 text-xs font-bold block">
                              Archived by {arch.archived_by || 'Admin'}
                            </span>
                            <span className="text-slate-400 text-[10px] block">
                              {arch.archived_at ? new Date(arch.archived_at).toLocaleString() : 'N/A'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleRestoreArchivedMember(arch.id, arch.name)}
                                className="px-3.5 py-1.5 rounded-xl bg-optimist-blue hover:bg-blue-800 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow"
                                title="Review and restore applicant to Membership Intake queue"
                              >
                                <RotateCcw className="w-3.5 h-3.5" /> Review
                              </button>
                              <button
                                onClick={() => handleDeleteArchivedApplicant(arch.id, arch.name)}
                                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow"
                                title="Permanently delete from archive"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: INACTIVE MEMBERS */}
      {activeTab === 'inactive' && canManageSettings && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <UserX className="w-5 h-5 text-rose-500" />
                  Inactive Members ({inactiveMembers.length})
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Members removed from the active roster and public directory. Their dues history is kept. Click <strong>Reactivate</strong> to restore them to the active roster.
                </p>
              </div>

              <div className="relative shrink-0 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search inactive members..."
                  value={memberSearch}
                  onChange={e => setMemberSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-optimist-blue"
                />
              </div>
            </div>

            {inactiveMembers.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <UserX className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
                <h3 className="font-heading text-sm font-semibold text-slate-700 dark:text-slate-300">No Inactive Members</h3>
                <p className="text-xs text-slate-500">There are currently no deactivated member records.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4 w-12 text-center text-slate-400">#</th>
                      <th className="p-4">Member Name & ID</th>
                      <th className="p-4">Contact Info</th>
                      <th className="p-4">Role</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {inactiveMembers.map((m, index) => (
                      <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4 text-center font-mono text-slate-400 font-bold text-xs border-r border-slate-200 dark:border-slate-800">
                          {index + 1}
                        </td>
                        <td className="p-4">
                          <strong className="block text-slate-900 dark:text-white text-sm">{m.name}</strong>
                          <span className="text-slate-400 font-mono text-[10px] block">{m.id}</span>
                        </td>
                        <td className="p-4 space-y-0.5">
                          <span className="text-slate-800 dark:text-slate-200 text-xs block">{m.email}</span>
                          {m.phone && <span className="text-slate-500 text-[10px] block">Phone: {m.phone}</span>}
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {m.role}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleReactivateMember(m.id, m.name)}
                            className="px-3.5 py-1.5 rounded-xl bg-optimist-blue hover:bg-blue-800 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow ml-auto"
                            title="Restore this member to the active roster"
                          >
                            <UserCheck className="w-3.5 h-3.5" /> Reactivate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RESET PASSWORD: choose random vs. manually-set password. Rendered
          above the Edit Record modal (z-[60] vs its z-50) since this opens
          on top of it, not in place of it. */}
      {resetPasswordTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-500" />
              <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">Reset Password</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              For <strong className="text-slate-800 dark:text-slate-200">{resetPasswordTarget.name}</strong> ({resetPasswordTarget.email}).
              Their current password will stop working immediately.
            </p>

            <form onSubmit={handleConfirmResetPassword} className="space-y-3">
              {resetPasswordError && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{resetPasswordError}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer has-[:checked]:border-optimist-blue has-[:checked]:bg-optimist-blue/5">
                  <input
                    type="radio"
                    checked={resetPasswordMode === 'random'}
                    onChange={() => setResetPasswordMode('random')}
                  />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Generate a random password</span>
                </label>
                <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer has-[:checked]:border-optimist-blue has-[:checked]:bg-optimist-blue/5">
                  <input
                    type="radio"
                    checked={resetPasswordMode === 'custom'}
                    onChange={() => setResetPasswordMode('custom')}
                  />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Set a specific password</span>
                </label>
              </div>

              {resetPasswordMode === 'custom' && (
                <div className="space-y-2 animate-fadeIn">
                  <input
                    type="text"
                    value={customPassword}
                    onChange={e => setCustomPassword(e.target.value)}
                    placeholder="New password (min. 8 characters)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-optimist-blue outline-none"
                    autoComplete="new-password"
                  />
                  <input
                    type="text"
                    value={customPasswordConfirm}
                    onChange={e => setCustomPasswordConfirm(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono focus:ring-2 focus:ring-optimist-blue outline-none"
                    autoComplete="new-password"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setResetPasswordTarget(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResettingPassword}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow transition-all disabled:opacity-60"
                >
                  {isResettingPassword ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD RESULT: shown exactly once, never persisted */}
      {resetPasswordResult && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-500" />
              <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">Password Reset</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              New password for <strong className="text-slate-800 dark:text-slate-200">{resetPasswordResult.name}</strong> ({resetPasswordResult.email}).
              This is shown only once — copy it now before closing this dialog.
            </p>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
              <code className="flex-1 text-sm font-mono font-bold text-slate-900 dark:text-white break-all">
                {resetPasswordResult.password}
              </code>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(resetPasswordResult.password);
                  setCopiedResetPassword(true);
                  setTimeout(() => setCopiedResetPassword(false), 2500);
                }}
                className="px-3 py-1.5 rounded-lg bg-optimist-blue text-white text-xs font-bold shrink-0"
              >
                {copiedResetPassword ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <button
              type="button"
              onClick={() => { setResetPasswordResult(null); setCopiedResetPassword(false); }}
              className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ADD MEMBER (INDIVIDUAL) MODAL */}
      {showAddMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-optimist-blue" /> Add Member
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Creates the membership record. Only members on this database can create a portal account.
                </p>
              </div>
              <button
                onClick={() => setShowAddMember(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="p-6 space-y-4">
              {addMemberError && (
                <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{addMemberError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={addForm.name}
                    onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={addForm.email}
                    onChange={e => setAddForm({ ...addForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={addForm.phone}
                    onChange={e => setAddForm({ ...addForm, phone: e.target.value })}
                    placeholder="+1 (246) ..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Roster Role
                  </label>
                  <select
                    value={addForm.role}
                    onChange={e => setAddForm({ ...addForm, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                  >
                    {MEMBER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Postal Address
                  </label>
                  <textarea
                    rows={2}
                    value={addForm.address}
                    onChange={e => setAddForm({ ...addForm, address: e.target.value })}
                    placeholder="Physical address in Barbados..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Access Permission Level
                  </label>
                  <select
                    value={addForm.access}
                    onChange={e => setAddForm({ ...addForm, access: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none font-semibold"
                  >
                    <option value="member">member</option>
                    <option value="moderator">moderator</option>
                    <option value="admin">admin</option>
                    {userAccess === 'super admin' && <option value="finance">finance</option>}
                  </select>
                  {addForm.access !== 'member' && !addForm.email.toLowerCase().endsWith('@progressiveoptimist.org') && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1.5 flex items-start gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                      <span>
                        Admin access on a personal email address is temporary - it is revoked automatically
                        on October 1st. Use an @progressiveoptimist.org address for permanent access.
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Dues Ledger Fields Divider */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-4">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 w-fit">
                  <DollarSign className="w-3.5 h-3.5" /> Dues Ledger & Payment Details
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Yearly Dues Rate */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Yearly Dues Rate *
                    </label>
                    <input
                      type="text"
                      value={addForm.duesRate}
                      onChange={e => {
                        const duesRate = e.target.value;
                        const paid = Number(String(addForm.amountPaid).replace(/[^0-9.]/g, '')) || 0;
                        const rate = Number(String(duesRate).replace(/[^0-9.]/g, '')) || 0;
                        setAddForm({ ...addForm, duesRate, balanceDue: `$${(rate - paid).toFixed(2)}` });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                      required
                    />
                  </div>

                  {/* Dues Status */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Dues Status
                    </label>
                    <select
                      value={addForm.duesStatus}
                      onChange={e => setAddForm({ ...addForm, duesStatus: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                    >
                      <option value="Active Member (Dues Paid)">Active Member (Dues Paid)</option>
                      <option value="Unpaid (Dues Owed)">Unpaid (Dues Owed)</option>
                      <option value="Partially Paid (Balance Due)">Partially Paid (Balance Due)</option>
                      <option value="Exempt / Honorary">Exempt / Honorary</option>
                    </select>
                  </div>

                  {/* Amount Paid */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Amount Paid
                    </label>
                    <input
                      type="text"
                      value={addForm.amountPaid}
                      onChange={e => {
                        const amountPaid = e.target.value;
                        const paid = Number(String(amountPaid).replace(/[^0-9.]/g, '')) || 0;
                        const rate = Number(String(addForm.duesRate).replace(/[^0-9.]/g, '')) || 0;
                        setAddForm({ ...addForm, amountPaid, balanceDue: `$${(rate - paid).toFixed(2)}` });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                    />
                  </div>

                  {/* Balance Due - computed from Dues Rate minus Amount Paid */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Balance Due (computed)
                    </label>
                    <div className={`w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-xs font-bold ${
                      addForm.balanceDue && addForm.balanceDue.replace(/[^0-9.-]/g, '') !== '0.00' && !addForm.balanceDue.includes('-')
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {addForm.balanceDue}
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="sm:max-w-xs">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={addForm.paymentMethod}
                    onChange={e => setAddForm({ ...addForm, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Cash">Cash</option>
                    <option value="In-kind">In-kind</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMember(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingMembers}
                  className="flex-1 px-4 py-2.5 rounded-xl gold-gradient hover:brightness-110 text-slate-950 text-xs font-bold shadow transition-all disabled:opacity-60 flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  {isSavingMembers ? 'Saving...' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BULK ADD MEMBERS MODAL */}
      {showBulkAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-optimist-blue" /> Bulk Add Members
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Type each member into a row. Name and email are required; blank rows are ignored.
                </p>
              </div>
              <button
                onClick={() => setShowBulkAdd(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBulkAdd} className="p-6 space-y-4">
              {addMemberError && (
                <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{addMemberError}</span>
                </div>
              )}

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3 w-10 text-center text-slate-400">#</th>
                      <th className="p-3">Full Name *</th>
                      <th className="p-3">Email Address *</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Role</th>
                      <th className="p-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {bulkRows.map((row, index) => (
                      <tr key={index}>
                        <td className="p-2 text-center font-mono text-slate-400 text-[10px]">{index + 1}</td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={row.name}
                            onChange={e => updateBulkRow(index, 'name', e.target.value)}
                            placeholder="Jane Doe"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="email"
                            value={row.email}
                            onChange={e => updateBulkRow(index, 'email', e.target.value)}
                            placeholder="jane@example.com"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={row.phone}
                            onChange={e => updateBulkRow(index, 'phone', e.target.value)}
                            placeholder="(246) ..."
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
                          />
                        </td>
                        <td className="p-2">
                          <select
                            value={row.role}
                            onChange={e => updateBulkRow(index, 'role', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
                          >
                            {MEMBER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </td>
                        <td className="p-2 text-center">
                          {bulkRows.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setBulkRows(prev => prev.filter((_, i) => i !== index))}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                              title="Remove this row"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={() => setBulkRows(prev => [...prev, { ...emptyBulkRow }])}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5 text-slate-700 dark:text-slate-200"
              >
                <Plus className="w-3.5 h-3.5 text-optimist-blue" /> Add Row
              </button>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBulkAdd(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingMembers}
                  className="flex-1 px-4 py-2.5 rounded-xl gold-gradient hover:brightness-110 text-slate-950 text-xs font-bold shadow transition-all disabled:opacity-60 flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  {isSavingMembers ? 'Saving...' : 'Save All Members'}
                </button>
              </div>
            </form>
          </div>
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
              <div className="flex items-center gap-2">
                {userAccess === 'super admin' && (
                  <button
                    type="button"
                    onClick={() => openResetPassword(selectedMemberToEdit)}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-[10px] font-bold uppercase inline-flex items-center gap-1.5 transition-colors"
                    title="Reset this member's password"
                  >
                    <Lock className="w-3 h-3" />
                    Reset Password
                  </button>
                )}
                <button
                  onClick={() => setSelectedMemberToEdit(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-850 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
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
                  <select
                    value={MEMBER_ROLES.includes(editForm.role) ? editForm.role : 'Other'}
                    onChange={e => {
                      const val = e.target.value;
                      setEditForm({ ...editForm, role: val === 'Other' ? '' : val });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                  >
                    {MEMBER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    <option value="Other">Other (legacy role text)</option>
                  </select>
                </div>

                {/* Show text input if the stored role predates the fixed role list */}
                {!MEMBER_ROLES.includes(editForm.role) && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Legacy Role Text *
                    </label>
                    <input
                      type="text"
                      value={editForm.role}
                      onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                      placeholder="e.g. Active Member & Charter Member"
                      className="w-full px-3 py-2 rounded-xl border border-amber-400 dark:border-amber-400 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                      required
                    />
                  </div>
                )}

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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Yearly Dues Rate */}
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

                  {/* Dues Status */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Dues Status
                    </label>
                    <select
                      value={editForm.duesStatus}
                      onChange={e => setEditForm({ ...editForm, duesStatus: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                    >
                      <option value="Active Member (Dues Paid)">Active Member (Dues Paid)</option>
                      <option value="Unpaid (Dues Owed)">Unpaid (Dues Owed)</option>
                      <option value="Partially Paid (Balance Due)">Partially Paid (Balance Due)</option>
                      <option value="Exempt / Honorary">Exempt / Honorary</option>
                    </select>
                  </div>

                  {/* Amount Paid - computed from the payment rows below, not typed */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Amount Paid (computed)
                    </label>
                    <div className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      ${paymentRowsTotal.toFixed(2)}
                    </div>
                  </div>

                  {/* Balance Due - computed from Dues Rate minus payments */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Balance Due (computed)
                    </label>
                    <div className={`w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-xs font-bold ${
                      (Number(String(editForm.duesRate).replace(/[^0-9.]/g, '')) || 0) - paymentRowsTotal > 0
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {(() => {
                        const balance = (Number(String(editForm.duesRate).replace(/[^0-9.]/g, '')) || 0) - paymentRowsTotal;
                        return balance < 0 ? `-$${Math.abs(balance).toFixed(2)}` : `$${balance.toFixed(2)}`;
                      })()}
                    </div>
                  </div>
                </div>

                {/* Itemized Payments - up to 4 per fiscal year */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Payments This Fiscal Year (up to 4)
                  </label>
                  <div className="space-y-2">
                    {paymentRows.map((row, index) => (
                      <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                        <input
                          type="date"
                          value={row.date}
                          onChange={e => updatePaymentRow(index, 'date', e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
                        />
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Amount"
                          value={row.amount}
                          onChange={e => updatePaymentRow(index, 'amount', e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
                        />
                        <select
                          value={row.method}
                          onChange={e => updatePaymentRow(index, 'method', e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:ring-2 focus:ring-optimist-blue"
                        >
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="Credit Card">Credit Card</option>
                          <option value="Cheque">Cheque</option>
                          <option value="Cash">Cash</option>
                          <option value="In-kind">In-kind</option>
                        </select>
                      </div>
                    ))}
                  </div>

                  {stripePaymentsForEdit.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold uppercase text-slate-500">
                        Also on file (paid by card via Stripe - not editable here)
                      </span>
                      {stripePaymentsForEdit.map(p => (
                        <div key={p.id} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-[11px] text-slate-600 dark:text-slate-300">
                          <span>{String(p.paid_at).split('T')[0]} • {p.payment_method}</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">${Number(p.amount_bbd).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
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
                  disabled={isSavingPayments}
                  className="px-5 py-2 rounded-xl gold-gradient hover:brightness-110 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 disabled:opacity-60"
                >
                  <Save className="w-4 h-4 text-slate-950" />
                  <span>{isSavingPayments ? 'Saving...' : 'Save Record Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
