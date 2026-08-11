import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { activeRoster21 } from '../data/rosterData';
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
  X,
  Users,
  Eye,
  Loader2,
  MapPin
} from 'lucide-react';

export const MembershipPage = ({ onOpenPostModal }) => {
  const {
    currentUser,
    login,
    registerMember,
    verifyMemberEmailAndPassword,
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
  const [dashboardTab, setDashboardTab] = useState('projects'); // 'projects' | 'gallery' | 'directory' | 'resources' | 'dues' | 'treasurer'
  const [dirSearchTerm, setDirSearchTerm] = useState('');
  const [copiedText, setCopiedText] = useState(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Application form state (Structured using the ProgressiveOCB Membership Application template)
  const [appForm, setAppForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    village: '',
    parish: '',
    country: 'Barbados',
    dob: '',
    gender: 'Male',
    hearAboutUs: 'Website',
    referrerName: '',
    occupation: '',
    employer: '',
    comments: ''
  });
  const [appSuccess, setAppSuccess] = useState(false);

  // Email verification state variables
  const [verifyEmail, setVerifyEmail] = useState('');
  const [verifyToken, setVerifyToken] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  // Handle URL email verification link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');
    const email = params.get('email');
    const token = params.get('token');

    if (action === 'verify-email' && email && token) {
      setVerifyEmail(email);
      setVerifyToken(token);
      setAuthTab('verify');
    }
  }, []);

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setVerifyError('');
    if (verifyPassword.length < 6) {
      setVerifyError('Password must be at least 6 characters long.');
      return;
    }

    const res = await verifyMemberEmailAndPassword(verifyEmail, verifyPassword);
    if (res.success) {
      setVerifySuccess(true);
      setTimeout(() => {
        // Clean URL parameters and redirect to login
        window.history.replaceState({}, document.title, window.location.pathname);
        setAuthTab('login');
        setVerifySuccess(false);
        setVerifyPassword('');
      }, 4000);
    } else {
      setVerifyError(res.message || 'Verification failed.');
    }
  };

  // Gallery photo upload state
  const [photoUploadModal, setPhotoUploadModal] = useState(false);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoUploadError, setPhotoUploadError] = useState('');
  
  // Document upload state & viewer modal
  const [internalDocs, setInternalDocs] = useState([
    {
      id: "doc-1",
      name: "Monthly Meeting Minutes - July 2025",
      date: "July 7, 2025",
      size: "320 KB",
      category: "Meeting Minutes",
      author: "Charmaine London (Club Secretary)",
      summary: "Official proceedings of the July 2025 General Meeting of the Progressive Optimist Club of Barbados. Includes full attendance roll-call of all 21 active members, Q3 financial audit, RISE 2025 youth program allocations, and committee reports.",
      content: [
        "PROGRESSIVE OPTIMIST CLUB OF BARBADOS",
        "OPTIMIST INTERNATIONAL CLUB # 78008 - CARIBBEAN DISTRICT",
        "OFFICIAL GENERAL MEETING MINUTES - JULY 7, 2025",
        "",
        "DATE & TIME: July 7, 2025 at 6:00 PM AST",
        "LOCATION: Hybrid (St. Michael Headquarters & Zoom Conference Room 78008)",
        "",
        "1. CALL TO ORDER & OPENING CEREMONIES",
        "   - The meeting was officially called to order at 6:02 PM AST by President Richelle Lucas.",
        "   - The invocation was delivered by Board Director Deborah Bayne.",
        "   - The Optimist Creed was recited in unison by all attending members.",
        "",
        "2. ROLL CALL & ATTENDANCE RECORD (ACTIVE MEMBERS - 21 TOTAL)",
        "   Present:",
        "   1. Richelle Lucas (Club President)",
        "   2. Charmaine London (Club Secretary)",
        "   3. Sharon Mohammed (Club Treasurer)",
        "   4. Edwin Workman (System Administrator & Foundation Rep)",
        "   5. Cameron P. Sobers (Board Director & President-Elect)",
        "   6. Omolara De Riggs-Morris (Board Director & Past President)",
        "   7. Deborah Bayne (Board Director)",
        "   8. Ms Carmel Haynes (Past President 2011 & Charter Member)",
        "   9. Maureen E. Dottin (Foundation Rep-Elect & Past President)",
        "   10. Shirley Hoyte (Past President)",
        "   11. Elizabeth C. Franklin",
        "   12. Stephanie C. Layne",
        "   13. Hyacinth E. Small",
        "   14. Garrylyn Swanston",
        "   15. Aisha Norville",
        "   16. Rozanne A. Parris",
        "   17. Nicole Whiteman",
        "   18. Joy-Ann M. Codrington",
        "   19. Yolanda Thorpe",
        "   20. Alicia Holder",
        "   21. Lisa Brome",
        "",
        "   Quorum Confirmed: Yes (21 of 21 Active Members present).",
        "",
        "3. APPROVAL OF PREVIOUS MINUTES",
        "   - The minutes of the June 2, 2025 General Meeting were reviewed.",
        "   - Motion to approve: Moved by Charmaine London, seconded by Ms Carmel Haynes.",
        "   - Result: Motion carried unanimously without amendments.",
        "",
        "4. EXECUTIVE OFFICER REPORTS",
        "   A. PRESIDENT'S ADDRESS (Richelle Lucas):",
        "      - Welcomed all 21 active members to the Q3 strategy session.",
        "      - Highlighted the upcoming 2025-2026 Fiscal Year theme launch: \"2025-26 Theme: Optimism in Action\".",
        "      - Expressed gratitude to the System Administrator (Edwin Workman) for completing the digital database and member portal synchronization.",
        "",
        "   B. TREASURER'S FINANCIAL REPORT (Sharon Mohammed):",
        "      - Operating Account Balance (as of June 30, 2025): BDS$ 14,850.00",
        "      - Dues Ledger Update: 100% of the 21 active members have settled their annual dues of BDS$ 250.00. Total Dues Collected: BDS$ 5,250.00.",
        "      - Approved Disbursements:",
        "        * RISE 2025 Youth Experience Facility & Materials: BDS$ 3,500.00",
        "        * District Convention Registration Deposit: BDS$ 850.00",
        "      - Motion to accept Treasurer's Report: Moved by Sharon Mohammed, seconded by Cameron P. Sobers. Carried.",
        "",
        "   C. SECRETARY'S CORRESPONDENCE (Charmaine London):",
        "      - Received official correspondence from Optimist International Headquarters confirming club compliance in good standing.",
        "      - Dispatched annual directory updates and membership roster verifications.",
        "",
        "5. STANDING COMMITTEE REPORTS",
        "   A. Youth & Community Service (Lead: Cameron P. Sobers):",
        "      - RISE 2025 Summer Leadership Experience: Finalized venue at St. Michael Community Center for July 14-18, 2025. 50 student participants enrolled.",
        "      - Annual Youth Oratorical & Essay Contest: Preliminary registration opens September 1, 2025.",
        "",
        "   B. Membership & Attendance Committee (Lead: Maureen E. Dottin):",
        "      - Active Roster maintained strictly at 21 active members.",
        "      - Induction preparation for upcoming candidate applications in Q1 of the 2025-2026 fiscal year.",
        "",
        "   C. Public Relations & Digital Media (Lead: Edwin Workman):",
        "      - System Administrator reported clean deployment of the web application and dynamic Member Records console.",
        "      - Sandbox routing tested and disengaged for live site operations.",
        "",
        "6. UNFINISHED BUSINESS",
        "   - Caribbean District Annual Convention: Delegate selection finalized. Voting delegates: Richelle Lucas (President) and Sharon Mohammed (Treasurer). Alternate: Cameron P. Sobers.",
        "",
        "7. NEW BUSINESS",
        "   - Proposed Bylaw Amendment regarding Super Admin access governance: Confirmed that Super Admin privileges are reserved for System Administrator and Club President.",
        "",
        "8. ANNOUNCEMENTS & ADJOURNMENT",
        "   - Next Executive Committee Meeting: Monday, August 4, 2025 at 6:00 PM.",
        "   - Next General Membership Meeting: Monday, September 1, 2025.",
        "   - Meeting adjourned at 7:48 PM AST on motion by Omolara De Riggs-Morris.",
        "",
        "Minutes Recorded & Prepared By:",
        "Charmaine London, Club Secretary"
      ].join("\n")
    },
    {
      id: "doc-2",
      name: "Progressive Optimist Constitution & Bylaws",
      date: "Annual Revision",
      size: "1.4 MB",
      category: "Governance & Bylaws",
      author: "Executive Committee",
      summary: "Governing Constitution and Articles of Incorporation for the Progressive Optimist Club of Barbados (Optimist International Club #78008). Outlines officer roles, voting thresholds, committee structures, and parliamentary guidelines.",
      content: [
        "CONSTITUTION & ARTICLES OF GOVERNANCE",
        "PROGRESSIVE OPTIMIST CLUB OF BARBADOS",
        "OPTIMIST INTERNATIONAL CLUB # 78008",
        "",
        "PREAMBLE",
        "We, the members of the Progressive Optimist Club of Barbados, bound by a shared devotion to youth development, community service, and the tenets of Optimist International, do hereby establish this Constitution & Bylaws.",
        "",
        "ARTICLE I - NAME, BOUNDARIES & AFFILIATION",
        "Section 1: Name",
        "The official name of this organization shall be the \"Progressive Optimist Club of Barbados\" (hereinafter referred to as the \"Club\").",
        "",
        "Section 2: Affiliation",
        "This Club is chartered by and affiliated with Optimist International and shall operate in accordance with the International Constitution and Caribbean District Regulations.",
        "",
        "ARTICLE II - PURPOSES & CREED",
        "Section 1: Purposes",
        "The purposes of this Club are:",
        "(a) To develop Optimism as a philosophy of life utilizing the tenets of the Optimist Creed;",
        "(b) To promote an active interest in good government and civic affairs;",
        "(c) To inspire youth to achieve their highest potential through structured mentorship and educational programs;",
        "(d) To provide community assistance to those in need.",
        "",
        "ARTICLE III - MEMBERSHIP CLASSIFICATION",
        "Section 1: Active Members",
        "Active membership shall consist of individuals of good character who subscribe to the principles of Optimist International. Active members in good standing possess full voting rights and access to internal digital consoles.",
        "",
        "Section 2: Charter Members",
        "Members who were inducted on or before the charter charter date of May 27, 2010 shall be designated as Charter Members.",
        "",
        "Section 3: Dues & Fiscal Year",
        "The fiscal year of the Club shall extend from October 1st of each calendar year through September 30th of the following calendar year. Annual membership dues shall be fixed at BDS$ 250.00, payable on or before October 1st.",
        "",
        "ARTICLE IV - EXECUTIVE OFFICERS & BOARD OF DIRECTORS",
        "Section 1: Executive Officers",
        "The Executive Officers of the Club shall consist of:",
        "1. Club President",
        "2. Club Treasurer",
        "3. Club Secretary",
        "4. Public Relations Officer (PRO)",
        "",
        "Section 2: Board of Directors",
        "The Board of Directors shall consist of the Executive Officers, the Immediate Past President, the President-Elect, and elected Board Directors.",
        "",
        "Section 3: System Administrator Authority",
        "The System Administrator position is designated by position as a Super Administrator with full, unrestricted access to the digital platform, user security matrices, and server configurations.",
        "",
        "ARTICLE V - MEETINGS & QUORUM",
        "Section 1: Regular Meetings",
        "Regular business meetings of the Club shall be held bi-monthly on designated Mondays at 6:00 PM AST.",
        "",
        "Section 2: Quorum",
        "A simple majority of active members in good standing shall constitute a quorum for the transaction of official club business at any regular or special meeting.",
        "",
        "ARTICLE VI - AMENDMENTS",
        "These Bylaws may be amended at any regular meeting of the Club by a two-thirds (2/3) vote of the active members present, provided notice of the proposed amendment has been submitted in writing at least fourteen (14) days prior.",
        "",
        "Certified as Official Governance Document by:",
        "Richelle Lucas, Club President",
        "Charmaine London, Club Secretary"
      ].join("\n")
    },
    {
      id: "doc-3",
      name: "RISE 2025 Volunteer Schedule & Roster",
      date: "June 2025",
      size: "450 KB",
      category: "Event Schedules & Rosters",
      author: "Cameron P. Sobers (President-Elect)",
      summary: "Complete volunteer roster, session timelines, safety protocols, and venue assignments for the RISE 2025 Youth Leadership & Empowerment Workshop.",
      content: [
        "RISE 2025 YOUTH LEADERSHIP EXPERIENCE",
        "VOLUNTEER ROSTER & OPERATIONAL SCHEDULE",
        "",
        "EVENT DETAILS:",
        "- Event: RISE 2025 Youth Empowerment Workshop",
        "- Location: St. Michael Community Center, Bridgetown, Barbados",
        "- Dates: July 14, 2025 - July 18, 2025 (Monday - Friday)",
        "- Target Audience: 50 High School & Secondary Students",
        "",
        "EXECUTIVE & COMMITTEE LEADERSHIP:",
        "- Event Director: Cameron P. Sobers (President-Elect)",
        "- Logistics Coordinator: Omolara De Riggs-Morris",
        "- Youth Facilitation Lead: Deborah Bayne",
        "- Registration & Welfare Lead: Sharon Mohammed",
        "- Technical & Media Lead: Edwin Workman",
        "",
        "DAILY TIME SCHEDULE (MONDAY - FRIDAY):",
        "08:00 AM - 08:30 AM: Volunteer & Facilitator Morning Briefing & Setup",
        "08:30 AM - 09:00 AM: Student Registration & Name Badge Distribution",
        "09:00 AM - 10:15 AM: Keynote Empowerment Session & Group Icebreakers",
        "10:15 AM - 10:30 AM: Morning Refreshment Break",
        "10:30 AM - 12:15 PM: Workshop Module (Leadership, Public Speaking, Civic Duty)",
        "12:15 PM - 01:15 PM: Catered Lunch & Mentorship Discussions",
        "01:15 PM - 03:30 PM: Group Project Work (Community Impact Pitch Creation)",
        "03:30 PM - 04:00 PM: Daily Reflection, Feedback & Dismissal",
        "04:00 PM - 04:30 PM: Staff Debriefing & Facility Cleanup",
        "",
        "VOLUNTEER FACILITATOR SHIFT ASSIGNMENTS (21 ACTIVE MEMBERS):",
        "- Monday (Registration & Orientation): Charmaine London, Maureen Dottin, Shirley Hoyte, Elizabeth Franklin.",
        "- Tuesday (Public Speaking & Oratory): Cameron Sobers, Ms Carmel Haynes, Stephanie Layne, Hyacinth Small.",
        "- Wednesday (Community Innovation): Richelle Lucas, Omolara De Riggs-Morris, Garrylyn Swanston, Aisha Norville.",
        "- Thursday (Team Building & Financial Literacy): Sharon Mohammed, Rozanne Parris, Nicole Whiteman, Joy-Ann Codrington.",
        "- Friday (Final Presentations & Graduation): Edwin Workman, Yolanda Thorpe, Alicia Holder, Lisa Brome, Deborah Bayne.",
        "",
        "SAFETY & EMERGENCY PROTOCOLS:",
        "- On-site First Aid Officer: Sharon Mohammed",
        "- Emergency Phone Contact: (246) 836-6185 / (246) 425-0121",
        "- Official Email: dev@bajanthings.biz"
      ].join("\n")
    }
  ]);
  const [docUploadModal, setDocUploadModal] = useState(false);
  const [selectedDocModal, setSelectedDocModal] = useState(null);
  const [expandedDocId, setExpandedDocId] = useState(null);
  const [docName, setDocName] = useState('');
  const [docCategory, setDocCategory] = useState('Meeting Minutes');

  const downloadDocumentFile = (doc) => {
    if (!doc) return;
    const cleanFilename = `${doc.name.replace(/[^a-z0-9]/gi, '_')}.txt`;
    const fileHeader = `${doc.name.toUpperCase()}\n${'='.repeat(doc.name.length)}\n\nCategory: ${doc.category || 'Official Document'}\nDate: ${doc.date}\nAuthor: ${doc.author || 'Club Executive Committee'}\n\nSUMMARY:\n${doc.summary || 'Official internal document.'}\n\n${'='.repeat(60)}\nDOCUMENT CONTENT:\n${'='.repeat(60)}\n\n${doc.content || 'Document content.'}\n`;
    
    const blob = new Blob([fileHeader], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = cleanFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };
  
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
    updateMemberDuesByTreasurer(memberId, newStatus, "$250.00", "Bank Transfer");
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

  const MAX_GALLERY_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

  const handlePhotoUpload = (e) => {
    setPhotoUploadError('');
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_GALLERY_FILE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setPhotoUploadError(`File size limit exceeded! Selected image is ${sizeMB} MB. Maximum allowed size is 5.0 MB.`);
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
      setPhotoUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const submitPhoto = async (e) => {
    e.preventDefault();
    if (!photoTitle || !photoUrl) return;

    setPhotoUploadError('');
    setPhotoUploading(true);

    const result = await addGalleryPhoto({
      title: photoTitle,
      caption: photoCaption,
      image: photoUrl
    });

    setPhotoUploading(false);

    if (!result.success) {
      setPhotoUploadError(result.message || 'Failed to upload photo. Please try again.');
      return;
    }

    setPhotoUploadModal(false);
    setPhotoTitle('');
    setPhotoCaption('');
    setPhotoUrl('');
    setPhotoPreview(null);
  };

  const uniqueMembers = Array.from(new Map(memberRoster.map(m => [m.id, m])).values());
  const filteredRoster = uniqueMembers.filter(m =>
    m.name.toLowerCase().includes(rosterSearch.toLowerCase()) ||
    m.email.toLowerCase().includes(rosterSearch.toLowerCase()) ||
    m.id.toLowerCase().includes(rosterSearch.toLowerCase())
  );

  // Combine memberRoster and activeRoster21 into a unified read-only directory list
  const combinedDirectory = useMemo(() => {
    const map = new Map();

    // 1. Populate from activeRoster21 (official roster with phone/email/address)
    if (Array.isArray(activeRoster21)) {
      activeRoster21.forEach(m => {
        const key = m.id || (m.email ? m.email.toLowerCase().trim() : null);
        if (key) {
          map.set(key, {
            id: m.id,
            name: m.fullName || `${m.firstName || ''} ${m.lastName || ''}`.trim(),
            email: m.email || '',
            phone: m.phone || '',
            address: m.address || '',
            role: m.role || 'Active Member',
            status: m.status || 'Active Member',
            avatar: null
          });
        }
      });
    }

    // 2. Merge live memberRoster records
    if (Array.isArray(memberRoster)) {
      memberRoster.forEach(m => {
        const key = m.id || (m.email ? m.email.toLowerCase().trim() : null);
        if (key) {
          const existing = map.get(key) || {};
          map.set(key, {
            ...existing,
            id: m.id || existing.id,
            name: m.name || existing.name,
            email: m.email || existing.email,
            phone: m.phone || existing.phone || '',
            address: m.address || existing.address,
            role: m.role || existing.role || 'Active Member',
            status: m.duesStatus ? (m.duesStatus.includes('Active') ? 'Active Member' : m.duesStatus) : (existing.status || 'Active Member'),
            avatar: m.avatar || existing.avatar
          });
        }
      });
    }

    return Array.from(map.values());
  }, [memberRoster]);

  const filteredDirectory = combinedDirectory.filter(m => {
    const term = dirSearchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      (m.name && m.name.toLowerCase().includes(term)) ||
      (m.email && m.email.toLowerCase().includes(term)) ||
      (m.phone && m.phone.toLowerCase().includes(term)) ||
      (m.role && m.role.toLowerCase().includes(term)) ||
      (m.id && m.id.toLowerCase().includes(term))
    );
  });

  // If user is LOGGED IN: Render Member Portal Dashboard
  if (currentUser) {
    const myProjects = projects.filter(p => p.authorId === currentUser.memberId || p.author === currentUser.name);

    const canAccessTreasurerConsole = currentUser && (
      currentUser.access === 'super admin' ||
      currentUser.access === 'finance'
    );

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
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  <span>Welcome,</span>{' '}
                  <span className="whitespace-nowrap">{currentUser.name}!</span>
                </h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded gold-gradient text-slate-950 shrink-0">
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
            {canAccessTreasurerConsole && (
              <Link
                to="/admin"
                className="bg-slate-900 hover:bg-slate-850 text-amber-400 border border-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs shadow transition-all flex items-center gap-1.5"
                title="Go to Admin & Site Settings Console"
              >
                <ShieldCheck className="w-4.5 h-4.5 text-amber-400" />
                <span>Admin Settings</span>
              </Link>
            )}

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
              className="p-2 rounded-xl bg-red-600/90 hover:bg-red-600 text-white shadow-md transition-all shrink-0 flex items-center justify-center opacity-90 hover:opacity-100"
              title="Logout"
            >
              <LogOut className="w-2.5 h-2.5 text-white opacity-90" />
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
            Shared Members Photos ({memberGallery.length})
          </button>

          <button
            onClick={() => setDashboardTab('directory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              dashboardTab === 'directory'
                ? 'bg-optimist-blue text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Members Directory ({combinedDirectory.length})</span>
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
            My Dues Record ($250)
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

        {/* Tab: Read-Only Members Directory */}
        {dashboardTab === 'directory' && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Read-Only Directory
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Internal Roster
                    </span>
                  </div>
                  <h2 className="font-heading text-2xl font-black text-white mt-2 flex items-center gap-2">
                    <Users className="w-6 h-6 text-amber-400" />
                    Active Members Directory
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                    Official internal membership roster and contact directory for the Progressive Optimist Club of Barbados. Accessible exclusively to authenticated club members.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-slate-800 px-4 py-2.5 rounded-2xl border border-slate-700 text-center">
                    <span className="block text-2xl font-black text-amber-400 leading-none">
                      {combinedDirectory.length}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Active Members
                    </span>
                  </div>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={dirSearchTerm}
                    onChange={(e) => setDirSearchTerm(e.target.value)}
                    placeholder="Search member name, phone number, email address, or role..."
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                  {dirSearchTerm && (
                    <button
                      onClick={() => setDirSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {copiedText && (
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{copiedText} copied to clipboard!</span>
                </div>
              )}
            </div>

            {/* Members Directory Table (Name, Club Position, Email, Phone) */}
            <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Club Position</th>
                    <th className="py-4 px-6">Email Address</th>
                    <th className="py-4 px-6">Phone Number</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                  {filteredDirectory.map((member) => (
                    <tr
                      key={member.id || member.email}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {/* Name */}
                      <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center space-x-3">
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-300 dark:border-slate-700 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-optimist-blue/20 text-optimist-blue dark:text-amber-400 font-extrabold text-xs flex items-center justify-center border border-optimist-blue/30 shrink-0">
                              {member.name ? member.name.charAt(0).toUpperCase() : 'M'}
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="block font-extrabold text-slate-900 dark:text-white truncate">{member.name}</span>
                            <span className="text-[10px] font-mono text-slate-400 block">{member.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Club Position */}
                      <td className="py-4 px-6 text-slate-700 dark:text-slate-300">
                        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-optimist-blue dark:bg-blue-950/60 dark:text-amber-400 border border-blue-200 dark:border-blue-800">
                          {member.role || 'Active Member'}
                        </span>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-6 text-slate-700 dark:text-slate-300">
                        <div className="flex items-center space-x-2">
                          <a
                            href={`mailto:${member.email}`}
                            className="font-semibold text-slate-800 dark:text-slate-200 hover:text-optimist-blue dark:hover:text-amber-400 hover:underline flex items-center gap-1.5"
                          >
                            <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>{member.email}</span>
                          </a>
                          {member.email && (
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(member.email);
                                setCopiedText(`Email for ${member.name}`);
                                setTimeout(() => setCopiedText(null), 2000);
                              }}
                              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                              title="Copy Email Address"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-6 text-slate-700 dark:text-slate-300">
                        <div className="flex items-center space-x-2">
                          {member.phone ? (
                            <>
                              <a
                                href={`tel:${member.phone.replace(/[^0-9+]/g, '')}`}
                                className="font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline flex items-center gap-1.5"
                              >
                                <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span>{member.phone}</span>
                              </a>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(member.phone);
                                  setCopiedText(`Phone for ${member.name}`);
                                  setTimeout(() => setCopiedText(null), 2000);
                                }}
                                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                title="Copy Phone Number"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <span className="text-slate-400 italic">Not listed</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredDirectory.length === 0 && (
              <div className="p-12 text-center rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
                <Search className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="font-heading font-bold text-slate-900 dark:text-white">
                  No Members Found
                </h3>
                <p className="text-xs text-slate-500">
                  No member matches "{dirSearchTerm}". Try searching by another name, phone number, or email address.
                </p>
                <button
                  onClick={() => setDirSearchTerm('')}
                  className="px-4 py-2 rounded-xl bg-optimist-blue text-white text-xs font-bold shadow"
                >
                  Clear Search Filter
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Internal Documents */}
        {dashboardTab === 'resources' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
                Member Resources & Meeting Minutes
              </h2>
              {['super admin', 'admin', 'finance'].includes(currentUser?.access) && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDocUploadModal(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-optimist-blue hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Document / Minutes</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {internalDocs.map((doc) => {
                return (
                  <div key={doc.id} className="rounded-2xl glass-card border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all">
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-start space-x-3">
                        <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-500 border border-amber-400/20 shrink-0">
                          <FileText className="w-5 h-5 text-optimist-blue" />
                        </div>
                        <div>
                          <strong className="block font-heading font-bold text-sm text-slate-900 dark:text-white">
                            {doc.name}
                          </strong>
                          <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300">
                              {doc.category || 'Official Record'}
                            </span>
                            <span>• {doc.date}</span>
                            <span>• {doc.size}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedDocModal(doc);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold flex items-center gap-1 transition-all shadow cursor-pointer"
                          title="View & Preview Document Content in Reader Window"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadDocumentFile(doc)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold hover:bg-optimist-blue hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                          title="Download File to Computer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                    Pay Annual Membership Dues ($250)
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Annual dues ($250.00 / year) support club operations, Caribbean District registration, and primary school student projects in Barbados.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={handlePayDues}
                      className="px-5 py-3 rounded-xl gold-gradient text-slate-950 font-bold text-xs shadow hover:brightness-110 transition-all flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Pay Dues & Update Record ($250)</span>
                    </button>

                    {canAccessTreasurerConsole && (
                      <button
                        onClick={() => setDashboardTab('treasurer')}
                        className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow transition-colors flex items-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>View Members Dues Roster</span>
                      </button>
                    )}

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
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">$250.00 Paid</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div>
                      <strong className="block text-slate-900 dark:text-white">2024/2025 Optimist Year (Oct 1 - Sep 30)</strong>
                      <span className="text-slate-400">Processed October 2024</span>
                    </div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">$250.00 Paid</span>
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

            {/* Member Ledger Table with Notes & Email Buttons */}
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
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">Upload to Shared Members Photos</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-2">
                Photo is uploaded to the club's shared Google Photos album (max 5 MB).
              </p>

              <form onSubmit={submitPhoto} className="space-y-4">
                {photoUploadError && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800 text-xs font-semibold flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{photoUploadError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Photo Title *</label>
                  <input
                    type="text"
                    value={photoTitle}
                    onChange={e => setPhotoTitle(e.target.value)}
                    placeholder="e.g. Kite Workshop at Westbury"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none"
                    disabled={photoUploading}
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
                    disabled={photoUploading}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Select Photo File</label>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp, image/gif"
                    onChange={handlePhotoUpload}
                    className="w-full text-xs text-slate-500"
                    disabled={photoUploading}
                  />
                </div>

                {photoPreview && (
                  <img src={photoPreview} alt="Preview" className="h-32 w-full object-cover rounded-xl border" />
                )}

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => { setPhotoUploadModal(false); setPhotoUploadError(''); }}
                    disabled={photoUploading}
                    className="px-4 py-2 rounded-xl text-xs font-bold border disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={photoUploading}
                    className="px-4 py-2 rounded-xl bg-optimist-blue text-white text-xs font-bold shadow flex items-center gap-1.5 disabled:opacity-60"
                  >
                    {photoUploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {photoUploading ? 'Uploading to Google Photos…' : 'Save Photo'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DOCUMENT UPLOAD MODAL FOR EXECUTIVE OFFICERS */}
        {docUploadModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-optimist-blue" />
                  <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
                    Upload Internal Document & Minutes
                  </h3>
                </div>
                <button
                  onClick={() => setDocUploadModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold text-lg"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!docName.trim()) return;
                  const newDoc = {
                    id: `doc-${Date.now()}`,
                    name: docName.trim(),
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    size: '410 KB',
                    category: docCategory,
                    author: currentUser?.name || 'Club Executive Officer',
                    summary: `Official document "${docName.trim()}" uploaded to member area by ${currentUser?.name || 'Executive Committee'}.`,
                    content: `OFFICIAL RECORD: ${docName.trim().toUpperCase()}\n\nUploaded on ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} by ${currentUser?.name || 'Executive Officer'}.\nCategory: ${docCategory}.\nStatus: Active Record.`
                  };
                  setInternalDocs([newDoc, ...internalDocs]);
                  setDocName('');
                  setDocUploadModal(false);
                  alert(`Successfully uploaded "${newDoc.name}" to Internal Documents & Minutes!`);
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Document / Minutes Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Monthly Meeting Minutes - October 2025"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Document Category *
                  </label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                  >
                    <option value="Meeting Minutes">Meeting Minutes</option>
                    <option value="Governance & Bylaws">Governance & Bylaws</option>
                    <option value="Financial Reports">Financial Reports</option>
                    <option value="Event Schedules">Event Schedules & Rosters</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Select Document File (PDF / Word / Excel) *
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-optimist-blue file:text-white hover:file:bg-blue-700 cursor-pointer"
                  />
                </div>

                <div className="pt-3 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setDocUploadModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-optimist-blue hover:bg-blue-700 text-white font-bold text-xs shadow cursor-pointer"
                  >
                    Upload Document
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DOCUMENT PREVIEW MODAL */}
        {selectedDocModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200 my-8 max-h-[90vh] flex flex-col justify-between">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
                <div className="space-y-1 pr-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-optimist-blue text-white">
                      {selectedDocModal.category || 'Official Document'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{selectedDocModal.size}</span>
                  </div>
                  <h3 className="font-heading font-black text-xl text-slate-900 dark:text-white">
                    {selectedDocModal.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Published by <strong className="text-slate-800 dark:text-slate-200">{selectedDocModal.author || 'Club Executive Committee'}</strong> on {selectedDocModal.date}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDocModal(null)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white font-bold transition-colors shrink-0 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Document Body & Viewer Frame */}
              <div className="space-y-4 overflow-y-auto pr-1 flex-1">
                {/* Executive Summary */}
                {selectedDocModal.summary && (
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 dark:text-amber-300 block">
                      Executive Summary & Highlights
                    </span>
                    <p className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
                      {selectedDocModal.summary}
                    </p>
                  </div>
                )}

                {/* Reader Document Paper Frame */}
                <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 shadow-inner font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap max-h-[50vh] overflow-y-auto pr-3">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 font-sans uppercase tracking-widest font-bold">
                    <span>Optimist International • Club # 78008</span>
                    <span>Official Internal Record</span>
                  </div>
                  <div>
                    {selectedDocModal.content || (
                      <div className="py-8 text-center text-slate-500 font-sans space-y-2">
                        <FileText className="w-10 h-10 text-optimist-blue mx-auto opacity-70" />
                        <p className="font-bold">Full PDF / Document Reader Stream Available</p>
                        <p className="text-xs text-slate-400">Click "Download Attachment" below to view complete raw file.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Document</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedDocModal(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Close Viewer
                  </button>
                  <button
                    onClick={() => downloadDocumentFile(selectedDocModal)}
                    className="px-5 py-2 rounded-xl bg-optimist-blue hover:bg-blue-700 text-white font-bold text-xs shadow flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Attachment</span>
                  </button>
                </div>
              </div>
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
          Log in to publish new project posts, manage annual dues ($250 / year), and upload activity photos to the website, or apply for new membership with the Barbados club.
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
            Become a Member
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
          <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <Users className="w-6 h-6 text-optimist-blue" />
            <div>
              <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
                ProgressiveOCB Membership Application
              </h2>
              <p className="text-xs text-slate-500">
                Please complete this form to apply for membership with the Progressive Optimist Club of Barbados.
              </p>
            </div>
          </div>

          {appSuccess ? (
            <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 text-center space-y-4 shadow border border-emerald-300/30">
              <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
              <h3 className="font-heading font-black text-lg">Application Submitted Successfully!</h3>
              <p className="text-xs text-slate-600 dark:text-slate-350 max-w-md mx-auto leading-relaxed">
                Thank you for applying! Your membership application is currently pending review by the Membership Review Committee. Please check your email inbox to verify your address and create your portal password.
              </p>
            </div>
          ) : (
            <form onSubmit={handleAppSubmit} className="space-y-5">
              
              {/* Section 1: Contact Information */}
              <div className="space-y-4">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 flex items-center gap-1.5 w-fit">
                  Contact Information
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">First Name *</label>
                    <input
                      type="text"
                      value={appForm.firstName}
                      onChange={e => setAppForm({ ...appForm, firstName: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Last Name *</label>
                    <input
                      type="text"
                      value={appForm.lastName}
                      onChange={e => setAppForm({ ...appForm, lastName: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
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
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Whatsapp Number *</label>
                    <input
                      type="tel"
                      value={appForm.phone}
                      onChange={e => setAppForm({ ...appForm, phone: e.target.value })}
                      placeholder="(246) 000-0000"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Address */}
              <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 flex items-center gap-1.5 w-fit">
                  Postal Address
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Street Address *</label>
                    <input
                      type="text"
                      value={appForm.addressLine1}
                      onChange={e => setAppForm({ ...appForm, addressLine1: e.target.value })}
                      placeholder="e.g. 1st Avenue Belleville"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Street Address Line 2</label>
                    <input
                      type="text"
                      value={appForm.addressLine2}
                      onChange={e => setAppForm({ ...appForm, addressLine2: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Village / City</label>
                    <input
                      type="text"
                      value={appForm.village}
                      onChange={e => setAppForm({ ...appForm, village: e.target.value })}
                      placeholder="e.g. Bridgetown"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Parish *</label>
                    <input
                      type="text"
                      value={appForm.parish}
                      onChange={e => setAppForm({ ...appForm, parish: e.target.value })}
                      placeholder="e.g. St. Michael"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Country</label>
                    <input
                      type="text"
                      value={appForm.country}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs outline-none"
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Profile Details */}
              <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 flex items-center gap-1.5 w-fit">
                  Applicant Profile
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      value={appForm.dob}
                      onChange={e => setAppForm({ ...appForm, dob: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Gender *</label>
                    <div className="flex gap-4 pt-2.5">
                      {['Male', 'Female', 'Other'].map(g => (
                        <label key={g} className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value={g}
                            checked={appForm.gender === g}
                            onChange={e => setAppForm({ ...appForm, gender: e.target.value })}
                            className="text-optimist-blue focus:ring-optimist-blue w-3.5 h-3.5"
                          />
                          <span>{g}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Occupation / Profession</label>
                    <input
                      type="text"
                      value={appForm.occupation}
                      onChange={e => setAppForm({ ...appForm, occupation: e.target.value })}
                      placeholder="e.g. Attorney, Educator"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Employer / School</label>
                    <input
                      type="text"
                      value={appForm.employer}
                      onChange={e => setAppForm({ ...appForm, employer: e.target.value })}
                      placeholder="e.g. Barbados Ministry of Education"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">How did you hear about us?</label>
                    <select
                      value={appForm.hearAboutUs}
                      onChange={e => setAppForm({ ...appForm, hearAboutUs: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none font-semibold text-slate-800 dark:text-slate-200"
                    >
                      <option value="Social Media">Social Media</option>
                      <option value="Referral">Referral</option>
                      <option value="Website">Website</option>
                      <option value="Flyer/Poster">Flyer/Poster</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {appForm.hearAboutUs === 'Referral' && (
                    <div className="animate-fadeIn">
                      <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Referrer's Name *</label>
                      <input
                        type="text"
                        value={appForm.referrerName}
                        onChange={e => setAppForm({ ...appForm, referrerName: e.target.value })}
                        placeholder="Enter the name of the member who referred you"
                        className="w-full px-3.5 py-2 rounded-xl border border-amber-400 dark:border-amber-400 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                        required
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">Comments / Notes</label>
                  <textarea
                    rows={3}
                    value={appForm.comments}
                    onChange={e => setAppForm({ ...appForm, comments: e.target.value })}
                    placeholder="Share any special skills, areas of interest, or additional comments..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-optimist-blue outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl gold-gradient text-slate-950 font-black text-xs shadow hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Submit Membership Application</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* EMAIL VERIFICATION & PASSWORD SETUP FORM */}
      {authTab === 'verify' && (
        <div className="p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 shadow-xl max-w-lg mx-auto space-y-6">
          <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 animate-pulse" />
            <div>
              <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
                Verify Email & Create Password
              </h2>
              <p className="text-xs text-slate-500">
                Set your secure password to complete your membership registration.
              </p>
            </div>
          </div>

          {verifySuccess ? (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-heading font-bold text-lg">Email Verified!</h3>
              <p className="text-xs text-slate-600 dark:text-slate-350">
                Your password has been successfully saved. Your application is now pending review by the Membership Review Committee. Redirecting you to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={verifyEmail}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-850 text-slate-500 text-xs outline-none"
                  disabled
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Create Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={verifyPassword}
                    onChange={e => setVerifyPassword(e.target.value)}
                    placeholder="Enter secure password (min 6 chars)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-optimist-blue font-mono"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {verifyError && (
                <p className="text-xs font-bold text-rose-500 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                  {verifyError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl gold-gradient text-slate-950 font-black text-xs shadow hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Verify Account & Set Password</span>
              </button>
            </form>
          )}
        </div>
      )}

    </div>
  );
};
