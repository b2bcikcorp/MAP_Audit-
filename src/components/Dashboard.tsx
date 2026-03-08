'use client'

import { useAudit } from '@/context/AuditContext';
import auditData from '@/data/audit-data.json';
import { motion } from 'framer-motion';

export function Dashboard() {
  const { state } = useAudit();
  
  // Calculate globals
  let totalItems = 0;
  let evaluated = 0;
  let statuses = { '✅': 0, '⚠️': 0, '❌': 0, '🔨': 0, '🔧': 0 };

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
  const problematicCount = statuses['⚠️'] + statuses['❌'] + statuses['🔨'] + statuses['🔧'];

  const pctOptimal = evaluated > 0 ? Math.round((optimalCount / evaluated) * 100) : 0;
  const pctProblematic = evaluated > 0 ? Math.round((problematicCount / evaluated) * 100) : 0;

  return (
    <div className="mb-8 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Évalués" value={`${evaluated} / ${totalItems}`} />
        <StatCard title="% Optimal" value={`${pctOptimal}%`} color="text-green-400" />
        <StatCard title="% Problématique" value={`${pctProblematic}%`} color="text-red-400" />
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-2 justify-between text-sm items-center">
          <div className="flex flex-col items-center"><span className="mb-1 text-lg">✅</span><span className="font-mono text-white/80">{statuses['✅']}</span></div>
          <div className="flex flex-col items-center"><span className="mb-1 text-lg">⚠️</span><span className="font-mono text-white/80">{statuses['⚠️']}</span></div>
          <div className="flex flex-col items-center"><span className="mb-1 text-lg">❌</span><span className="font-mono text-white/80">{statuses['❌']}</span></div>
          <div className="flex flex-col items-center"><span className="mb-1 text-lg">🔨</span><span className="font-mono text-white/80">{statuses['🔨']}</span></div>
          <div className="flex flex-col items-center"><span className="mb-1 text-lg">🔧</span><span className="font-mono text-white/80">{statuses['🔧']}</span></div>
        </div>
      </div>
      
      {/* Pillar Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {auditData.map((pillar) => {
          let pTotal = 0;
          let pEval = 0;
          let pOpt = 0;
          pillar.pages.forEach(page => {
            page.items.forEach(item => {
              pTotal++;
              const id = `${pillar.pillar}-${page.pageName}-${item.element}`;
              const s = state[id]?.status;
              if (s) pEval++;
              if (s === '✅') pOpt++;
            });
          });
          const pPct = pEval > 0 ? Math.round((pOpt / pEval) * 100) : 0;
          
          return (
            <div key={pillar.pillar} className="bg-white/5 border border-white/10 rounded-lg p-3">
              <div className="text-xs text-white/50 truncate mb-2" title={pillar.pillar}>{pillar.pillar}</div>
              <div className="flex justify-between items-end">
                <div className="text-xl font-semibold text-white/90">{pEval > 0 ? `${pPct}%` : '-'}</div>
                <div className="text-xs text-white/40">{pEval}/{pTotal}</div>
              </div>
              <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${pEval > 0 ? pPct : 0}%` }}
                  className={`h-full ${pPct > 70 ? 'bg-green-500' : pPct > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ title, value, color = "text-white" }: { title: string, value: string | number, color?: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-center">
      <div className="text-white/50 text-sm font-medium mb-1">{title}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}
