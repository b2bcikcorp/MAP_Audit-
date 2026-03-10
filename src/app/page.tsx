'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { ContextView } from '@/components/ContextView';
import { Dashboard } from '@/components/Dashboard';
import { AuditGrid } from '@/components/AuditGrid';
import { ArchitectureExplorer } from '@/components/ArchitectureExplorer';
import { MeetingNotes } from '@/components/MeetingNotes';
import { CodeGate } from '@/components/CodeGate';
import { useAudit } from '@/context/AuditContext';
import auditData from '@/data/audit-data.json';

type Tab = 'context' | 'audit' | 'architecture' | 'notes';

function useProgress() {
  const { state } = useAudit();
  let total = 0;
  let evaluated = 0;
  auditData.forEach(pillar => {
    pillar.pages.forEach(page => {
      page.items.forEach(item => {
        total++;
        const id = `${pillar.pillar}-${page.pageName}-${item.element}`;
        if (state[id]?.status) evaluated++;
      });
    });
  });
  return { total, evaluated, pct: total > 0 ? (evaluated / total) * 100 : 0 };
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('context');
  const { resetAll } = useAudit();
  const { evaluated, total, pct } = useProgress();

  return (
    <CodeGate>
    <main className="min-h-screen flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      <header className="mb-10 sticky top-0 z-50 backdrop-blur-md bg-white/40 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="shrink-0">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              TRAX AI <span className="text-slate-400 font-normal mx-1">x</span> MAPIG
            </h1>
          </div>

          <nav className="flex items-center gap-1">
            <TabButton active={activeTab === 'context'} onClick={() => setActiveTab('context')}>
              Contexte
            </TabButton>
            <TabButton active={activeTab === 'audit'} onClick={() => setActiveTab('audit')}>
              Grille d&apos;Audit
            </TabButton>
            <TabButton active={activeTab === 'architecture'} onClick={() => setActiveTab('architecture')}>
              Architecture
            </TabButton>
            <TabButton active={activeTab === 'notes'} onClick={() => setActiveTab('notes')}>
              Notes
            </TabButton>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-slate-400 font-medium tabular-nums">
              {evaluated}/{total}
            </span>
            <button
              onClick={resetAll}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50/80 transition-colors"
              title="Réinitialiser les données"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        <div className="h-[1.5px] bg-slate-200/50 w-full">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </header>

      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'context' && <ContextView />}
            {activeTab === 'audit' && (
              <div className="space-y-10">
                <Dashboard />
                <AuditGrid />
              </div>
            )}
            {activeTab === 'architecture' && <ArchitectureExplorer />}
            {activeTab === 'notes' && <MeetingNotes />}
          </motion.div>
        </AnimatePresence>
      </div>

    </main>
    </CodeGate>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-semibold transition-all relative ${
        active ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      {active && (
        <motion.div
          layoutId="active-tab"
          className="absolute bottom-0 left-2 right-2 h-[2px] bg-slate-900 rounded-full"
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
