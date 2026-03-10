'use client'

import { useAudit } from '@/context/AuditContext';
import auditData from '@/data/audit-data.json';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const PILLAR_COLORS: Record<string, string> = {
  'ESPACE': 'border-slate-400',
  'QUOTIDIEN': 'border-blue-400',
  'TRAVAUX': 'border-emerald-400',
  'PRESTATAIRES': 'border-red-400',
  'CLIENT': 'border-purple-400',
  'ARCHI': 'border-indigo-400',
};

function getPillarBorder(pillarName: string): string {
  for (const [key, cls] of Object.entries(PILLAR_COLORS)) {
    if (pillarName.toUpperCase().includes(key)) return cls;
  }
  return 'border-slate-400';
}

function computeHealthLabel(evaluated: number, optimal: number): { label: string; color: string; bg: string } {
  if (evaluated === 0) return { label: '—', color: 'text-slate-400', bg: 'bg-slate-100' };
  const ratio = optimal / evaluated;
  if (ratio >= 0.7) return { label: 'Bon', color: 'text-emerald-700', bg: 'bg-emerald-50' };
  if (ratio >= 0.4) return { label: 'Moyen', color: 'text-amber-700', bg: 'bg-amber-50' };
  return { label: 'Critique', color: 'text-rose-700', bg: 'bg-rose-50' };
}

export function Dashboard() {
  const { state } = useAudit();

  let totalItems = 0;
  let evaluated = 0;
  const statuses: Record<string, number> = { '✅': 0, '⚠️': 0, '❌': 0 };

  auditData.forEach(pillar => {
    pillar.pages.forEach(page => {
      page.items.forEach(item => {
        totalItems++;
        const id = `${pillar.pillar}-${page.pageName}-${item.element}`;
        const status = state[id]?.status;
        if (status) {
          evaluated++;
          statuses[status]++;
        }
      });
    });
  });

  const optimalCount = statuses['✅'];
  const problematicCount = evaluated - optimalCount;
  const pctOptimal = evaluated > 0 ? Math.round((optimalCount / evaluated) * 100) : 0;
  const pctProblematic = evaluated > 0 ? Math.round((problematicCount / evaluated) * 100) : 0;
  const globalHealth = computeHealthLabel(evaluated, optimalCount);

  const isEmpty = evaluated === 0;

  return (
    <div className="space-y-8">
      {isEmpty && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 py-3"
        >
          <ArrowDown size={18} className="text-indigo-500 shrink-0" />
          <p className="text-sm text-slate-600">
            Commencez l&apos;audit dans la grille ci-dessous, les statistiques s&apos;actualiseront en temps réel.
          </p>
        </motion.div>
      )}

      {/* Inline stats row */}
      <div className="flex flex-wrap items-end gap-8">
        <div>
          <div className="eyebrow mb-1">Évalués</div>
          <div className="text-3xl font-bold text-slate-900 tabular-nums">{evaluated} <span className="text-lg text-slate-400 font-normal">/ {totalItems}</span></div>
        </div>
        <div>
          <div className="eyebrow mb-1">% Optimal</div>
          <div className="text-3xl font-bold text-emerald-600 tabular-nums">{evaluated > 0 ? `${pctOptimal}%` : '—'}</div>
        </div>
        <div>
          <div className="eyebrow mb-1">% Problématique</div>
          <div className="text-3xl font-bold text-rose-600 tabular-nums">{evaluated > 0 ? `${pctProblematic}%` : '—'}</div>
        </div>
        <div>
          <div className="eyebrow mb-1">Santé Globale</div>
          <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-2.5 py-1 rounded-md ${globalHealth.bg} ${globalHealth.color}`}>
            <span className={`w-2 h-2 rounded-full ${
              globalHealth.label === 'Bon' ? 'bg-emerald-500' :
              globalHealth.label === 'Moyen' ? 'bg-amber-500' :
              globalHealth.label === 'Critique' ? 'bg-rose-500' : 'bg-slate-300'
            }`} />
            {globalHealth.label}
          </span>
        </div>
        {evaluated > 0 && (
          <div className="flex-1 min-w-[180px]">
            <div className="eyebrow mb-2">Répartition</div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
              {statuses['✅'] > 0 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(statuses['✅'] / evaluated) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-emerald-500"
                />
              )}
              {statuses['⚠️'] > 0 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(statuses['⚠️'] / evaluated) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="h-full bg-amber-500"
                />
              )}
              {statuses['❌'] > 0 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(statuses['❌'] / evaluated) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-full bg-rose-500"
                />
              )}
            </div>
            <div className="flex gap-3 mt-1.5 text-xs text-slate-500">
              <span>✅ {statuses['✅']}</span>
              <span>⚠️ {statuses['⚠️']}</span>
              <span>❌ {statuses['❌']}</span>
            </div>
          </div>
        )}
      </div>

      {/* Pillar breakdown -- minimal bordered row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {auditData.map((pillar) => {
          let pTotal = 0, pEval = 0, pOpt = 0;
          pillar.pages.forEach(page => {
            page.items.forEach(item => {
              pTotal++;
              const id = `${pillar.pillar}-${page.pageName}-${item.element}`;
              const s = state[id]?.status;
              if (s) {
                pEval++;
                if (s === '✅') pOpt++;
              }
            });
          });
          const pPct = pEval > 0 ? Math.round((pOpt / pEval) * 100) : 0;
          const health = computeHealthLabel(pEval, pOpt);

          return (
            <div key={pillar.pillar} className={`border-l-[3px] ${getPillarBorder(pillar.pillar)} pl-3 py-1`}>
              <div className="text-xs text-slate-500 truncate mb-1" title={pillar.pillar}>{pillar.pillar}</div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-slate-900 tabular-nums">{pEval > 0 ? `${pPct}%` : '—'}</span>
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${health.bg} ${health.color}`}>
                  {health.label}
                </span>
              </div>
              <div className="text-xs text-slate-400 tabular-nums">{pEval}/{pTotal}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
