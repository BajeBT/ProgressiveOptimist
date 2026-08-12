import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProjects } from '../data/projectsData';
import { getDefaultAvatarForRole } from '../../lib/roles';

const AuthContext = createContext();

// Every database call now goes through the serverless routes under /api. The
// browser no longer holds database credentials, and the session token issued at
// login is what the routes use to decide what the caller may do.
const SESSION_TOKEN_KEY = 'optimist_token';

function readToken() {
  try {
    return localStorage.getItem(SESSION_TOKEN_KEY) || '';
  } catch (e) {
    return '';
  }
}

async function api(path, { method = 'GET', body } = {}) {
  const token = readToken();
  const res = await fetch(`/api/${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });

  let data = {};
  try {
    data = await res.json();
  } catch (e) {
    // A non-JSON body means the route failed before it could respond properly.
  }
  return { ok: res.ok, status: res.status, ...data };
}

const initialRoster = [
  {
    "id": "78008-0153",
    "name": "Deborah Bayne",
    "email": "deborahbayne46@gmail.com",
    "role": "Club Board of Director",
    "fiscalYear": "2025/2026 (Oct 1 - Sep 30)",
    "duesRate": "$250.00 BBD",
    "amountPaid": "$250.00 BBD",
    "balanceDue": "$0.00 BBD",
    "paymentMethod": "Bank Transfer",
    "duesStatus": "Active Member (2025/2026)",
    "lastPaymentDate": "2025-10-01",
    "notes": "Joined: 06/02/2025 | Sponsor: Lucas, Richelle (78008-0150) | Birthday: July 7, 1971",
    "emailLastSent": "2025-10-01",
    "hasTreasurerConsoleAccess": false,
    "hasInitiativeAccess": false,
    "access": "member"
  },
  {
    "id": "78008-0148",
    "name": "Lisa Brome",
    "email": "lisa.brome@gmail.com",
    "role": "Active Member",
    "fiscalYear": "2025/2026 (Oct 1 - Sep 30)",
    "duesRate": "$250.00 BBD",
    "amountPaid": "$250.00 BBD",
    "balanceDue": "$0.00 BBD",
    "paymentMethod": "Bank Transfer",
    "duesStatus": "Active Member (2025/2026)",
    "lastPaymentDate": "2025-10-01",
    "notes": "Joined: 09/30/2022 | Sponsor: Goodridge, Shaina (78008-0064)",
    "emailLastSent": "2025-10-01",
    "hasTreasurerConsoleAccess": false,
    "hasInitiativeAccess": false,
    "access": "member"
  },
  {
    "id": "78008-0093",
    "name": "Joy-Ann M Codrington",
    "email": "jamacod@hotmail.com",
    "role": "Active Member",
    "fiscalYear": "2025/2026 (Oct 1 - Sep 30)",
    "duesRate": "$250.00 BBD",
    "amountPaid": "$250.00 BBD",
    "balanceDue": "$0.00 BBD",
    "paymentMethod": "Bank Transfer",
    "duesStatus": "Active Member (2025/2026)",
    "lastPaymentDate": "2025-10-01",
    "notes": "Joined: 07/28/2016 | Sponsor: Parris, Rozanne (78008-0068)",
    "emailLastSent": "2025-10-01",
    "hasTreasurerConsoleAccess": false,
    "hasInitiativeAccess": false,
    "access": "member"
  },
  {
    "id": "78008-0121",
    "name": "Omolara De Riggs-Morris",
    "email": "onderiggs@hotmail.com",
    "role": "Club Board of Director",
    "fiscalYear": "2025/2026 (Oct 1 - Sep 30)",
    "duesRate": "$250.00 BBD",
    "amountPaid": "$250.00 BBD",
    "balanceDue": "$0.00 BBD",
    "paymentMethod": "Bank Transfer",
    "duesStatus": "Active Member (2025/2026)",
    "lastPaymentDate": "2025-10-01",
    "notes": "Joined: 07/05/2018 | Sponsor: Bostic, Jennifer (78008-0079) | Birthday: September 20,",
    "emailLastSent": "2025-10-01",
    "hasTreasurerConsoleAccess": false,
    "hasInitiativeAccess": false,
    "access": "member"
  },
  {
    "id": "78008-0052",
    "name": "Maureen E Dottin",
    "email": "medottin@gmail.com",
    "role": "Active Member",
    "fiscalYear": "2025/2026 (Oct 1 - Sep 30)",
    "duesRate": "$250.00 BBD",
    "amountPaid": "$250.00 BBD",
    "balanceDue": "$0.00 BBD",
    "paymentMethod": "Bank Transfer",
    "duesStatus": "Active Member (2025/2026)",
    "lastPaymentDate": "2025-10-01",
    "notes": "Joined: 11/11/2013 | Sponsor: Charter Member",
    "emailLastSent": "2025-10-01",
    "hasTreasurerConsoleAccess": false,
    "hasInitiativeAccess": false,
    "access": "member"
  },
  {
    "id": "78008-0062",
    "name": "Elizabeth C Franklin",
    "email": "elizabeth_franklin@sagicor.com",
    "role": "Active Member",
    "fiscalYear": "2025/2026 (Oct 1 - Sep 30)",
    "duesRate": "$250.00 BBD",
    "amountPaid": "$250.00 BBD",
    "balanceDue": "$0.00 BBD",
    "paymentMethod": "Bank Transfer",
    "duesStatus": "Active Member (2025/2026)",
    "lastPaymentDate": "2025-10-01",
    "notes": "Joined: 05/26/2014 | Sponsor: Byer, Faye (78008-0048) | Birthday: February 15,",
    "emailLastSent": "2025-10-01",
    "hasTreasurerConsoleAccess": false,
    "hasInitiativeAccess": false,
    "access": "member"
  },
  {
    "id": "78008-0017",
    "name": "Carmel Haynes",
    "email": "carmelhaynes@yahoo.com",
    "role": "Active Member & Charter Member",
    "fiscalYear": "2025/2026 (Oct 1 - Sep 30)",
    "duesRate": "$250.00 BBD",
    "amountPaid": "$250.00 BBD",
    "balanceDue": "$0.00 BBD",
    "paymentMethod": "Bank Transfer",
    "duesStatus": "Active Member (2025/2026)",
    "lastPaymentDate": "2025-10-01",
    "notes": "Joined: 05/27/2010 | Sponsor: Charter Member | Program: Four-for-1, Free Member (expired)",
    "emailLastSent": "2025-10-01",
    "hasTreasurerConsoleAccess": false,
    "hasInitiativeAccess": false,
    "access": "member"
  },
  {
    "id": "78008-0142",
    "name": "Alicia Holder",
    "email": "holder_alicia@hotmail.com",
    "role": "Active Member",
    "fiscalYear": "2025/2026 (Oct 1 - Sep 30)",
    "duesRate": "$250.00 BBD",
    "amountPaid": "$250.00 BBD",
    "balanceDue": "$0.00 BBD",
    "paymentMethod": "Bank Transfer",
    "duesStatus": "Active Member (2025/2026)",
    "lastPaymentDate": "2025-10-01",
    "notes": "Joined: 06/09/2020 | Sponsor: Goodridge, Shaina (78008-0064) | Birthday: March 26,",
    "emailLastSent": "2025-10-01",
    "hasTreasurerConsoleAccess": false,
    "hasInitiativeAccess": false,
    "access": "member"
  },
  {
    "id": "78008-0072",
    "name": "Shirley Hoyte",
    "email": "shirleyhoyte@hotmail.com",
    "role": "Active Member",
    "fiscalYear": "2025/2026 (Oct 1 - Sep 30)",
    "duesRate": "$250.00 BBD",
    "amountPaid": "$250.00 BBD",
    "balanceDue": "$0.00 BBD",
    "paymentMethod": "Bank Transfer",
    "duesStatus": "Active Member (2025/2026)",
    "lastPaymentDate": "2025-10-01",
    "notes": "Joined: 08/31/2015 | Sponsor: Aquan, Margot (78008-0039) | PGI: Level 5: 2020-06-08",
    "emailLastSent": "2025-10-01",
    "hasTreasurerConsoleAccess": false,
    "hasInitiativeAccess": false,
    "access": "member"
  },
  {
    "id": "78008-0087",
    "name": "Stephanie C Layne",
    "email": "stephanieclayne@gmail.com",
    "role": "Active Member & Charter Member",
    "fiscalYear": "2025/2026 (Oct 1 - Sep 30)",
    "duesRate": "$250.00 BBD",
    "amountPaid": "$250.00 BBD",
    "balanceDue": "$0.00 BBD",
    "paymentMethod": "Bank Transfer",
    "duesStatus": "Active Member (2025/2026)",
    "lastPaymentDate": "2025-10-01",
    "notes": "Joined: 05/20/2016 | Sponsor: Charter Member | Birthday: October 13,",
    "emailLastSent": "2025-10-01",
    "hasTreasurerConsoleAccess": false,
    "hasInitiativeAccess": false,
    "access": "member"
  },
  {
    "id": "78008-0010",
    "name": "Charmaine London",
    "email": "londoncharms@hotmail.com",
    "role": "Club Secretary & Charter Member",
    "fiscalYear": "2025/2026 (Oct 1 - Sep 30)",
    "duesRate": "$250.00 BBD",
    "amountPaid": "$250.00 BBD",
    "balanceDue": "$0.00 BBD",
    "paymentMethod": "Bank Transfer",
    "duesStatus": "Active Member (2025/2026)",
    "lastPaymentDate": "2025-10-01",
    "notes": "Joined: 05/27/2010 | Sponsor: Charter Member",
    "emailLastSent": "2025-10-01",
    "hasTreasurerConsoleAccess": false,
    "hasInitiativeAccess": false,
    "access": "admin"
  },
  {
    "id": "78008-0150",
    "name": "Richelle Lucas",
    "email": "richelle.lucas16@gmail.com",
    "role": "Club President",
    "fiscalYear": "2025/2026 (Oct 1 - Sep 30)",
    "duesRate": "$250.00 BBD",
    "amountPaid": "$250.00 BBD",
    "balanceDue": "$0.00 BBD",
    "paymentMethod": "Bank Transfer",
    "duesStatus": "Active Member (2025/2026)",
    "lastPaymentDate": "2025-10-01",
    "notes": "Joined: 12/26/2023 | Sponsor: Sobers, Cameron (78008-0038) | Birthday: June 16,",
    "emailLastSent": "2025-10-01",
    "hasTreasurerConsoleAccess": true,
    "hasInitiativeAccess": true,
    "access": "super admin"
  },
  {
    "id": "78008-0152",
    "name": "Sharon Mohammed",
    "email": "sharon@topaz-bb.com",
    "role": "Club Treasurer",
    "fiscalYear": "2025/2026 (Oct 1 - Sep 30)",
    "duesRate": "$250.00 BBD",
    "amountPaid": "$250.00 BBD",
    "balanceDue": "$0.00 BBD",
    "paymentMethod": "Bank Transfer",
    "duesStatus": "Active Member (2025/2026)",
    "lastPaymentDate": "2025-10-01",
    "notes": "Joined: 04/14/2025 | Sponsor: Workman, Edwin (78008-0021) | Birthday: July 26, 1976",
    "emailLastSent": "2025-10-01",
    "hasTreasurerConsoleAccess": true,
    "hasInitiativeAccess": true,
    "access": "finance"
  },
  {
    "id": "78008-0069",
    "name": "Aisha Norville",
    "email": "aimichelle.nor@gmail.com",
    "role": "Active Member",
    "fiscalYear": "2025/2026 (Oct 1 - Sep 30)",
    "duesRate": "$250.00 BBD",
    "amountPaid": "$250.00 BBD",
    "balanceDue": "$0.00 BBD",
    "paymentMethod": "Bank Transfer",
    "duesStatus": "Active Member (2025/2026)",
    "lastPaymentDate": "2025-10-01",
    "notes": "Joined: 08/31/2015 | Sponsor: Lucas, Richelle (78008-0042)",
    "emailLastSent": "2025-10-01",
    "hasTreasurerConsoleAccess": false,
    "hasInitiativeAccess": false,
    "access": "member"
  },
  {
    "id": "78008-0068",
    "name": "Rozanne A Parris",
    "email": "rozanne.parris@gmail.com",
    "role": "Active Member",
    "fiscalYear": "2025/2026 (Oct 1 - Sep 30)",
    "duesRate": "$250.00 BBD",
    "amountPaid": "$250.00 BBD",
    "balanceDue": "$0.00 BBD",
    "paymentMethod": "Bank Transfer",
    "duesStatus": "Active Member (2025/2026)",
    "lastPaymentDate": "2025-10-01",
    "notes": "Joined: 08/31/2015 | Sponsor: Dottin, Maureen (78008-0052)",
    "emailLastSent": "2025-10-01",
    "hasTreasurerConsoleAccess": false,
    "hasInitiativeAccess": false,
    "access": "member"
  },
  {
    "id": "78008-0098",
    "name": "Hyacinth E Small",
    "email": "windychile@hotmail.com",
    "role": "Active Member",
    "fiscalYear": "2025/2026 (Oct 1 - Sep 30)",
    "duesRate": "$250.00 BBD",
    "amountPaid": "$250.00 BBD",
    "balanceDue": "$0.00 BBD",
    "paymentMethod": "Bank Transfer",
    "duesStatus": "Active Member (2025/2026)",
    "lastPaymentDate": "2025-10-01",
    "notes": "Joined: 01/31/2017 | Sponsor: Workman, Edwin (78008-0021)",
    "emailLastSent": "2025-10-01",
    "hasTreasurerConsoleAccess": false,
    "hasInitiativeAccess": false,
    "access": "member"
  },
  {
    "id": "78008-0038",
    "name": "Cameron P Sobers",
    "email": "Cposobers@gmail.com",
    "role": "Club Board of Director",
    "fiscalYear": "2025/2026 (Oct 1 - Sep 30)",
    "duesRate": "$250.00 BBD",
    "amountPaid": "$250.00 BBD",
    "balanceDue": "$0.00 BBD",
    "paymentMethod": "Bank Transfer",
    "duesStatus": "Active Member (2025/2026)",
    "lastPaymentDate": "2025-10-01",
    "notes": "Joined: 06/14/2010 | Sponsor: Carter, Joy-Ann (78008-0001) | Birthday: February 15, 1969",
    "emailLastSent": "2025-10-01",
    "hasTreasurerConsoleAccess": false,
    "hasInitiativeAccess": false,
    "access": "member"
  },
  {
    "id": "78008-0114",
    "name": "Garrylyn Swanston",
    "email": "lynswanston@yahoo.com",
    "role": "Active Member",
    "fiscalYear": "2025/2026 (Oct 1 - Sep 30)",
    "duesRate": "$250.00 BBD",
    "amountPaid": "$250.00 BBD",
    "balanceDue": "$0.00 BBD",
    "paymentMethod": "Bank Transfer",
    "duesStatus": "Active Member (2025/2026)",
    "lastPaymentDate": "2025-10-01",
    "notes": "Joined: 08/08/2017 | Sponsor: Aquan, Margot (78008-0039) | Program: Recruit a Teacher, Free Member (expired) | Birthday: December 2,",
    "emailLastSent": "2025-10-01",
    "hasTreasurerConsoleAccess": false,
    "hasInitiativeAccess": false,
    "access": "member"
  },
  {
    "id": "78008-0120",
    "name": "Yolanda Thorpe",
    "email": "whytee.ypt@gmail.com",
    "role": "Active Member",
    "fiscalYear": "2025/2026 (Oct 1 - Sep 30)",
    "duesRate": "$250.00 BBD",
    "amountPaid": "$250.00 BBD",
    "balanceDue": "$0.00 BBD",
    "paymentMethod": "Bank Transfer",
    "duesStatus": "Active Member (2025/2026)",
    "lastPaymentDate": "2025-10-01",
    "notes": "Joined: 07/05/2018 | Sponsor: Dottin, Maureen (78008-0052) | Birthday: April 23,",
    "emailLastSent": "2025-10-01",
    "hasTreasurerConsoleAccess": false,
    "hasInitiativeAccess": false,
    "access": "member"
  },
  {
    "id": "78008-0108",
    "name": "Nicole Whiteman",
    "email": "nicoleantoniawhiteman@hotmail.com",
    "role": "Active Member",
    "fiscalYear": "2025/2026 (Oct 1 - Sep 30)",
    "duesRate": "$250.00 BBD",
    "amountPaid": "$250.00 BBD",
    "balanceDue": "$0.00 BBD",
    "paymentMethod": "Bank Transfer",
    "duesStatus": "Active Member (2025/2026)",
    "lastPaymentDate": "2025-10-01",
    "notes": "Joined: 07/17/2017 | Sponsor: Dottin, Maureen (78008-0052) | Program: 30 under 30 Member, Free Member (expired) | Birthday: July 3, 1994",
    "emailLastSent": "2025-10-01",
    "hasTreasurerConsoleAccess": false,
    "hasInitiativeAccess": false,
    "access": "member"
  },
  {
    "id": "78008-0021",
    "name": "Edwin Workman",
    "email": "edwin@jillandee.com",
    "role": "System Administrator, Club Foundation Representative & Charter Member",
    "fiscalYear": "2025/2026 (Oct 1 - Sep 30)",
    "duesRate": "$250.00 BBD",
    "amountPaid": "$250.00 BBD",
    "balanceDue": "$0.00 BBD",
    "paymentMethod": "Bank Transfer",
    "duesStatus": "Active Member (2025/2026)",
    "lastPaymentDate": "2025-10-01",
    "notes": "Joined: 05/27/2010 | Sponsor: Charter Member",
    "emailLastSent": "2025-10-01",
    "hasTreasurerConsoleAccess": true,
    "hasInitiativeAccess": true,
    "avatar": "/avatars/oirep_placeholder.jpg",
    "access": "super admin"
  }
];

const defaultPrimaryInitiatives = [
  "RISE Summer Experience & Challenge",
  "Easter Cheer Kite Giveaway (Westbury & Ignatius Byer Primary)",
  "Laptop & Tablet Fundraiser for Students",
  "Mini Millionaires in the Making Mentorship"
];

const defaultSiteSettings = {
  meetingSchedule: "1st Monday of every month at 5:30 PM (6:00 PM for Guests)",
  meetingVenue: "Ross University, Lloyd Erskine Sandiford Centre (LESC), Two Mile Hill, St. Michael, Barbados",
  contactEmail: "info@progressiveoptimist.org",
  annualDuesRate: "$200.00",
  themeTitle: "C.A.R.E – Championing Authentic & Reinvigorating Engagement"
};

export const AuthProvider = ({ children }) => {
  // Sandbox & Email Rerouting Configuration
  const isSandboxMode = false;
  const testEmailTarget = "dev@bajanthings.biz";
  const testWhatsAppTarget = "12468366185";
  const [dbConnected, setDbConnected] = useState(false);

  // Site Variables & Primary Initiatives state
  const [primaryInitiatives, setPrimaryInitiatives] = useState(() => {
    try {
      const saved = localStorage.getItem('optimist_initiatives');
      return saved ? JSON.parse(saved) : defaultPrimaryInitiatives;
    } catch (e) {
      return defaultPrimaryInitiatives;
    }
  });

  const [siteSettings, setSiteSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('optimist_site_settings');
      return saved ? JSON.parse(saved) : defaultSiteSettings;
    } catch (e) {
      return defaultSiteSettings;
    }
  });

  // Current user state (with try-catch safety)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('optimist_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.warn("Failed to parse optimist_user from localStorage", e);
      return null;
    }
  });

  // Projects state
  const [projects, setProjects] = useState(() => {
    try {
      const savedProjects = localStorage.getItem('optimist_projects');
      return savedProjects ? JSON.parse(savedProjects) : initialProjects;
    } catch (e) {
      console.warn("Failed to parse optimist_projects from localStorage", e);
      return initialProjects;
    }
  });

  // Member Roster (Treasurer Ledger & Access Control)
  const [memberRoster, setMemberRoster] = useState(() => {
    try {
      const savedRoster = localStorage.getItem('optimist_roster');
      const roster = savedRoster ? JSON.parse(savedRoster) : initialRoster;
      const unique = Array.from(new Map(roster.map(m => [m.id, m])).values());
      return unique.map(m => ({
        ...m,
        duesRate: m.duesRate ? m.duesRate.replace(' BBD', '') : '$200.00',
        amountPaid: m.amountPaid ? m.amountPaid.replace(' BBD', '') : '$0.00',
        balanceDue: m.balanceDue ? m.balanceDue.replace(' BBD', '') : '$0.00'
      }));
    } catch (e) {
      const uniqueInit = Array.from(new Map(initialRoster.map(m => [m.id, m])).values());
      return uniqueInit.map(m => ({
        ...m,
        duesRate: m.duesRate ? m.duesRate.replace(' BBD', '') : '$200.00',
        amountPaid: m.amountPaid ? m.amountPaid.replace(' BBD', '') : '$0.00',
        balanceDue: m.balanceDue ? m.balanceDue.replace(' BBD', '') : '$0.00'
      }));
    }
  });

  // Member photo uploads gallery (backed by Google Photos; see api/gallery-*.js).
  // localStorage is only a same-device cache for instant paint on repeat visits -
  // the real fetch below always overwrites it with live data.
  const [memberGallery, setMemberGallery] = useState(() => {
    try {
      const savedGallery = localStorage.getItem('optimist_gallery');
      return savedGallery ? JSON.parse(savedGallery) : [];
    } catch (e) {
      console.warn("Failed to parse optimist_gallery from localStorage", e);
      return [];
    }
  });

  // Contact page "Subject" dropdown options, admin-editable, Neon-backed
  // (not localStorage - needs to be the same for every visitor, not just
  // whichever browser an admin last edited it from).
  const [contactSubjects, setContactSubjects] = useState([]);

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem('optimist_theme') === 'dark';
    } catch (e) {
      return false;
    }
  });

  // Load live data through the API routes on mount. Signed-out visitors get a
  // reduced member record (no email, phone, address or dues figures) - the
  // route decides that, not the client.
  const loadRoster = async () => {
    const res = await api('members');
    if (!res.ok || !Array.isArray(res.members) || res.members.length === 0) return;

    const mappedRoster = res.members.map(r => {
      let resolvedAvatar = r.avatar;
      if (!resolvedAvatar || resolvedAvatar.includes('dicebear')) {
        resolvedAvatar = getDefaultAvatarForRole(r.role);
      }

      return {
        id: r.id,
        name: r.name,
        email: r.email || '',
        role: r.role,
        phone: r.phone || '',
        address: r.address || '',
        avatar: resolvedAvatar,
        access: r.access || 'member',
        approvalStatus: r.approval_status || 'approved',
        adminGrantedAt: r.admin_granted_at || null,
        addedBy: r.added_by || null,
        fiscalYear: r.fiscal_year || '2025/2026 (Oct 1 - Sep 30)',
        duesRate: r.dues_rate || '$200.00',
        amountPaid: r.amount_paid || '$0.00',
        balanceDue: r.balance_due || '$0.00',
        paymentMethod: r.payment_method || 'Bank Transfer',
        duesStatus: r.dues_status || 'Active Member (2025/2026)',
        lastPaymentDate: r.last_payment_date || '2025-10-01',
        notes: r.notes || '',
        emailLastSent: r.email_last_sent || '',
        hasTreasurerConsoleAccess: Boolean(r.is_treasurer),
        hasInitiativeAccess: Boolean(r.is_president),
        hasSecretaryAccess: Boolean(r.is_secretary)
      };
    });

    setMemberRoster(Array.from(new Map(mappedRoster.map(m => [m.id, m])).values()));
    setDbConnected(true);

    // Keep the signed-in user's own display fields in sync with the roster.
    // The session is cached in localStorage at login and never re-fetched on
    // its own, so an admin editing this member's name/role/avatar elsewhere
    // would otherwise stay invisible until the next login. access and
    // isTreasurer are deliberately excluded: those are only ever set by
    // login(), which applies the @progressiveoptimist.org domain rule and
    // grant-expiry check - syncing the roster's raw access here would bypass
    // that and could hand back elevated access a personal-email session
    // shouldn't have.
    setCurrentUser(prevUser => {
      if (!prevUser) return prevUser;
      const fresh = mappedRoster.find(m => m.id === prevUser.memberId);
      if (!fresh) return prevUser;

      const changed = fresh.name !== prevUser.name ||
        fresh.avatar !== prevUser.avatar ||
        fresh.role !== prevUser.role ||
        fresh.duesStatus !== prevUser.duesStatus;
      if (!changed) return prevUser;

      const updated = { ...prevUser, name: fresh.name, avatar: fresh.avatar, role: fresh.role, duesStatus: fresh.duesStatus };
      try {
        localStorage.setItem('optimist_user', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  useEffect(() => {
    async function loadData() {
      try {
        await loadRoster();
      } catch (err) {
        console.warn("Member roster fetch fallback to local cache:", err);
      }

      try {
        const res = await api('projects');
        if (res.ok && Array.isArray(res.projects) && res.projects.length > 0) {
          setProjects(res.projects.map(p => ({
            id: p.id,
            title: p.title,
            category: p.category,
            date: p.date_str,
            image: p.image,
            flyerUrl: p.flyer_url,
            excerpt: p.excerpt,
            content: p.content,
            impact: p.impact,
            isFeatured: p.is_featured,
            author: p.author,
            authorId: p.author_id,
            postedAt: p.posted_at,
            childrenServed: Number(p.children_served) || 0,
            approved: p.approved
          })));
        }
      } catch (err) {
        console.warn("Projects fetch fallback to local cache:", err);
      }
    }

    loadData();
  }, [currentUser?.memberId]);

  // Load the shared photo gallery (Google Photos, via api/gallery-list.js).
  // Kept independent of loadNeonData above so a gallery failure can never
  // block roster/project loading, or vice versa.
  useEffect(() => {
    async function loadGallery() {
      try {
        const res = await fetch('/api/gallery-list');
        const data = await res.json();
        if (res.ok && data.success) {
          setMemberGallery(data.photos);
        }
      } catch (err) {
        console.warn("Gallery fetch fallback to local cache:", err);
      }
    }
    loadGallery();
  }, []);

  // Load the Contact page's admin-editable subject options. Independent of
  // loadNeonData for the same reason as the gallery fetch above.
  useEffect(() => {
    async function loadContactSubjects() {
      try {
        const res = await api('contact-subjects');
        if (res.ok && Array.isArray(res.subjects) && res.subjects.length > 0) {
          setContactSubjects(res.subjects);
        }
      } catch (err) {
        console.warn("Contact subjects fetch fallback to default list:", err);
      }
    }
    loadContactSubjects();
  }, []);

  // Site Variables (Annual Dues Rate, meeting info, etc.) - shared across every
  // visitor via the database, not just cached in this browser's localStorage.
  useEffect(() => {
    async function loadSiteSettings() {
      try {
        const res = await api('site-settings');
        if (res.ok && res.settings) {
          setSiteSettings(res.settings);
        }
      } catch (err) {
        console.warn("Site settings fetch fallback to cached/default values:", err);
      }
    }
    loadSiteSettings();
  }, []);

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('optimist_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('optimist_theme', 'light');
      }
    } catch (e) {
      console.warn("Unable to write theme to localStorage", e);
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Save primary initiatives to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('optimist_initiatives', JSON.stringify(primaryInitiatives));
    } catch (e) {}
  }, [primaryInitiatives]);

  // Save site settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('optimist_site_settings', JSON.stringify(siteSettings));
    } catch (e) {}
  }, [siteSettings]);

  // Save projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('optimist_projects', JSON.stringify(projects));
    } catch (e) {}
  }, [projects]);

  // Save roster to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('optimist_roster', JSON.stringify(memberRoster));
    } catch (e) {}
  }, [memberRoster]);

  // Save gallery to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('optimist_gallery', JSON.stringify(memberGallery));
    } catch (e) {}
  }, [memberGallery]);

  // Update Primary Initiatives
  const updatePrimaryInitiatives = (newList) => {
    setPrimaryInitiatives(newList);
  };

  // Update Site Settings
  const updateSiteSettings = (newSettings) => {
    const merged = { ...siteSettings, ...newSettings };
    setSiteSettings(merged);

    (async () => {
      try {
        const res = await api('site-settings', { method: 'POST', body: { settings: merged } });
        if (!res.ok || !res.success) {
          console.warn("Site settings save error:", res.message);
        }
      } catch (err) {
        console.warn("Site settings save error:", err);
      }
    })();
  };

  // Update Member Permissions Matrix
  const updateMemberPermissions = (memberId, permissionKey, val) => {
    setMemberRoster(prev => prev.map(m => {
      if (m.id === memberId) {
        return { ...m, [permissionKey]: val };
      }
      return m;
    }));

    (async () => {
      try {
        await api('members', {
          method: 'POST',
          body: { action: 'update-permission', memberId, key: permissionKey, value: val }
        });
      } catch (err) {
        console.warn("Permission sync error:", err);
      }
    })();
  };

  // Full Roster Member Record Update (Syncs to DB)
  const updateMemberRecord = (memberId, updatedFields) => {
    setMemberRoster(prev => prev.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          ...updatedFields
        };
      }
      return m;
    }));

    (async () => {
      try {
        await api('members', {
          method: 'POST',
          body: { action: 'update-record', memberId, fields: updatedFields }
        });
      } catch (err) {
        console.warn("Member update sync error:", err);
      }
    })();
  };

  // Login handler. All checks happen server-side in api/auth.js - the account
  // must exist in the members table, the password is compared against a bcrypt
  // hash, and the access tier comes back resolved for the address used.
  const login = async (email, password) => {
    if (!email || !password) {
      return { success: false, message: 'Please provide both email and password.' };
    }

    let res;
    try {
      res = await api('auth', { method: 'POST', body: { action: 'login', email, password } });
    } catch (err) {
      console.error("Login request failed:", err);
      return { success: false, message: 'Network error. Please try again.' };
    }

    if (!res.ok || !res.success) {
      return {
        success: false,
        message: res.message || 'Unable to sign in. Please try again.',
        needsPasswordSetup: Boolean(res.needsPasswordSetup)
      };
    }

    setCurrentUser(res.user);
    try {
      localStorage.setItem('optimist_user', JSON.stringify(res.user));
      localStorage.setItem(SESSION_TOKEN_KEY, res.token);
    } catch (e) {}

    return { success: true, user: res.user };
  };

  // Public membership application. The record is created server-side as
  // pending_verification and a single-use link is emailed to the applicant.
  const registerMember = async (formData) => {
    try {
      const res = await api('auth', { method: 'POST', body: { action: 'register', form: formData } });
      if (!res.ok || !res.success) {
        return { success: false, message: res.message || 'Unable to submit your application. Please try again.' };
      }
      return { success: true, message: res.message };
    } catch (err) {
      console.error("Registration request failed:", err);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  // Sets a password from an emailed single-use link. Serves both a new
  // applicant verifying their address and an existing member who never had one.
  const setMemberPassword = async (email, token, password) => {
    try {
      const res = await api('auth', {
        method: 'POST',
        body: { action: 'set-password', email, token, password }
      });
      if (!res.ok || !res.success) {
        return { success: false, message: res.message || 'Unable to set your password.' };
      }
      return { success: true, message: res.message };
    } catch (err) {
      console.error("Set password request failed:", err);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  // Emails a fresh set-password link on request.
  const requestPasswordSetup = async (email) => {
    try {
      const res = await api('auth', { method: 'POST', body: { action: 'request-password-setup', email } });
      return { success: Boolean(res.success), message: res.message };
    } catch (err) {
      console.error("Password setup request failed:", err);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  // Self-service: the signed-in member changing their own password.
  const changeMyPassword = async (currentPassword, newPassword) => {
    try {
      const res = await api('auth', {
        method: 'POST',
        body: { action: 'change-password', currentPassword, newPassword }
      });
      return { success: Boolean(res.success), message: res.message };
    } catch (err) {
      console.error("Change password request failed:", err);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  // Admin-entered members, one at a time or several at once. The server decides
  // whether they are active immediately (added by the Treasurer) or need an
  // officer's approval first.
  const addMembers = async (entries) => {
    const list = Array.isArray(entries) ? entries : [entries];
    try {
      const res = await api('members', {
        method: 'POST',
        body: list.length === 1
          ? { action: 'add', member: list[0] }
          : { action: 'bulk-add', members: list }
      });
      if (res.ok) await loadRoster();
      return res;
    } catch (err) {
      console.error("Add member request failed:", err);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  // President, Treasurer, Secretary, or the super admin account approving a
  // member record added by someone else.
  const approveMemberRecord = async (memberId) => {
    try {
      const res = await api('members', { method: 'POST', body: { action: 'approve', memberId } });
      if (res.ok) await loadRoster();
      return res;
    } catch (err) {
      console.error("Approve member request failed:", err);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  // Super admin only. Generates (or, if newPassword is given, sets) a new
  // password for the member, returning it once in plaintext so it can be
  // handed to that member directly.
  const resetMemberPassword = async (memberId, newPassword) => {
    try {
      return await api('members', {
        method: 'POST',
        body: { action: 'reset-password', memberId, ...(newPassword ? { newPassword } : {}) }
      });
    } catch (err) {
      console.error("Reset password request failed:", err);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  // Update member dues record for current user
  const updateDuesStatus = (newStatus = 'Active Member in Good Standing (2025/2026)') => {
    if (!currentUser) return;
    const updated = { ...currentUser, duesStatus: newStatus };
    setCurrentUser(updated);
    try {
      localStorage.setItem('optimist_user', JSON.stringify(updated));
    } catch (e) {}
  };

  // Treasurer updates member dues status
  const updateMemberDuesByTreasurer = async (memberId, newStatus, duesRate = "$200.00", paymentMethod = "Bank Transfer") => {
    const today = new Date().toISOString().split('T')[0];
    const isPaid = newStatus.includes('Active');
    const paid = isPaid ? duesRate : "$0.00";
    const balance = isPaid ? "$0.00" : duesRate;

    setMemberRoster(prev => prev.map(m => (
      m.id === memberId
        ? { ...m, duesStatus: newStatus, lastPaymentDate: today, amountPaid: paid, balanceDue: balance, paymentMethod }
        : m
    )));

    try {
      return await api('dues', {
        method: 'POST',
        body: {
          action: 'update-status',
          memberId,
          status: newStatus,
          amountPaid: paid,
          balanceDue: balance,
          paymentMethod
        }
      });
    } catch (err) {
      console.warn("Dues update error:", err);
      return { success: false, message: 'Network error while saving the dues record.' };
    }
  };

  // Treasurer updates member notes
  const updateMemberNotesByTreasurer = async (memberId, newNotes) => {
    setMemberRoster(prev => prev.map(m => (
      m.id === memberId ? { ...m, notes: newNotes } : m
    )));

    try {
      return await api('dues', {
        method: 'POST',
        body: { action: 'update-notes', memberId, notes: newNotes }
      });
    } catch (err) {
      console.warn("Notes update error:", err);
      return { success: false, message: 'Network error while saving the notes.' };
    }
  };

  // Treasurer marks dues statements as sent
  const sendDuesStatementEmail = async (memberIds) => {
    const today = new Date().toISOString().split('T')[0];
    const ids = Array.isArray(memberIds) ? memberIds : [memberIds];

    setMemberRoster(prev => prev.map(m => (
      ids.includes(m.id) ? { ...m, emailLastSent: today } : m
    )));

    try {
      const res = await api('dues', {
        method: 'POST',
        body: { action: 'statement-sent', memberIds: ids }
      });
      if (!res.ok || !res.success) {
        return { success: false, message: res.message || 'Failed to record the statements.' };
      }
      return {
        success: true,
        message: `[SANDBOX ACTIVE] Dues statement email(s) for ${ids.length} member(s) generated and rerouted strictly to ${testEmailTarget}.`
      };
    } catch (err) {
      console.warn("Statement update error:", err);
      return { success: false, message: 'Network error while recording the statements.' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('optimist_user');
      localStorage.removeItem(SESSION_TOKEN_KEY);
    } catch (e) {}
  };

  // Add new project post (by logged in member)
  const addProject = async (projectData) => {
    if (!currentUser) {
      return { success: false, message: 'You must be logged in as a member to post a project.' };
    }

    // Children impacted is mandatory on every project and event, and feeds the
    // Children Reached total on the homepage. 0 is valid, blank is not.
    const childrenServed = Number(projectData.childrenServed);
    if (projectData.childrenServed === '' || projectData.childrenServed === null ||
        projectData.childrenServed === undefined || !Number.isInteger(childrenServed) || childrenServed < 0) {
      return { success: false, message: 'Number of Children Impacted is required and must be a whole number of 0 or more.' };
    }

    const isModeratorUser = ['super admin', 'finance', 'admin', 'moderator'].includes(currentUser.access);
    const isApproved = isModeratorUser; // Auto-approved if posted by a moderator

    const newProject = {
      id: 'proj-' + Date.now(),
      title: projectData.title,
      category: projectData.category || 'Volunteer Project',
      date: projectData.date || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      image: projectData.image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80',
      excerpt: projectData.excerpt,
      content: projectData.content,
      impact: projectData.impact || 'Community Initiative',
      isFeatured: Boolean(projectData.isFeatured),
      author: currentUser.name,
      authorId: currentUser.memberId,
      postedAt: new Date().toISOString().split('T')[0],
      childrenServed,
      approved: isApproved
    };

    // Send email to moderators (Simulated and rerouted strictly to dev@bajanthings.biz per user rules)
    const moderators = memberRoster.filter(m => ['super admin', 'finance', 'admin', 'moderator'].includes(m.access));
    const moderatorEmails = moderators.map(m => m.email).join(', ');

    const emailSubject = `[PROJECT SUBMISSION] "${newProject.title}" by ${newProject.author}`;
    const emailBody = `
======================================================================
TO: dev@bajanthings.biz (Simulated Rerouting from: ${moderatorEmails})
FROM: notifications@progressiveoptimist.org
SUBJECT: ${emailSubject}
======================================================================

Dear Club Moderator,

A new project update has been submitted by ${newProject.author}.

--- PROJECT DETAILS ---
Title: ${newProject.title}
Category: ${newProject.category}
Date: ${newProject.date}
Children Served: ${newProject.childrenServed}
Impact: ${newProject.impact}
Image/Photo URL: ${newProject.image}

Excerpt: 
${newProject.excerpt}

Content:
${newProject.content}

-----------------------

You can review and manage this submission at the moderation console using these links:
- Approve & Publish: http://localhost:3000/admin?tab=moderation&action=approve&id=${newProject.id}
- Decline & Delete: http://localhost:3000/admin?tab=moderation&action=delete&id=${newProject.id}

Regards,
Progressive Optimist Club of Barbados
======================================================================
`;
    console.log("%c[SIMULATED MODERATOR EMAIL SENT]", "color: #10b981; font-weight: bold;", emailBody);

    try {
      const res = await api('projects', {
        method: 'POST',
        body: { action: 'create', project: newProject }
      });
      if (!res.ok || !res.success) {
        return { success: false, message: res.message || 'Failed to save the project. Please try again.' };
      }

      setProjects(prev => [newProject, ...prev]);

      return {
        success: true,
        project: newProject,
        message: res.approved
          ? "Project published immediately. Notification email logged."
          : "Project submitted successfully. A moderation email containing details and photo has been simulated and sent to dev@bajanthings.biz."
      };
    } catch (err) {
      console.error("Project insert error:", err);
      return { success: false, message: 'Network error while saving the project.' };
    }
  };

  // Moderator approves a project
  const approveProject = (projectId) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, approved: true };
      }
      return p;
    }));

    (async () => {
      try {
        await api('projects', { method: 'POST', body: { action: 'approve', projectId } });
      } catch (err) {
        console.warn("Project approve error:", err);
      }
    })();
  };

  // Moderator deletes/rejects a project
  const deleteProject = (projectId) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));

    (async () => {
      try {
        await api('projects', { method: 'POST', body: { action: 'delete', projectId } });
      } catch (err) {
        console.warn("Project delete error:", err);
      }
    })();
  };

  // Contact page "Subject" dropdown options - admin add/remove/reorder,
  // optimistic local update synced through the API so every visitor sees the
  // same list.
  const addContactSubject = (label) => {
    const trimmed = (label || '').trim();
    if (!trimmed) return;
    const nextOrder = contactSubjects.length > 0
      ? Math.max(...contactSubjects.map(s => s.sort_order)) + 1
      : 0;
    const tempId = 'temp-' + Date.now();
    setContactSubjects(prev => [...prev, { id: tempId, label: trimmed, sort_order: nextOrder }]);

    (async () => {
      try {
        const res = await api('contact-subjects', { method: 'POST', body: { action: 'add', label: trimmed } });
        if (res.ok && res.subject) {
          setContactSubjects(prev => prev.map(s => s.id === tempId ? res.subject : s));
        } else {
          setContactSubjects(prev => prev.filter(s => s.id !== tempId));
        }
      } catch (err) {
        console.warn("Contact subject insert error:", err);
        setContactSubjects(prev => prev.filter(s => s.id !== tempId));
      }
    })();
  };

  const removeContactSubject = (id) => {
    setContactSubjects(prev => prev.filter(s => s.id !== id));
    (async () => {
      try {
        await api('contact-subjects', { method: 'POST', body: { action: 'remove', id } });
      } catch (err) {
        console.warn("Contact subject delete error:", err);
      }
    })();
  };

  const reorderContactSubject = (id, direction) => {
    const sorted = [...contactSubjects].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex(s => s.id === id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (idx === -1 || swapIdx < 0 || swapIdx >= sorted.length) return;

    const a = sorted[idx];
    const b = sorted[swapIdx];
    const newSortA = b.sort_order;
    const newSortB = a.sort_order;

    setContactSubjects(prev => prev.map(s => {
      if (s.id === a.id) return { ...s, sort_order: newSortA };
      if (s.id === b.id) return { ...s, sort_order: newSortB };
      return s;
    }));

    (async () => {
      try {
        await api('contact-subjects', {
          method: 'POST',
          body: {
            action: 'reorder',
            updates: [{ id: a.id, sortOrder: newSortA }, { id: b.id, sortOrder: newSortB }]
          }
        });
      } catch (err) {
        console.warn("Contact subject reorder error:", err);
      }
    })();
  };

  // Add photo to the shared gallery. Uploads through api/gallery-upload.js,
  // which pushes the image into the club's Google Photos account and only
  // stores metadata (title/caption/uploader/Google media item id) in Neon.
  const addGalleryPhoto = async (photoData) => {
    if (!currentUser) return { success: false, message: 'Must be logged in to post photos.' };

    try {
      const res = await fetch('/api/gallery-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: photoData.title,
          caption: photoData.caption,
          imageBase64: photoData.image,
          uploaderName: currentUser.name,
          uploaderId: currentUser.memberId
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || 'Failed to upload photo.' };
      }
      setMemberGallery(prev => [data.photo, ...prev]);
      return { success: true, photo: data.photo };
    } catch (err) {
      console.error("Gallery upload error:", err);
      return { success: false, message: 'Network error while uploading photo. Please try again.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isSandboxMode,
        testEmailTarget,
        testWhatsAppTarget,
        dbConnected,
        primaryInitiatives,
        updatePrimaryInitiatives,
        siteSettings,
        updateSiteSettings,
        updateMemberPermissions,
        updateMemberRecord,
        currentUser,
        login,
        registerMember,
        setMemberPassword,
        requestPasswordSetup,
        changeMyPassword,
        addMembers,
        approveMemberRecord,
        resetMemberPassword,
        updateDuesStatus,
        memberRoster,
        updateMemberDuesByTreasurer,
        updateMemberNotesByTreasurer,
        sendDuesStatementEmail,
        logout,
        projects,
        addProject,
        approveProject,
        deleteProject,
        memberGallery,
        addGalleryPhoto,
        contactSubjects,
        addContactSubject,
        removeContactSubject,
        reorderContactSubject,
        isDarkMode,
        toggleDarkMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
