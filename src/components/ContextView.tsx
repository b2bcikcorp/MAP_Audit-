'use client'

import { motion } from 'framer-motion';

export function ContextView() {
  return (
    <div className="space-y-12">
      <div className="text-center py-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold text-gradient"
        >
          Audit & Restructuration Notion
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-xl text-slate-600"
        >
          MAPIG
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-8">
          <h3 className="text-xl font-semibold mb-4 text-slate-800">Etat Actuel</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="text-rose-500 mt-1">❌</span>
              <span className="text-slate-700">Notion abandonne depuis novembre 2025</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-rose-500 mt-1">❌</span>
              <span className="text-slate-700">Travail principalement sur Excel (4+ fichiers par projet)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-rose-500 mt-1">❌</span>
              <span className="text-slate-700">Perte de temps dans la recherche de documents et historiques</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-rose-500 mt-1">❌</span>
              <span className="text-slate-700">Redaction de comptes rendus tres chronophage (8h/semaine)</span>
            </li>
          </ul>
        </div>
        <div className="glass-card rounded-2xl p-8 border-indigo-200/80">
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">Objectif Notion</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-1">✅</span>
              <span className="text-slate-700">Centralisation totale (Taches, Docs, Notes, Excel)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-1">✅</span>
              <span className="text-slate-700">Automatisation des CR (Gain vise: 6h/semaine)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-1">✅</span>
              <span className="text-slate-700">Creation instantanee de missions (Gain vise: 2-3 jours/an)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-1">✅</span>
              <span className="text-slate-700">Diminuer le Noise — less is more</span>
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
}
