'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const databases = [
  { id: 'client', icon: '⭐', name: 'Client', desc: "Organisations payantes / donneurs d'ordre.", stats: [{ label: '3 champs texte' }, { label: '6 relations', type: 'relations' }], detail: 'Relations: Contact, Mission, Tache, Document, Note, PPA' },
  { id: 'contact', icon: '👤', name: 'Contact', desc: "Personnes — liées aux clients ET prestataires.", stats: [{ label: '7 champs texte' }, { label: '9 relations', type: 'relations' }, { label: '1 formule', type: 'formulas' }, { label: 'LA PLUS COMPLEXE', type: 'warning' }], detail: 'Relations: Client, Prestataire, Occupant, Mission, Tache, Sous tache, Document, Note, PPA' },
  { id: 'prestataire', icon: '🏭', name: 'Prestataire', desc: "Sous-traitants / fournisseurs.", stats: [{ label: '3 champs texte' }, { label: '6 relations', type: 'relations' }], detail: 'Relations: Contact, Mission, Tache, Document, Note, PPA' },
  { id: 'occupant', icon: '🏢', name: 'Occupant', desc: "Locataires / occupants des sites.", stats: [{ label: '3 relations', type: 'relations' }, { label: 'SIMPLE', type: 'smart' }], detail: 'Relations: Contact, Notes, Tache' },
  { id: 'mission', icon: '📁', name: 'Mission', desc: "Projets / missions — L'ENTITÉ CENTRALE.", stats: [{ label: '4 champs texte' }, { label: '7 relations', type: 'relations' }, { label: '2 formules', type: 'formulas' }, { label: 'ENTITÉ CŒUR', type: 'warning' }], detail: 'Relations: Client, Contact, Prestataire, Tache, Document, Notes, PPA' },
  { id: 'tache', icon: '→', name: 'Tâche', desc: "Tâches — les items de travail.", stats: [{ label: '3 champs texte' }, { label: '10 relations !', type: 'relations' }, { label: '4 formules', type: 'formulas' }, { label: 'LA PLUS CONNECTÉE', type: 'warning' }], detail: 'Relations: Mission, Client, Contact, Prestataire, Occupant, Sous tache, PPA, Document, Note' },
  { id: 'sous-tache', icon: '→→', name: 'Sous tache', desc: "Sous-tâches. Avec suivi des dépendances.", stats: [{ label: '12 phases chantier' }, { label: '4 relations', type: 'relations' }, { label: 'auto-référence', type: 'formulas' }], detail: 'Relations: Soi-même (bloque/bloqué par), Tache, Contact' },
  { id: 'notes', icon: '📝', name: 'Notes', desc: "Notes de réunion & idées.", stats: [{ label: '2 selects' }, { label: '8 relations', type: 'relations' }], detail: 'Relations: Client, Contact, Prestataire, Occupant, Mission, Tache, Document, PPA' },
  { id: 'document', icon: '📄', name: 'Document', desc: "Fichiers & contrats. Alertes automatiques.", stats: [{ label: 'upload fichier' }, { label: '7 relations', type: 'relations' }, { label: '2 formules alerte', type: 'formulas' }, { label: 'MALIN', type: 'smart' }], detail: 'Relations: Client, Mission, et alertes préavis contrat' },
  { id: 'ppa', icon: '📊', name: 'PPA Phasage', desc: "Phasage projet / planification.", stats: [{ label: 'connecté à tout', type: 'relations' }], detail: 'Connecté à toutes les entités majeures pour planifier les phases du chantier.' },
  { id: 'widget', icon: '🎯', name: 'Widget', desc: "Configuration de widgets. Minimaliste.", stats: [{ label: 'POTENTIELLEMENT INUTILISÉ', type: 'formulas' }], detail: 'Juste un champ titre. Probablement un placeholder jamais développé.' },
  { id: 'contrat', icon: '💬', name: 'Gestion contrat', desc: "Suivi des contrats. Minimaliste.", stats: [{ label: 'POTENTIELLEMENT REDONDANT', type: 'formulas' }], detail: 'Juste un champ titre. Doublon potentiel avec Document.' },
];

export function ArchitectureExplorer() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-2">Les 12 Bases de Données (Database MAP)</h3>
        <p className="text-white/60">
          Les utilisateurs normaux ne voient jamais ces bases brutes, ils n'utilisent que des "vues". 
          Cliquez sur une base pour voir sa complexité (ses relations et formules).
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {databases.map((db) => (
          <motion.div
            key={db.id}
            layout
            onClick={() => setExpandedId(expandedId === db.id ? null : db.id)}
            className={`cursor-pointer bg-[#151515] border border-white/10 rounded-xl p-5 hover:border-indigo-500/50 transition-colors ${
              expandedId === db.id ? 'col-span-full md:col-span-2 lg:col-span-3' : ''
            }`}
          >
            <motion.div layout="position" className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl shrink-0">
                {db.icon}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white/90">{db.name}</h4>
                <p className="text-sm text-white/50 mt-1">{db.desc}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {db.stats.map((stat, i) => {
                    let badgeClass = 'bg-white/10 text-white/70';
                    if (stat.type === 'relations') badgeClass = 'bg-indigo-500/20 text-indigo-300';
                    if (stat.type === 'formulas') badgeClass = 'bg-yellow-500/20 text-yellow-300';
                    if (stat.type === 'warning') badgeClass = 'bg-red-500/20 text-red-300';
                    if (stat.type === 'smart') badgeClass = 'bg-green-500/20 text-green-300';
                    return (
                      <span key={i} className={`text-[10px] uppercase font-semibold px-2 py-1 rounded-md ${badgeClass}`}>
                        {stat.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {expandedId === db.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 pt-6 border-t border-white/10 overflow-hidden"
                >
                  <h5 className="text-sm font-semibold uppercase text-indigo-400 mb-2">Détails d'Architecture</h5>
                  <div className="bg-white/5 p-4 rounded-lg text-sm text-white/70">
                    {db.detail}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
