'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContextView } from '@/components/ContextView';
import { Dashboard } from '@/components/Dashboard';
import { AuditGrid } from '@/components/AuditGrid';
import { ArchitectureExplorer } from '@/components/ArchitectureExplorer';
import { useAudit } from '@/context/AuditContext';
import { Lock } from 'lucide-react';

const SITE_PASSWORD = 'TRAX_MAPIG_2026';

type Tab = 'context' | 'audit' | 'architecture';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('context');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState(false);
  const { resetAll } = useAudit();

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (passwordInput === SITE_PASSWORD) {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPasswordInput('');
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
          className="glass-card rounded-2xl p-8 md:p-10 w-full max-w-sm text-center"
        >
          <div className="mx-auto mb-5 w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <Lock className="w-5 h-5 text-indigo-600" />
          </div>
          <h1 className="text-xl font-bold text-gradient mb-1">TRAX AI x MAPIG</h1>
          <p className="text-sm text-slate-500 mb-6">Accès protégé — entrez le mot de passe</p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => { setPasswordInput(e.target.value); setError(false); }}
              placeholder="Mot de passe"
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl soft-input text-sm text-center tracking-wider"
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-rose-500 font-medium"
              >
                Mot de passe incorrect
              </motion.p>
            )}
            <button type="submit" className="btn-primary w-full py-2.5 text-sm">
              Accéder à l&apos;audit
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      
      {/* Header & Tabs */}
      <header className="glass-nav rounded-2xl flex flex-col items-center gap-4 mb-10 p-4 md:p-5 sticky top-4 z-50">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-gradient">
            TRAX AI x MAPIG
          </h1>
          <p className="text-sm text-slate-600">Restructuration Notion - Audit Interactif</p>
        </div>

        <div className="flex items-center justify-center gap-6 w-full">
          <nav className="flex items-center gap-1.5 bg-white/60 p-1.5 rounded-xl surface-border shadow-sm">
            <TabButton active={activeTab === 'context'} onClick={() => setActiveTab('context')}>
              1. Contexte & ROI
            </TabButton>
            <TabButton active={activeTab === 'audit'} onClick={() => setActiveTab('audit')}>
              2. Grille d&apos;Audit
            </TabButton>
            <TabButton active={activeTab === 'architecture'} onClick={() => setActiveTab('architecture')}>
              3. Architecture
            </TabButton>
          </nav>
          <button 
            onClick={resetAll}
            className="text-xs font-semibold text-slate-500 hover:text-rose-500 transition-colors shrink-0"
          >
            Reset Data
          </button>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'context' && <ContextView />}
            {activeTab === 'audit' && (
              <div className="space-y-12">
                <Dashboard />
                <AuditGrid />
              </div>
            )}
            {activeTab === 'architecture' && <ArchitectureExplorer />}
          </motion.div>
        </AnimatePresence>
      </div>

    </main>
  );
}

function TabButton({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 md:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all relative ${
        active ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800 hover:bg-white/70'
      }`}
    >
      {active && (
        <motion.div
          layoutId="active-tab"
          className="absolute inset-0 bg-white/95 border border-indigo-200 rounded-lg shadow-sm"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
