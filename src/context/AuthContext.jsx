import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProjects } from '../data/projectsData';

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
  { id: "POCB-1001", name: "Richelle Lucas", email: "president@progressiveoptimist.org", role: "President & Admin", duesStatus: "Active Member (2025/2026)", lastPaymentDate: "2025-10-01", amountPaid: "$100 BBD" },
  { id: "POCB-1002", name: "Charmaine London", email: "secretary@progressiveoptimist.org", role: "Secretary", duesStatus: "Active Member (2025/2026)", lastPaymentDate: "2025-10-02", amountPaid: "$100 BBD" },
  { id: "POCB-1003", name: "Sharon Mohammed", email: "treasurer@progressiveoptimist.org", role: "Treasurer & Admin", duesStatus: "Active Member (2025/2026)", lastPaymentDate: "2025-09-28", amountPaid: "$100 BBD" },
  { id: "POCB-1004", name: "Edwin Workman", email: "oirep@progressiveoptimist.org", role: "OI Representative", duesStatus: "Active Member (2025/2026)", lastPaymentDate: "2025-10-05", amountPaid: "$100 BBD" },
  { id: "POCB-1005", name: "Omolara DeRiggs-Morris", email: "omolara@progressiveoptimist.org", role: "Board Director", duesStatus: "Active Member (2025/2026)", lastPaymentDate: "2025-10-01", amountPaid: "$100 BBD" },
  { id: "POCB-1006", name: "Dawn-Marie Watson", email: "dawnmarie@progressiveoptimist.org", role: "Board Director", duesStatus: "Pending Dues Payment", lastPaymentDate: "2024-10-15", amountPaid: "$0.00 Outstanding" },
  { id: "POCB-1007", name: "Deborah Bayne", email: "deborah@progressiveoptimist.org", role: "Board Director", duesStatus: "Active Member (2025/2026)", lastPaymentDate: "2025-10-08", amountPaid: "$100 BBD" },
  { id: "POCB-1008", name: "Cameron Sobers", email: "cameron@progressiveoptimist.org", role: "Board Director", duesStatus: "Active Member (2025/2026)", lastPaymentDate: "2025-10-04", amountPaid: "$100 BBD" }
];

export const AuthProvider = ({ children }) => {
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

  // Save projects to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem('optimist_projects', JSON.stringify(projects));
    } catch (e) {
      console.warn("Unable to save projects to localStorage", e);
    }
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
    } catch (e) {
      console.warn("Unable to save gallery to localStorage", e);
    }
  }, [memberGallery]);

  // Login handler
  const login = (email, password) => {
    if (!email || !password) {
      return { success: false, message: 'Please provide both email and password.' };
    }

    const nameFromEmail = email.split('@')[0].replace('.', ' ');
    const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    const isTreasurerOrAdmin = email.includes('treasurer') || email.includes('admin') || email.includes('president');

    const userObj = {
      email,
      name: formattedName || 'Optimist Member',
      role: isTreasurerOrAdmin ? 'Treasurer / Admin' : 'Member',
      isTreasurer: isTreasurerOrAdmin,
      memberId: 'POCB-' + Math.floor(1000 + Math.random() * 9000),
      duesStatus: 'Active Member in Good Standing (2025/2026)',
      joinedDate: '2022',
      avatar: isTreasurerOrAdmin ? `/avatars/treasurer_placeholder.jpg` : `/avatars/president_placeholder.jpg`
    };

    setCurrentUser(userObj);
    try {
      localStorage.setItem('optimist_user', JSON.stringify(userObj));
    } catch (e) {}
    return { success: true, user: userObj };
  };

  // Signup / Application handler
  const registerMember = (formData) => {
    const userObj = {
      email: formData.email,
      name: `${formData.firstName} ${formData.lastName}`,
      phone: formData.phone,
      role: 'Member',
      memberId: 'POCB-' + Math.floor(1000 + Math.random() * 9000),
      duesStatus: 'Pending Dues Payment',
      joinedDate: new Date().getFullYear().toString(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.email)}`
    };

    setCurrentUser(userObj);
    setMemberRoster(prev => [
      { id: userObj.memberId, name: userObj.name, email: userObj.email, role: 'Member', duesStatus: 'Pending Dues Payment', lastPaymentDate: 'None', amountPaid: '$0.00 Outstanding' },
      ...prev
    ]);

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

  // Treasurer updates member dues status in central roster
  const updateMemberDuesByTreasurer = (memberId, newStatus, paymentAmount = "$100 BBD") => {
    const today = new Date().toISOString().split('T')[0];
    setMemberRoster(prev => prev.map(m => {
      if (m.id === memberId) {
        return { ...m, duesStatus: newStatus, lastPaymentDate: today, amountPaid: paymentAmount };
      }
      return m;
    }));
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('optimist_user');
    } catch (e) {}
  };

  // Add new project post (by logged in member)
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
        currentUser,
        login,
        registerMember,
        updateDuesStatus,
        memberRoster,
        updateMemberDuesByTreasurer,
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
