'use client'

import { useAudit, Status } from '@/context/AuditContext';
import auditData from '@/data/audit-data.json';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, ChevronRight, MessageSquare, Info } from 'lucide-react';

type AuditItemData = {
  element: string;
  observation: string;
};

type AuditPageData = {
  pageName: string;
  items: AuditItemData[];
};

type AuditPillarData = {
  pillar: string;
  pages: AuditPageData[];
};

const auditPillars = auditData as AuditPillarData[];
const allStatuses: Status[] = ['✅', '⚠️', '❌'];

const statusDescriptions: { status: string; label: string; meaning: string; color: string; bg: string }[] = [
  { status: '✅', label: 'Bon', meaning: "Fonctionne bien, à garder tel quel", color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  { status: '⚠️', label: 'À améliorer', meaning: "Existe mais nécessite des ajustements", color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  { status: '❌', label: 'À supprimer', meaning: "Inutile ou trop complexe — à retirer", color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
];

function computeHealth(evaluated: number, optimal: number): string {
  if (evaluated === 0) return '—';
  const ratio = optimal / evaluated;
  if (ratio >= 0.7) return '🟢';
  if (ratio >= 0.4) return '🟡';
  return '🔴';
}

function computePctOptimal(evaluated: number, optimal: number): string {
  if (evaluated === 0) return '—';
  return `${Math.round((optimal / evaluated) * 100)}%`;
}

function StatusCountBadges({ counts }: { counts: Record<string, number> }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {allStatuses.map(s => {
        const c = counts[s!] || 0;
        if (c === 0) return null;
        return (
          <span key={s} className="text-xs font-mono bg-white/70 border border-slate-200 rounded-md px-1.5 py-0.5 text-slate-600">
            {s} {c}
          </span>
        );
      })}
    </div>
  );
}

function SectionSummaryBar({ evaluated, total, optimal, counts }: {
  evaluated: number; total: number; optimal: number;
  counts: Record<string, number>;
}) {
  const health = computeHealth(evaluated, optimal);
  const pctOpt = computePctOptimal(evaluated, optimal);

  return (
    <div className="flex items-center gap-4 flex-wrap text-xs text-slate-600">
      <span className="font-mono">{evaluated}/{total} évalués</span>
      <span className="font-mono">Optimal: <span className="text-emerald-600 font-semibold">{pctOpt}</span></span>
      <span>Santé: <span className="text-base leading-none">{health}</span></span>
      <StatusCountBadges counts={counts} />
    </div>
  );
}

export function StatusLegend() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <Info size={14} />
        <span>Légende des statuts</span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {statusDescriptions.map(d => (
                <div key={d.status} className={`rounded-lg p-3 flex gap-3 items-start border ${d.bg}`}>
                  <span className="text-xl">{d.status}</span>
                  <div>
                    <div className={`text-sm font-semibold ${d.color}`}>{d.label}</div>
                    <div className="text-xs text-slate-600 mt-0.5">{d.meaning}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AuditGrid() {
  return (
    <div className="space-y-6">
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
  const counts: Record<string, number> = {};
  allStatuses.forEach(s => { counts[s!] = 0; });

  pillar.pages.forEach((page) => {
    page.items.forEach((item) => {
      total++;
      const id = `${pillar.pillar}-${page.pageName}-${item.element}`;
      const s = state[id]?.status;
      if (s) {
        evaluated++;
        counts[s] = (counts[s] || 0) + 1;
        if (s === '✅') optimal++;
      }
    });
  });

  const health = computeHealth(evaluated, optimal);
  const pctOpt = computePctOptimal(evaluated, optimal);

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white/55 px-6 py-4 border-b border-slate-200/80 hover:bg-white/75 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="text-slate-500">
            {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>
          <h2 className="text-xl font-bold text-left text-slate-900">{pillar.pillar}</h2>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="font-mono text-slate-600">{evaluated}/{total}</span>
          <span className="font-mono text-emerald-600">{pctOpt}</span>
          <span className="text-lg">{health}</span>
          <StatusCountBadges counts={counts} />
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
            <div className="p-6 space-y-6">
              {pillar.pages.map((page, pIdx: number) => (
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

  let total = 0, evaluated = 0, optimal = 0;
  const counts: Record<string, number> = {};
  allStatuses.forEach(s => { counts[s!] = 0; });

  page.items.forEach((item) => {
    total++;
    const id = `${pillarName}-${page.pageName}-${item.element}`;
    const s = state[id]?.status;
    if (s) {
      evaluated++;
      counts[s] = (counts[s] || 0) + 1;
      if (s === '✅') optimal++;
    }
  });

  return (
    <div className="border border-slate-200/80 rounded-xl bg-white/45 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/70 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <div className="text-slate-500">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
          <h3 className="text-base font-semibold text-slate-800 text-left">{page.pageName}</h3>
        </div>
        <SectionSummaryBar evaluated={evaluated} total={total} optimal={optimal} counts={counts} />
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
            <div className="px-5 pb-4 pt-1 space-y-3">
              {page.items.map((item, iIdx: number) => (
                <AuditItem key={iIdx} pillarName={pillarName} pageName={page.pageName} item={item} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AuditItem({ pillarName, pageName, item }: { pillarName: string, pageName: string, item: AuditItemData }) {
  const { state, updateStatus, updateNotes } = useAudit();
  const [isExpanded, setIsExpanded] = useState(false);

  const id = `${pillarName}-${pageName}-${item.element}`;
  const itemState = state[id] || { status: null, notes: '' };

  const handleStatusClick = (status: Status) => {
    updateStatus(id, itemState.status === status ? null : status);
  };

  return (
    <div className="border border-slate-200 rounded-xl bg-white/65 overflow-hidden transition-all duration-300">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/75"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="text-slate-500 shrink-0">
            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </div>
          <div className="font-medium truncate text-slate-900">{item.element}</div>
          {itemState.notes && (
            <span className="shrink-0 w-2 h-2 rounded-full bg-indigo-500" title="Notes saisies" />
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
          <div className="flex bg-white/70 rounded-lg p-1 border border-slate-200 gap-0.5">
            {allStatuses.map(s => {
              const desc = statusDescriptions.find(d => d.status === s);
              const isActive = itemState.status === s;
              return (
                <button
                  key={s!}
                  onClick={() => handleStatusClick(s)}
                  className={`h-8 px-2.5 flex items-center gap-1.5 rounded-md text-xs font-semibold transition-all ${
                    isActive
                      ? `${desc?.bg ?? ''} ${desc?.color ?? ''} scale-105 shadow-sm border`
                      : 'hover:bg-white text-slate-500 opacity-70 hover:opacity-100'
                  }`}
                  title={desc?.label}
                >
                  <span>{s}</span>
                  {isActive && <span className="hidden sm:inline">{desc?.label}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-200/80"
          >
            <div className="p-4 bg-white/40 flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-2">
                <div className="text-xs uppercase text-slate-500 font-semibold">Observation initiale</div>
                <div className="text-sm text-slate-700 leading-relaxed bg-white/70 p-3 rounded-lg border border-slate-200 whitespace-pre-line">
                  {item.observation || "Aucune observation pré-enregistrée."}
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="text-xs uppercase text-slate-500 font-semibold flex items-center gap-2">
                  <MessageSquare size={12} /> Notes live
                </div>
                <textarea
                  value={itemState.notes}
                  onChange={(e) => updateNotes(id, e.target.value)}
                  placeholder="Prendre des notes pendant la réunion..."
                  className="w-full h-24 soft-input rounded-lg p-3 text-sm transition-all resize-none border border-indigo-200/60 bg-indigo-50/30 focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
