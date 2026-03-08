'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContextView } from '@/components/ContextView';
import { Dashboard } from '@/components/Dashboard';
import { AuditGrid } from '@/components/AuditGrid';
import { ArchitectureExplorer } from '@/components/ArchitectureExplorer';
import { useAudit } from '@/context/AuditContext';

type Tab = 'context' | 'audit' | 'architecture';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('context');
  const { resetAll } = useAudit();

  return (
    <main className="min-h-screen flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header & Tabs */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-white/10 pb-6 sticky top-0 bg-[#0f0f0f]/80 backdrop-blur-md z-50">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            TRAX AI x MAPIG
          </h1>
          <p className="text-sm text-white/50">Restructuration Notion — Audit Interactif</p>
        </div>

        <nav className="flex items-center gap-2 bg-white/5 p-1.5 rounded-xl border border-white/10">
          <TabButton active={activeTab === 'context'} onClick={() => setActiveTab('context')}>
            1. Contexte & ROI
          </TabButton>
          <TabButton active={activeTab === 'audit'} onClick={() => setActiveTab('audit')}>
            2. Grille d'Audit
          </TabButton>
          <TabButton active={activeTab === 'architecture'} onClick={() => setActiveTab('architecture')}>
            3. Architecture
          </TabButton>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={resetAll}
            className="text-xs font-semibold text-white/30 hover:text-red-400 transition-colors"
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
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
        active ? 'text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5'
      }`}
    >
      {active && (
        <motion.div
          layoutId="active-tab"
          className="absolute inset-0 bg-indigo-500/20 border border-indigo-500/30 rounded-lg"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
