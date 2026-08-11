import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProjects } from '../data/projectsData';
import { sql } from '../db/neon';

const AuthContext = createContext();

const defaultGallery = [
  {
    id: "g1",
    title: "RISE Workshop Team",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    uploader: "Sarah Haynes",
    date: "2025-06-20",
    caption: "Mentors working with children during RISE 2025."
  },
  {
    id: "g2",
    title: "Kite Distribution Day",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80",
    uploader: "David Boyce",
    date: "2025-04-12",
    caption: "Easter kite cheer at Westbury Primary School!"
  }
];

const initialRoster = [
  {
    id: "78008-0150",
    name: "Richelle Lucas",
    email: "richelle.lucas16@gmail.com",
    role: "Club President & Admin",
    fiscalYear: "2025/2026 (Oct 1 - Sep 30)",
    duesRate: "$250.00 BBD",
    amountPaid: "$250.00 BBD",
    balanceDue: "$0.00 BBD",
    paymentMethod: "Bank Transfer (FCIB)",
    duesStatus: "Active Member (2025/2026)",
    lastPaymentDate: "2025-10-01",
    notes: "Full annual dues paid. FCIB Transfer ref #98421.",
    emailLastSent: "2025-10-01",
    hasTreasurerConsoleAccess: true,
    hasInitiativeAccess: true,
    accessTier: "Super Admin"
  },
  {
    id: "78008-0010",
    name: "Charmaine London",
    email: "londoncharms@hotmail.com",
    role: "Club Secretary",
    fiscalYear: "2025/2026 (Oct 1 - Sep 30)",
    duesRate: "$250.00 BBD",
    amountPaid: "$250.00 BBD",
    balanceDue: "$0.00 BBD",
    paymentMethod: "Cheque",
    duesStatus: "Active Member (2025/2026)",
    lastPaymentDate: "2025-10-02",
    notes: "Paid in full via Cheque #00412.",
    emailLastSent: "2025-10-02",
    hasTreasurerConsoleAccess: false,
    hasInitiativeAccess: true,
    accessTier: "Officer"
  },
  {
    id: "78008-0152",
    name: "Sharon Mohammed",
    email: "sharon@topaz-bb.com",
    role: "Club Treasurer & Admin",
    fiscalYear: "2025/2026 (Oct 1 - Sep 30)",
    duesRate: "$250.00 BBD",
    amountPaid: "$250.00 BBD",
    balanceDue: "$0.00 BBD",
    paymentMethod: "Online Bank Transfer",
    duesStatus: "Active Member (2025/2026)",
    lastPaymentDate: "2025-09-28",
    notes: "Treasurer annual dues settled in full.",
    emailLastSent: "2025-09-28",
    hasTreasurerConsoleAccess: true,
    hasInitiativeAccess: true,
    accessTier: "Treasurer Admin"
  },
  {
    id: "78008-0021",
    name: "Edwin Workman",
    email: "edwin@jillandee.com",
    role: "OI Representative",
    fiscalYear: "2025/2026 (Oct 1 - Sep 30)",
    duesRate: "$250.00 BBD",
    amountPaid: "$250.00 BBD",
    balanceDue: "$0.00 BBD",
    paymentMethod: "Bank Transfer",
    duesStatus: "Active Member (2025/2026)",
    lastPaymentDate: "2025-10-05",
    notes: "OI Representative dues processed.",
    emailLastSent: "2025-10-05",
    hasTreasurerConsoleAccess: false,
    hasInitiativeAccess: false,
    accessTier: "Officer"
  },
  {
    id: "78008-0121",
    name: "Omolara De Riggs-Morris",
    email: "onderiggs@hotmail.com",
    role: "Board Director",
    fiscalYear: "2025/2026 (Oct 1 - Sep 30)",
    duesRate: "$250.00 BBD",
    amountPaid: "$250.00 BBD",
    balanceDue: "$0.00 BBD",
    paymentMethod: "Cash",
    duesStatus: "Active Member (2025/2026)",
    lastPaymentDate: "2025-10-01",
    notes: "Paid cash at October monthly meeting.",
    emailLastSent: "2025-10-01",
    hasTreasurerConsoleAccess: false,
    hasInitiativeAccess: false,
    accessTier: "Officer"
  },
  {
    id: "78008-0148",
    name: "Lisa Brome",
    email: "lisabrome@yahoo.com",
    role: "Active Member",
    fiscalYear: "2025/2026 (Oct 1 - Sep 30)",
    duesRate: "$250.00 BBD",
    amountPaid: "$0.00 BBD",
    balanceDue: "$250.00 BBD",
    paymentMethod: "Pending",
    duesStatus: "Pending Dues Payment",
    lastPaymentDate: "2024-10-15",
    notes: "Awaiting 2025/2026 annual renewal statement.",
    emailLastSent: "2025-10-10",
    hasTreasurerConsoleAccess: false,
    hasInitiativeAccess: false,
    accessTier: "Standard Member"
  },
  {
    id: "78008-0153",
    name: "Deborah Bayne",
    email: "deborahbayne46@gmail.com",
    role: "Board Director",
    fiscalYear: "2025/2026 (Oct 1 - Sep 30)",
    duesRate: "$250.00 BBD",
    amountPaid: "$250.00 BBD",
    balanceDue: "$0.00 BBD",
    paymentMethod: "Bank Transfer",
    duesStatus: "Active Member (2025/2026)",
    lastPaymentDate: "2025-10-08",
    notes: "Annual dues settled.",
    emailLastSent: "2025-10-08",
    hasTreasurerConsoleAccess: false,
    hasInitiativeAccess: false,
    accessTier: "Officer"
  },
  {
    id: "78008-0038",
    name: "Cameron P Sobers",
    email: "Cposobers@gmail.com",
    role: "Board Director & President-Elect",
    fiscalYear: "2025/2026 (Oct 1 - Sep 30)",
    duesRate: "$250.00 BBD",
    amountPaid: "$250.00 BBD",
    balanceDue: "$0.00 BBD",
    paymentMethod: "Online Payment",
    duesStatus: "Active Member (2025/2026)",
    lastPaymentDate: "2025-10-04",
    notes: "President-Elect annual dues paid.",
    emailLastSent: "2025-10-04",
    hasTreasurerConsoleAccess: false,
    hasInitiativeAccess: false,
    accessTier: "Officer"
  }
];

