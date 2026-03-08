'use client'

import { useAudit, Status } from '@/context/AuditContext';
import auditData from '@/data/audit-data.json';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, ChevronRight, MessageSquare } from 'lucide-react';

const statuses: Status[] = ['✅', '⚠️', '❌', '🔨', '🔧'];

export function AuditGrid() {
  return (
    <div className="space-y-12">
      {auditData.map((pillar, idx) => (
        <PillarSection key={idx} pillar={pillar} />
      ))}
    </div>
  );
}

function PillarSection({ pillar }: { pillar: any }) {
  return (
    <div className="border border-white/10 rounded-2xl bg-white/[0.02] overflow-hidden">
      <div className="bg-white/5 px-6 py-4 border-b border-white/10">
        <h2 className="text-xl font-bold">{pillar.pillar}</h2>
      </div>
      <div className="p-6 space-y-8">
        {pillar.pages.map((page: any, pIdx: number) => (
          <div key={pIdx} className="space-y-4">
            <h3 className="text-lg font-semibold text-white/80 border-b border-white/10 pb-2">{page.pageName}</h3>
            <div className="space-y-3">
              {page.items.map((item: any, iIdx: number) => (
                <AuditItem key={iIdx} pillarName={pillar.pillar} pageName={page.pageName} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuditItem({ pillarName, pageName, item }: { pillarName: string, pageName: string, item: any }) {
  const { state, updateStatus, updateNotes } = useAudit();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const id = `${pillarName}-${pageName}-${item.element}`;
  const itemState = state[id] || { status: null, notes: '' };

  const handleStatusClick = (status: Status) => {
    updateStatus(id, itemState.status === status ? null : status);
  };

  return (
    <div className="border border-white/10 rounded-xl bg-[#0f0f0f] overflow-hidden transition-all duration-300">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/[0.02]"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="text-white/40">
            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </div>
          <div className="font-medium">{item.element}</div>
        </div>
        
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          <div className="flex bg-white/5 rounded-lg p-1">
            {statuses.map(s => (
              <button
                key={s!}
                onClick={() => handleStatusClick(s)}
                className={`w-8 h-8 flex items-center justify-center rounded-md transition-all ${
                  itemState.status === s 
                    ? 'bg-white/20 scale-110 shadow-lg' 
                    : 'hover:bg-white/10 opacity-50 hover:opacity-100'
                }`}
                title={s!}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5"
          >
            <div className="p-4 bg-white/[0.01] flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-2">
                <div className="text-xs uppercase text-white/40 font-semibold">Observation initiale</div>
                <div className="text-sm text-white/70 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                  {item.observation || "Aucune observation pré-enregistrée."}
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="text-xs uppercase text-white/40 font-semibold flex items-center gap-2">
                  <MessageSquare size={12} /> Notes live (auto-save)
                </div>
                <textarea
                  value={itemState.notes}
                  onChange={(e) => updateNotes(id, e.target.value)}
                  placeholder="Prendre des notes pendant la réunion..."
                  className="w-full h-24 bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
