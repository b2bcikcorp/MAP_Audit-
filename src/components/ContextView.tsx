'use client'

import { motion } from 'framer-motion';

export function ContextView() {
  return (
    <div className="space-y-12">
      <div className="text-center py-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent"
        >
          Audit & Restructuration Notion
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-xl text-white/60"
        >
          MAPIG
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h3 className="text-xl font-semibold mb-4 text-white/80">État Actuel</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="text-red-400 mt-1">❌</span>
              <span className="text-white/70">Notion abandonné depuis novembre 2025</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 mt-1">❌</span>
              <span className="text-white/70">Travail principalement sur Excel (4+ fichiers par projet)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 mt-1">❌</span>
              <span className="text-white/70">Perte de temps dans la recherche de documents et historiques</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 mt-1">❌</span>
              <span className="text-white/70">Rédaction de comptes rendus très chronophage (8h/semaine)</span>
            </li>
          </ul>
        </div>
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-8">
          <h3 className="text-xl font-semibold mb-4 text-indigo-200">Objectif Notion</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✅</span>
              <span className="text-indigo-100/70">Centralisation totale (Tâches, Docs, Notes)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✅</span>
              <span className="text-indigo-100/70">Automatisation des CR (Gain visé: 6h/semaine)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✅</span>
              <span className="text-indigo-100/70">Création instantanée de missions (Gain visé: 2-3 jours/an)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✅</span>
              <span className="text-indigo-100/70">Adoption fluide par l'équipe</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-8 text-center">
        <div className="text-white/50 font-semibold uppercase tracking-wider mb-2">ROI Potentiel Estimé</div>
        <div className="text-5xl font-bold text-white mb-2">~450h</div>
        <div className="text-white/60">économisées par an pour l'équipe</div>
      </div>
    </div>
  );
}
