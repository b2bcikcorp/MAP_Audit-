'use client'

import { useAudit } from '@/context/AuditContext';
import auditData from '@/data/audit-data.json';
import { motion } from 'framer-motion';

function computeHealth(evaluated: number, optimal: number): string {
  if (evaluated === 0) return '—';
  const ratio = optimal / evaluated;
  if (ratio >= 0.7) return '🟢';
  if (ratio >= 0.4) return '🟡';
  return '🔴';
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
  const globalHealth = computeHealth(evaluated, optimalCount);

  return (
    <div className="mb-8 space-y-6">
      {/* Global Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard title="Évalués" value={`${evaluated} / ${totalItems}`} subtitle={`${totalItems - evaluated} restants`} />
        <StatCard title="% Optimal" value={evaluated > 0 ? `${pctOptimal}%` : '—'} color="text-emerald-600" />
        <StatCard title="% Problématique" value={evaluated > 0 ? `${pctProblematic}%` : '—'} color="text-rose-600" />
        <StatCard title="Santé Globale" value={globalHealth} isEmoji />
        <div className="glass-card rounded-xl p-4 flex gap-2 justify-between text-sm items-center">
          {(['✅', '⚠️', '❌'] as const).map(s => (
            <div key={s} className="flex flex-col items-center">
              <span className="mb-1 text-lg">{s}</span>
              <span className="font-mono text-slate-700">{statuses[s]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pillar Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {auditData.map((pillar) => {
          let pTotal = 0, pEval = 0, pOpt = 0;
          const pCounts: Record<string, number> = { '✅': 0, '⚠️': 0, '❌': 0 };
          pillar.pages.forEach(page => {
            page.items.forEach(item => {
              pTotal++;
              const id = `${pillar.pillar}-${page.pageName}-${item.element}`;
              const s = state[id]?.status;
              if (s) {
                pEval++;
                pCounts[s]++;
                if (s === '✅') pOpt++;
              }
            });
          });
          const pPct = pEval > 0 ? Math.round((pOpt / pEval) * 100) : 0;
          const health = computeHealth(pEval, pOpt);

          return (
            <div key={pillar.pillar} className="glass-card rounded-lg p-3">
              <div className="text-xs text-slate-500 truncate mb-2" title={pillar.pillar}>{pillar.pillar}</div>
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-semibold text-slate-900">{pEval > 0 ? `${pPct}%` : '—'}</span>
                  <span className="text-base">{health}</span>
                </div>
                <div className="text-xs text-slate-500">{pEval}/{pTotal}</div>
              </div>
              <div className="mt-2 h-1.5 bg-slate-300/70 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pEval > 0 ? pPct : 0}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`h-full rounded-full ${pPct >= 70 ? 'bg-emerald-500' : pPct >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                />
              </div>
              {pEval > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {(['✅', '⚠️', '❌'] as const).map(s => {
                    if (!pCounts[s]) return null;
                    return <span key={s} className="text-[10px] font-mono text-slate-500">{s}{pCounts[s]}</span>;
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ title, value, color = "text-slate-900", subtitle, isEmoji }: {
  title: string; value: string | number; color?: string; subtitle?: string; isEmoji?: boolean;
}) {
  return (
    <div className="glass-card rounded-xl p-4 flex flex-col justify-center">
      <div className="text-slate-500 text-sm font-medium mb-1">{title}</div>
      <div className={`${isEmoji ? 'text-3xl' : 'text-2xl'} font-bold ${color}`}>{value}</div>
      {subtitle && <div className="text-xs text-slate-500 mt-1">{subtitle}</div>}
    </div>
  );
}
