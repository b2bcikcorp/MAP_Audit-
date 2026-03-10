'use client'

import { useAudit, Status } from '@/context/AuditContext';
import auditData from '@/data/audit-data.json';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, ChevronRight, MessageSquare } from 'lucide-react';

type AuditItemData = { element: string; observation: string };
type AuditPageData = { pageName: string; items: AuditItemData[] };
type AuditPillarData = { pillar: string; pages: AuditPageData[] };

const auditPillars = auditData as AuditPillarData[];
const allStatuses: Status[] = ['✅', '⚠️', '❌'];

const statusDescriptions = [
  { status: '✅', label: 'Bon', meaning: 'Fonctionne bien, à garder tel quel', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { status: '⚠️', label: 'À améliorer', meaning: 'Existe mais nécessite des ajustements', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  { status: '❌', label: 'À supprimer', meaning: 'Inutile ou trop complexe, à retirer', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' },
];

const PILLAR_ACCENTS: Record<string, string> = {
  'ESPACE': 'accent-slate',
  'QUOTIDIEN': 'accent-blue',
  'TRAVAUX': 'accent-emerald',
  'PRESTATAIRES': 'accent-red',
  'CLIENT': 'accent-purple',
  'ARCHI': 'accent-indigo',
};

function getPillarAccent(name: string): string {
  for (const [key, cls] of Object.entries(PILLAR_ACCENTS)) {
    if (name.toUpperCase().includes(key)) return cls;
  }
  return 'accent-slate';
}

function computeHealthLabel(evaluated: number, optimal: number): { label: string; color: string; bg: string } {
  if (evaluated === 0) return { label: '—', color: 'text-slate-400', bg: 'bg-slate-50' };
  const ratio = optimal / evaluated;
  if (ratio >= 0.7) return { label: 'Bon', color: 'text-emerald-700', bg: 'bg-emerald-50' };
  if (ratio >= 0.4) return { label: 'Moyen', color: 'text-amber-700', bg: 'bg-amber-50' };
  return { label: 'Critique', color: 'text-rose-700', bg: 'bg-rose-50' };
}

function StatusLegend() {
  return (
    <div className="flex items-center gap-3 mb-6">
      {statusDescriptions.map(d => (
        <div key={d.status} className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border ${d.bg} ${d.border} ${d.color}`}>
          <span>{d.status}</span>
          <span>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export function AuditGrid() {
  return (
    <div className="space-y-5">
      <StatusLegend />
      {auditPillars.map((pillar, idx) => (
        <PillarSection key={idx} pillar={pillar} />
      ))}
    </div>
  );
}

function PillarSection({ pillar }: { pillar: AuditPillarData }) {
  const { state } = useAudit();
  const [isOpen, setIsOpen] = useState(true);

  let total = 0, evaluated = 0, optimal = 0;
  pillar.pages.forEach(page => {
    page.items.forEach(item => {
      total++;
      const id = `${pillar.pillar}-${page.pageName}-${item.element}`;
      const s = state[id]?.status;
      if (s) {
        evaluated++;
        if (s === '✅') optimal++;
      }
    });
  });

  const health = computeHealthLabel(evaluated, optimal);

  return (
    <div className={`glass-card rounded-2xl overflow-hidden ${getPillarAccent(pillar.pillar)}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/40 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="text-slate-400">
            {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </div>
          <h2 className="text-lg font-bold text-slate-900">{pillar.pillar}</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 tabular-nums font-medium">{evaluated}/{total}</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${health.bg} ${health.color}`}>
            {health.label}
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 pt-1 space-y-6">
              {pillar.pages.map((page, pIdx) => (
                <PageSection key={pIdx} pillarName={pillar.pillar} page={page} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PageSection({ pillarName, page }: { pillarName: string; page: AuditPageData }) {
  const { state } = useAudit();
  const [isOpen, setIsOpen] = useState(true);

  let total = 0, evaluated = 0;
  page.items.forEach(item => {
    total++;
    const id = `${pillarName}-${page.pageName}-${item.element}`;
    const s = state[id]?.status;
    if (s) evaluated++;
  });

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          <div className="text-slate-400">
            {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </div>
          <h3 className="text-sm font-semibold text-slate-800">{page.pageName}</h3>
        </div>
        <span className="text-xs text-slate-400 tabular-nums">{evaluated}/{total}</span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="ml-5 border-l border-slate-200/60 pl-4">
              {page.items.map((item, iIdx) => (
                <AuditItem key={iIdx} pillarName={pillarName} pageName={page.pageName} item={item} isLast={iIdx === page.items.length - 1} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AuditItem({ pillarName, pageName, item, isLast }: { pillarName: string; pageName: string; item: AuditItemData; isLast: boolean }) {
  const { state, updateStatus, updateNotes } = useAudit();
  const [isExpanded, setIsExpanded] = useState(false);

  const id = `${pillarName}-${pageName}-${item.element}`;
  const itemState = state[id] || { status: null, notes: '' };

  const handleStatusClick = (status: Status) => {
    updateStatus(id, itemState.status === status ? null : status);
  };

  return (
    <div className={!isLast ? 'border-b border-slate-200/40' : ''}>
      <div
        className="flex items-center justify-between py-3 cursor-pointer hover:bg-white/30 transition-colors -ml-4 pl-4 -mr-2 pr-2 rounded"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="text-slate-400 shrink-0">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
          <div className="text-sm font-medium truncate text-slate-900">{item.element}</div>
          {itemState.notes && (
            <MessageSquare size={13} className="shrink-0 text-indigo-400" />
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
          {allStatuses.map(s => {
            const desc = statusDescriptions.find(d => d.status === s);
            const isActive = itemState.status === s;
            return (
              <button
                key={s!}
                onClick={() => handleStatusClick(s)}
                className={`h-8 px-2.5 flex items-center gap-1 rounded-md text-xs font-semibold transition-all active:scale-95 ${
                  isActive
                    ? `${desc?.bg ?? ''} ${desc?.color ?? ''} border ${desc?.border ?? ''}`
                    : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                }`}
                title={desc?.meaning}
              >
                <span>{s}</span>
                <span className="hidden sm:inline">{desc?.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="pb-4 pt-1 flex flex-col md:flex-row gap-5">
              <div className="flex-1 space-y-2">
                <div className="eyebrow">Observation initiale</div>
                <div className="text-sm text-slate-700 leading-relaxed border-l-[3px] border-indigo-300 pl-3 whitespace-pre-line">
                  {item.observation || 'Aucune observation pré-enregistrée.'}
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="eyebrow flex items-center gap-2">
                  <MessageSquare size={12} /> Notes live
                </div>
                <textarea
                  value={itemState.notes}
                  onChange={(e) => updateNotes(id, e.target.value)}
                  placeholder="Prendre des notes pendant la réunion..."
                  className="w-full h-28 soft-input rounded-lg p-3 text-sm transition-all resize-none"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