const defaultPrimaryInitiatives = [
  "RISE Summer Experience & Challenge",
  "Easter Cheer Kite Giveaway (Westbury & Ignatius Byer Primary)",
  "Laptop & Tablet Fundraiser for Students",
  "Mini Millionaires in the Making Mentorship"
];

const defaultSiteSettings = {
  meetingSchedule: "1st Monday of every month at 5:30 PM",
  meetingVenue: "Ross University, Lloyd Erskine Sandiford Centre (LESC), Two Mile Hill, St. Michael, Barbados",
  supportEmail: "info@progressiveoptimist.org",
  contactPhone: "+1 (246) 836-6185",
  annualDuesRate: "$250.00"
};

export const AuthProvider = ({ children }) => {
  // Sandbox & Email Rerouting Configuration
  const isSandboxMode = true;
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
        duesRate: m.duesRate ? m.duesRate.replace(' BBD', '') : '$250.00',
        amountPaid: m.amountPaid ? m.amountPaid.replace(' BBD', '') : '$250.00',
        balanceDue: m.balanceDue ? m.balanceDue.replace(' BBD', '') : '$0.00'
      }));
    } catch (e) {
      const uniqueInit = Array.from(new Map(initialRoster.map(m => [m.id, m])).values());
      return uniqueInit.map(m => ({
        ...m,
        duesRate: m.duesRate ? m.duesRate.replace(' BBD', '') : '$250.00',
        amountPaid: m.amountPaid ? m.amountPaid.replace(' BBD', '') : '$250.00',
        balanceDue: m.balanceDue ? m.balanceDue.replace(' BBD', '') : '$0.00'
      }));
    }
  });

  // Member photo uploads gallery
  const [memberGallery, setMemberGallery] = useState(() => {
    try {
      const savedGallery = localStorage.getItem('optimist_gallery');
      return savedGallery ? JSON.parse(savedGallery) : defaultGallery;
    } catch (e) {
      console.warn("Failed to parse optimist_gallery from localStorage", e);
      return defaultGallery;
    }
  });

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem('optimist_theme') === 'dark';
    } catch (e) {
      return false;
    }
  });

  // Load live data from Neon Serverless PostgreSQL on mount
  useEffect(() => {
    async function loadNeonData() {
      try {
        // Fetch Members & Dues Ledgers from Neon PostgreSQL
        const rows = await sql`
          SELECT 
            m.id, m.name, m.email, m.role, m.phone, m.address, m.avatar, m.access, m.password,
            d.fiscal_year, d.dues_rate, d.amount_paid, d.balance_due, 
            d.payment_method, d.dues_status, d.last_payment_date, d.notes, d.email_last_sent
          FROM members m
          LEFT JOIN dues_ledger d ON m.id = d.member_id
          ORDER BY m.name ASC;
        `;

        if (rows && rows.length > 0) {
          const mappedRoster = rows.map(r => {
            const emailLower = r.email.toLowerCase().trim();
            let defaultAccess = 'member';
            if (emailLower === 'richelle.lucas16@gmail.com' || emailLower === 'edwin@jillandee.com') {
              defaultAccess = 'super admin';
            } else if (emailLower === 'sharon@topaz-bb.com') {
              defaultAccess = 'finance';
            } else if (emailLower === 'londoncharms@hotmail.com') {
              defaultAccess = 'admin';
            }

            const isTreasurerUser = r.email === 'sharon@topaz-bb.com' || r.id === '78008-0152';
            const isPresidentUser = r.email === 'richelle.lucas16@gmail.com' || r.id === '78008-0150';

            return {
              id: r.id,
              name: r.name,
              email: r.email,
              role: r.role,
              phone: r.phone,
              address: r.address,
              avatar: r.avatar,
              access: r.access || defaultAccess,
              password: r.password || '',
              fiscalYear: r.fiscal_year || '2025/2026 (Oct 1 - Sep 30)',
              duesRate: r.dues_rate || '$250.00',
              amountPaid: r.amount_paid || '$250.00',
              balanceDue: r.balance_due || '$0.00',
              paymentMethod: r.payment_method || 'Bank Transfer',
              duesStatus: r.dues_status || 'Active Member (2025/2026)',
              lastPaymentDate: r.last_payment_date || '2025-10-01',
              notes: r.notes || '',
              emailLastSent: r.email_last_sent || '',
              hasTreasurerConsoleAccess: isTreasurerUser || isPresidentUser,
              hasInitiativeAccess: isTreasurerUser || isPresidentUser
            };
          });
          const deduplicatedRoster = Array.from(new Map(mappedRoster.map(m => [m.id, m])).values());
          setMemberRoster(deduplicatedRoster);
          setDbConnected(true);
        }

        // Fetch Projects from Neon
        const projRows = await sql`SELECT * FROM projects ORDER BY posted_at DESC;`;
        if (projRows && projRows.length > 0) {
          const mappedProjects = projRows.map(p => ({
            id: p.id,
            title: p.title,
            category: p.category,
            date: p.date_str,
            image: p.image,
            excerpt: p.excerpt,
            content: p.content,
            impact: p.impact,
            isFeatured: p.is_featured,
            author: p.author,
            authorId: p.author_id,
            postedAt: p.posted_at,
            childrenServed: Number(p.children_served) || 0
          }));
          setProjects(mappedProjects);
        }
      } catch (err) {
        console.warn("Neon Database query fallback to local cache:", err);
      }
    }

    loadNeonData();
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
    setSiteSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Update Member Permissions Matrix
  const updateMemberPermissions = (memberId, permissionKey, val) => {
    setMemberRoster(prev => prev.map(m => {
      if (m.id === memberId) {
        return { ...m, [permissionKey]: val };
      }
      return m;
    }));

    // Async sync to Neon DB
    (async () => {
      try {
        if (permissionKey === 'access') {
          await sql`
            UPDATE members
            SET access = ${val}
            WHERE id = ${memberId};
          `;
        } else if (permissionKey === 'role') {
          await sql`
            UPDATE members
            SET role = ${val}
            WHERE id = ${memberId};
          `;
        } else if (permissionKey === 'hasTreasurerConsoleAccess') {
          await sql`
            UPDATE members
            SET is_treasurer = ${val}
            WHERE id = ${memberId};
          `;
        } else if (permissionKey === 'hasInitiativeAccess') {
          await sql`
            UPDATE members
            SET is_president = ${val}
            WHERE id = ${memberId};
          `;
        }
      } catch (err) {
        console.warn("Neon DB permissions sync error:", err);
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

    // Async sync to Neon DB
    (async () => {
      try {
        // 1. Update members table
        await sql`
          UPDATE members
          SET 
            name = ${updatedFields.name},
            email = ${updatedFields.email},
            phone = ${updatedFields.phone},
            address = ${updatedFields.address},
            role = ${updatedFields.role},
            access = ${updatedFields.access}
          WHERE id = ${memberId};
        `;

        // 2. Update dues_ledger table
        await sql`
          UPDATE dues_ledger
          SET 
            dues_rate = ${updatedFields.duesRate},
            amount_paid = ${updatedFields.amountPaid},
            balance_due = ${updatedFields.balanceDue},
            payment_method = ${updatedFields.paymentMethod},
            dues_status = ${updatedFields.duesStatus},
            last_payment_date = ${updatedFields.lastPaymentDate}
          WHERE member_id = ${memberId};
        `;
      } catch (err) {
        console.warn("Neon DB member update sync error:", err);
      }
    })();
  };

  // Login handler
  const login = (email, password) => {
    if (!email || !password) {
      return { success: false, message: 'Please provide both email and password.' };
    }

    const cleanEmail = email.toLowerCase().trim();
    let name = 'Optimist Member';
    let role = 'Member';
    let avatar = '/avatars/president_placeholder.jpg';
    let isTreasurer = false;
    let memberId = '78008-' + Math.floor(1000 + Math.random() * 9000);

    // Look up in roster first if available
    const matchedRosterItem = memberRoster.find(m => m.email.toLowerCase().trim() === cleanEmail);

    if (matchedRosterItem && matchedRosterItem.access === 'pending_verification') {
      return { success: false, message: 'Please check your email and verify your email address to set your password before logging in.' };
    }

    if (matchedRosterItem && matchedRosterItem.access === 'pending') {
      return { success: false, message: 'Your membership application is currently pending review by the Membership Review Committee.' };
    }

    if (matchedRosterItem && matchedRosterItem.password && password !== matchedRosterItem.password) {
      return { success: false, message: 'Invalid password. Please check your credentials.' };
    }

    if (cleanEmail === 'treasurer@progressiveoptimist.org' || cleanEmail === 'sharon@topaz-bb.com' || cleanEmail.includes('treasurer')) {
      name = 'Sharon Mohammed';
      role = 'Club Treasurer & Admin';
      avatar = '/avatars/treasurer_placeholder.jpg';
      isTreasurer = true;
      memberId = '78008-0152';
    } else if (cleanEmail === 'president@progressiveoptimist.org' || cleanEmail === 'richelle.lucas16@gmail.com' || cleanEmail.includes('president')) {
      name = 'Richelle Lucas';
      role = 'Club President & Admin';
      avatar = '/avatars/president_placeholder.jpg';
      isTreasurer = true;
      memberId = '78008-0150';
    } else if (matchedRosterItem) {
      name = matchedRosterItem.name;
      role = matchedRosterItem.role;
      memberId = matchedRosterItem.id;
      avatar = matchedRosterItem.avatar || avatar;
      isTreasurer = Boolean(matchedRosterItem.is_treasurer || matchedRosterItem.is_president || role.includes('Treasurer') || role.includes('President') || role.includes('Admin'));
    } else {
      const nameFromEmail = cleanEmail.split('@')[0].replace('.', ' ');
      name = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    }

    let access = 'member';
    if (cleanEmail === 'richelle.lucas16@gmail.com' || cleanEmail === 'edwin@jillandee.com' || cleanEmail === 'president@progressiveoptimist.org' || cleanEmail.includes('president')) {
      access = 'super admin';
    } else if (cleanEmail === 'sharon@topaz-bb.com' || cleanEmail === 'treasurer@progressiveoptimist.org' || cleanEmail.includes('treasurer')) {
      access = 'finance';
    } else if (cleanEmail === 'londoncharms@hotmail.com' || cleanEmail === 'secretary@progressiveoptimist.org' || cleanEmail.includes('secretary')) {
      access = 'admin';
    } else if (matchedRosterItem && matchedRosterItem.access) {
      access = matchedRosterItem.access;
    }

    const userObj = {
      email: cleanEmail,
      name,
      role,
      isTreasurer,
      memberId,
      duesStatus: 'Active Member in Good Standing (2025/2026)',
      joinedDate: '2022',
      avatar,
      access
    };

    setCurrentUser(userObj);
    try {
      localStorage.setItem('optimist_user', JSON.stringify(userObj));
    } catch (e) {}
    return { success: true, user: userObj };
  };

  // Signup / Application handler with Neon sync
  const registerMember = (formData) => {
    const memberId = '78008-' + Math.floor(1000 + Math.random() * 9000);
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.email)}`;
    const name = `${formData.firstName} ${formData.lastName}`;

    const notesString = `DOB: ${formData.dob || 'N/A'} | Gender: ${formData.gender || 'N/A'} | Occupation: ${formData.occupation || 'N/A'} | Employer: ${formData.employer || 'N/A'} | Hear About Us: ${formData.hearAboutUs || 'N/A'} ${formData.referrerName ? `(Referrer: ${formData.referrerName})` : ''} | Comments: ${formData.comments || 'None'}`;

    const addressString = `${formData.addressLine1 || ''}${formData.addressLine2 ? `, ${formData.addressLine2}` : ''}${formData.village ? `, ${formData.village}` : ''}, ${formData.parish || ''}, ${formData.country || 'Barbados'}`;

    const newMemberRecord = {
      id: memberId,
      name: name,
      email: formData.email,
      phone: formData.phone || '',
      address: addressString,
      role: 'Pending Member',
      access: 'pending_verification',
      fiscalYear: '2025/2026 (Oct 1 - Sep 30)',
      duesRate: '$250.00',
      amountPaid: '$0.00',
      balanceDue: '$250.00',
      paymentMethod: 'Pending',
      duesStatus: 'Pending Verification',
      lastPaymentDate: 'None',
      notes: notesString,
      emailLastSent: 'None',
      hasTreasurerConsoleAccess: false,
      hasInitiativeAccess: false,
      avatar: avatar
    };

    setMemberRoster(prev => [newMemberRecord, ...prev]);

    // Send email verification link (Simulated and rerouted strictly to dev@bajanthings.biz per user rules)
    const verifyToken = 'tok-' + Math.floor(100000 + Math.random() * 900000);
    const verifyLink = `http://localhost:3000/membership?action=verify-email&email=${encodeURIComponent(formData.email)}&token=${verifyToken}`;

    const verifyEmailBody = `
======================================================================
TO: dev@bajanthings.biz (Simulated Rerouting from: ${formData.email})
FROM: registration@progressiveoptimist.org
SUBJECT: [Action Required] Verify Your Email Address & Set Password
======================================================================

Dear ${name},

Thank you for applying to the Progressive Optimist Club of Barbados.

To complete your application process, please click the secure link below to verify your email address and set your portal login password:

Verify Email & Set Password:
${verifyLink}

Once verified, your application will be reviewed by the Membership Review Committee.

Regards,
Progressive Optimist Club of Barbados Membership Review Committee
======================================================================
`;
    console.log("%c[SIMULATED EMAIL VERIFICATION SENT]", "color: #3b82f6; font-weight: bold;", verifyEmailBody);

    // Async sync to Neon DB
    (async () => {
      try {
        await sql`
          INSERT INTO members (id, name, email, phone, role, avatar, address, access)
          VALUES (${memberId}, ${name}, ${formData.email}, ${formData.phone || ''}, 'Pending Member', ${avatar}, ${addressString}, 'pending_verification')
          ON CONFLICT (id) DO NOTHING;
        `;
        await sql`
          INSERT INTO dues_ledger (member_id, fiscal_year, dues_rate, amount_paid, balance_due, payment_method, dues_status, notes)
          VALUES (${memberId}, '2025/2026 (Oct 1 - Sep 30)', '$250.00', '$0.00', '$250.00', 'Pending', 'Pending Verification', ${notesString});
        `;
      } catch (err) {
        console.warn("Neon DB member insert sync error:", err);
      }
    })();

    return { success: true, user: newMemberRecord };
  };

  // Verify email and set password for pending applicant
  const verifyMemberEmailAndPassword = async (email, password) => {
    const cleanEmail = email.toLowerCase().trim();

    // Update local state roster
    setMemberRoster(prev => prev.map(m => {
      if (m.email.toLowerCase().trim() === cleanEmail) {
        return {
          ...m,
          access: 'pending', // Awaiting committee approval now
          duesStatus: 'Pending Approval',
          password: password
        };
      }
      return m;
    }));

    // Update Neon DB
    try {
      await sql`
        UPDATE members
        SET access = 'pending', password = ${password}
        WHERE LOWER(TRIM(email)) = ${cleanEmail};
      `;
      await sql`
        UPDATE dues_ledger
        SET dues_status = 'Pending Approval'
        WHERE member_id = (SELECT id FROM members WHERE LOWER(TRIM(email)) = ${cleanEmail});
      `;
      return { success: true, message: 'Email verified and password created successfully!' };
    } catch (err) {
      console.warn("Neon DB verification update error:", err);
      return { success: false, message: 'Database sync failed.' };
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

  // Treasurer updates member dues status in central roster and Neon DB
  const updateMemberDuesByTreasurer = (memberId, newStatus, amountPaid = "$250.00", paymentMethod = "Bank Transfer") => {
    const today = new Date().toISOString().split('T')[0];
    const isPaid = newStatus.includes('Active');

    setMemberRoster(prev => prev.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          duesStatus: newStatus,
          lastPaymentDate: today,
          amountPaid: isPaid ? "$250.00" : "$0.00",
          balanceDue: isPaid ? "$0.00" : "$250.00",
          paymentMethod
        };
      }
      return m;
    }));

    // Async sync to Neon DB
    (async () => {
      try {
        await sql`
          UPDATE dues_ledger
          SET 
            dues_status = ${newStatus},
            last_payment_date = ${today},
            amount_paid = ${isPaid ? '$250.00' : '$0.00'},
            balance_due = ${isPaid ? '$0.00' : '$250.00'},
            payment_method = ${paymentMethod},
            updated_at = CURRENT_TIMESTAMP
          WHERE member_id = ${memberId};
        `;
      } catch (err) {
        console.warn("Neon DB dues update error:", err);
      }
    })();
  };

  // Treasurer updates member notes in central roster and Neon DB
  const updateMemberNotesByTreasurer = (memberId, newNotes) => {
    setMemberRoster(prev => prev.map(m => {
      if (m.id === memberId) {
        return { ...m, notes: newNotes };
      }
      return m;
    }));

    // Async sync to Neon DB
    (async () => {
      try {
        await sql`
          UPDATE dues_ledger
          SET notes = ${newNotes}, updated_at = CURRENT_TIMESTAMP
          WHERE member_id = ${memberId};
        `;
      } catch (err) {
        console.warn("Neon DB notes update error:", err);
      }
    })();
  };

  // Treasurer sends Email Statement
  const sendDuesStatementEmail = (memberIds) => {
    const today = new Date().toISOString().split('T')[0];
    const ids = Array.isArray(memberIds) ? memberIds : [memberIds];
    
    setMemberRoster(prev => prev.map(m => {
      if (ids.includes(m.id)) {
        return { ...m, emailLastSent: today };
      }
      return m;
    }));

    // Async sync to Neon DB
    (async () => {
      try {
        for (const mid of ids) {
          await sql`
            UPDATE dues_ledger
            SET email_last_sent = ${today}, updated_at = CURRENT_TIMESTAMP
            WHERE member_id = ${mid};
          `;
        }
      } catch (err) {
        console.warn("Neon DB email_last_sent update error:", err);
      }
    })();

    return {
      success: true,
      message: `[SANDBOX ACTIVE] Dues statement email(s) for ${ids.length} member(s) generated and rerouted strictly to ${testEmailTarget}.`
    };
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('optimist_user');
    } catch (e) {}
  };

  // Add new project post (by logged in member) with Neon DB sync
  const addProject = (projectData) => {
    if (!currentUser) {
      return { success: false, message: 'You must be logged in as a member to post a project.' };
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
      childrenServed: Number(projectData.childrenServed) || 0,
      approved: isApproved
    };

    setProjects(prev => [newProject, ...prev]);

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

    // Async sync to Neon DB
    (async () => {
      try {
        await sql`
          INSERT INTO projects (id, title, category, date_str, image, excerpt, content, impact, is_featured, author, author_id, posted_at, children_served, approved)
          VALUES (${newProject.id}, ${newProject.title}, ${newProject.category}, ${newProject.date}, ${newProject.image}, ${newProject.excerpt}, ${newProject.content}, ${newProject.impact}, ${newProject.isFeatured}, ${newProject.author}, ${newProject.authorId}, ${newProject.postedAt}, ${newProject.childrenServed}, ${newProject.approved});
        `;
      } catch (err) {
        console.warn("Neon DB project insert error:", err);
      }
    })();

    return {
      success: true,
      project: newProject,
      message: isApproved 
        ? "Project published immediately. Notification email logged." 
        : "Project submitted successfully. A moderation email containing details and photo has been simulated and sent to dev@bajanthings.biz."
    };
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
        await sql`
          UPDATE projects
          SET approved = TRUE
          WHERE id = ${projectId};
        `;
      } catch (err) {
        console.warn("Neon DB project approve error:", err);
      }
    })();
  };

  // Moderator deletes/rejects a project
  const deleteProject = (projectId) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));

    (async () => {
      try {
        await sql`
          DELETE FROM projects
          WHERE id = ${projectId};
        `;
      } catch (err) {
        console.warn("Neon DB project delete error:", err);
      }
    })();
  };

  // Add photo to gallery
  const addGalleryPhoto = (photoData) => {
    if (!currentUser) return { success: false, message: 'Must be logged in to post photos.' };

    const newPhoto = {
      id: 'g-' + Date.now(),
      title: photoData.title,
      image: photoData.image,
      uploader: currentUser.name,
      date: new Date().toISOString().split('T')[0],
      caption: photoData.caption
    };

    setMemberGallery(prev => [newPhoto, ...prev]);
    return { success: true, photo: newPhoto };
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
        verifyMemberEmailAndPassword,
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
