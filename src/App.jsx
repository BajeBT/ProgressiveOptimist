import React, { useState, Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { NewProjectModal } from './components/NewProjectModal';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { BarbadosClubsPage } from './pages/BarbadosClubsPage';
import { HierarchyPage } from './pages/HierarchyPage';
import { MembershipPage } from './pages/MembershipPage';
import { DonatePage } from './pages/DonatePage';
import { ContactPage } from './pages/ContactPage';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900 text-white font-sans text-center">
          <div className="max-w-md space-y-4 p-8 rounded-3xl bg-slate-800 border border-slate-700 shadow-2xl">
            <h1 className="font-heading text-2xl font-bold text-amber-400">Something went wrong</h1>
            <p className="text-xs text-slate-300">
              {this.state.error?.toString() || 'An error occurred while rendering the page.'}
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="px-5 py-2.5 rounded-xl bg-optimist-blue text-white text-xs font-bold shadow hover:bg-blue-800"
            >
              Reset Session & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function App() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
            
            <Navbar onOpenPostModal={() => setIsPostModalOpen(true)} />

            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage onOpenPostModal={() => setIsPostModalOpen(true)} />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/projects" element={<ProjectsPage onOpenPostModal={() => setIsPostModalOpen(true)} />} />
                <Route path="/barbados-clubs" element={<BarbadosClubsPage />} />
                <Route path="/hierarchy" element={<HierarchyPage />} />
                <Route path="/membership" element={<MembershipPage onOpenPostModal={() => setIsPostModalOpen(true)} />} />
                <Route path="/donate" element={<DonatePage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Routes>
            </main>

            <Footer />

            <NewProjectModal
              isOpen={isPostModalOpen}
              onClose={() => setIsPostModalOpen(false)}
            />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
