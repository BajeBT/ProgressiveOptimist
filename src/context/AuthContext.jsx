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
    emailLastSent: "2025-10-01"
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
    emailLastSent: "2025-10-02"
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
    emailLastSent: "2025-09-28"
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
    emailLastSent: "2025-10-05"
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
    emailLastSent: "2025-10-01"
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
    emailLastSent: "2025-10-10"
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
    emailLastSent: "2025-10-08"
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
    emailLastSent: "2025-10-04"
  }
];

export const AuthProvider = ({ children }) => {
  // Sandbox & Email Rerouting Configuration
  const isSandboxMode = true;
  const testEmailTarget = "dev@bajanthings.biz";
  const testWhatsAppTarget = "12468366185";
  const [dbConnected, setDbConnected] = useState(false);

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

  // Member Roster (Treasurer Ledger)
  const [memberRoster, setMemberRoster] = useState(() => {
    try {
      const savedRoster = localStorage.getItem('optimist_roster');
      return savedRoster ? JSON.parse(savedRoster) : initialRoster;
    } catch (e) {
      return initialRoster;
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
            m.id, m.name, m.email, m.role, m.phone, m.address, m.avatar,
            d.fiscal_year, d.dues_rate, d.amount_paid, d.balance_due, 
            d.payment_method, d.dues_status, d.last_payment_date, d.notes, d.email_last_sent
          FROM members m
          LEFT JOIN dues_ledger d ON m.id = d.member_id
          ORDER BY m.name ASC;
        `;

        if (rows && rows.length > 0) {
          const mappedRoster = rows.map(r => ({
            id: r.id,
            name: r.name,
            email: r.email,
            role: r.role,
            phone: r.phone,
            address: r.address,
            avatar: r.avatar,
            fiscalYear: r.fiscal_year || '2025/2026 (Oct 1 - Sep 30)',
            duesRate: r.dues_rate || '$250.00 BBD',
            amountPaid: r.amount_paid || '$250.00 BBD',
            balanceDue: r.balance_due || '$0.00 BBD',
            paymentMethod: r.payment_method || 'Bank Transfer',
            duesStatus: r.dues_status || 'Active Member (2025/2026)',
            lastPaymentDate: r.last_payment_date || '2025-10-01',
            notes: r.notes || '',
            emailLastSent: r.email_last_sent || ''
          }));
          setMemberRoster(mappedRoster);
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
            postedAt: p.posted_at
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

    if (cleanEmail === 'treasurer@progressiveoptimist.org') {
      name = 'Sharon Mohammed';
      role = 'Club Treasurer & Admin';
      avatar = '/avatars/treasurer_placeholder.jpg';
      isTreasurer = true;
    } else if (cleanEmail === 'president@progressiveoptimist.org') {
      name = 'Richelle Lucas';
      role = 'Club President & Admin';
      avatar = '/avatars/president_placeholder.jpg';
      isTreasurer = true;
    } else {
      const nameFromEmail = cleanEmail.split('@')[0].replace('.', ' ');
      name = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    }

    const userObj = {
      email: cleanEmail,
      name,
      role,
      isTreasurer,
      memberId: cleanEmail === 'treasurer@progressiveoptimist.org' ? '78008-0152' : '78008-' + Math.floor(1000 + Math.random() * 9000),
      duesStatus: 'Active Member in Good Standing (2025/2026)',
      joinedDate: '2022',
      avatar
    };

    setCurrentUser(userObj);
    try {
      localStorage.setItem('optimist_user', JSON.stringify(userObj));
    } catch (e) {}
    return { success: true, user: userObj };
  };

  // Signup / Application handler with Neon sync
  const registerMember = (formData) => {
    const userObj = {
      email: formData.email,
      name: `${formData.firstName} ${formData.lastName}`,
      phone: formData.phone,
      role: 'Member',
      memberId: '78008-' + Math.floor(1000 + Math.random() * 9000),
      duesStatus: 'Pending Dues Payment',
      joinedDate: new Date().getFullYear().toString(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.email)}`
    };

    setCurrentUser(userObj);
    const newMemberRecord = {
      id: userObj.memberId,
      name: userObj.name,
      email: userObj.email,
      role: 'Member',
      fiscalYear: '2025/2026 (Oct 1 - Sep 30)',
      duesRate: '$250.00 BBD',
      amountPaid: '$0.00 BBD',
      balanceDue: '$250.00 BBD',
      paymentMethod: 'Pending',
      duesStatus: 'Pending Dues Payment',
      lastPaymentDate: 'None',
      notes: 'New member application submitted.',
      emailLastSent: 'None'
    };

    setMemberRoster(prev => [newMemberRecord, ...prev]);

    // Async sync to Neon DB
    (async () => {
      try {
        await sql`
          INSERT INTO members (id, name, email, phone, role, avatar)
          VALUES (${userObj.memberId}, ${userObj.name}, ${userObj.email}, ${formData.phone || ''}, 'Member', ${userObj.avatar})
          ON CONFLICT (id) DO NOTHING;
        `;
        await sql`
          INSERT INTO dues_ledger (member_id, fiscal_year, dues_rate, amount_paid, balance_due, payment_method, dues_status, notes)
          VALUES (${userObj.memberId}, '2025/2026 (Oct 1 - Sep 30)', '$250.00 BBD', '$0.00 BBD', '$250.00 BBD', 'Pending', 'Pending Dues Payment', 'New member application submitted.');
        `;
      } catch (err) {
        console.warn("Neon DB member insert sync error:", err);
      }
    })();

    try {
      localStorage.setItem('optimist_user', JSON.stringify(userObj));
    } catch (e) {}
    return { success: true, user: userObj };
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
  const updateMemberDuesByTreasurer = (memberId, newStatus, amountPaid = "$250.00 BBD", paymentMethod = "Bank Transfer") => {
    const today = new Date().toISOString().split('T')[0];
    const isPaid = newStatus.includes('Active');

    setMemberRoster(prev => prev.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          duesStatus: newStatus,
          lastPaymentDate: today,
          amountPaid: isPaid ? "$250.00 BBD" : "$0.00 BBD",
          balanceDue: isPaid ? "$0.00 BBD" : "$250.00 BBD",
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
            amount_paid = ${isPaid ? '$250.00 BBD' : '$0.00 BBD'},
            balance_due = ${isPaid ? '$0.00 BBD' : '$250.00 BBD'},
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
      postedAt: new Date().toISOString().split('T')[0]
    };

    setProjects(prev => [newProject, ...prev]);

    // Async sync to Neon DB
    (async () => {
      try {
        await sql`
          INSERT INTO projects (id, title, category, date_str, image, excerpt, content, impact, is_featured, author, author_id, posted_at)
          VALUES (${newProject.id}, ${newProject.title}, ${newProject.category}, ${newProject.date}, ${newProject.image}, ${newProject.excerpt}, ${newProject.content}, ${newProject.impact}, ${newProject.isFeatured}, ${newProject.author}, ${newProject.authorId}, ${newProject.postedAt});
        `;
      } catch (err) {
        console.warn("Neon DB project insert error:", err);
      }
    })();

    return { success: true, project: newProject };
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
        addProject,
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
