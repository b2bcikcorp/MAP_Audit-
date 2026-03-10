'use client'

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.25, 0.46, 0.45, 0.94] as const },
});

const staggerItem = (i: number) => fadeUp(0.06 * i);

export function ContextView() {
  return (
    <div className="space-y-6">
      <HeroSlide />
      <MissionSlide />
      <ObservationsSlide />
      <TimelineSlide />
      <SessionSlide />
    </div>
  );
}

/* ── Slide 1: Hero / Title ── */
function HeroSlide() {
  return (
    <motion.div {...fadeUp(0)} className="glass-card rounded-2xl px-10 py-14 text-center">
      <div className="eyebrow mb-4">Contexte Client</div>
      <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">MAPIG</h2>
      <p className="text-slate-500 mt-3 text-lg">AMO / Conseil technique immobilier, Paris</p>
    </motion.div>
  );
}

/* ── Slide 2: Mission ── */
function MissionSlide() {
  return (
    <motion.div {...fadeUp(0.08)} className="glass-card rounded-2xl px-10 py-10 accent-indigo">
      <div className="eyebrow mb-3">Mission</div>
      <p className="text-lg text-slate-800 leading-relaxed max-w-3xl font-medium">
        Restructurer l&apos;espace Notion de MAPIG pour en faire l&apos;outil central de gestion
        des missions, simple à utiliser au quotidien, adapté aux contraintes terrain,
        et capable de remplacer les fichiers Excel actuels.
      </p>
    </motion.div>
  );
}

/* ── Slide 3: Observations ── */
const observed = [
  'Notion mis en place sept. 2025, abandonné depuis novembre',
  'Travail sur Excel (4+ fichiers par mission), OneDrive, Outlook',
  'Double saisie perçue, impression de faire le travail deux fois',
  'Comptes rendus : ~8h/semaine de rédaction post-réunion',
  'Infos dispersées entre mails, rapports, photos, drive',
  'Navigation Notion trop complexe, pages vides, perte de contexte',
];

const works = [
  'Base clients/contacts : simple, bien remplie, à nettoyer',
  'Suivi PPA (OCDE) : structure par phases, modèle à dupliquer',
  'Partage CR via Notion : fonctionne, clients préfèrent le PDF',
];

function ObservationsSlide() {
  return (
    <motion.div {...fadeUp(0.16)} className="glass-card rounded-2xl p-10">
      <div className="eyebrow mb-6">Diagnostic</div>
      <div className="grid md:grid-cols-2 gap-0 md:divide-x md:divide-slate-200/50">
        {/* Left: pain points */}
        <div className="pr-0 md:pr-10 pb-8 md:pb-0">
          <h3 className="text-base font-bold text-slate-900 mb-5">Ce qu&apos;on a observé</h3>
          <ul className="space-y-3.5">
            {observed.map((text, i) => (
              <motion.li key={i} {...staggerItem(i)} className="flex items-start gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold mt-0.5">✕</span>
                <span className="text-sm text-slate-700 leading-relaxed">{text}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Right: what works */}
        <div className="pl-0 md:pl-10 pt-8 md:pt-0 border-t md:border-t-0 border-slate-200/50">
          <h3 className="text-base font-bold text-slate-900 mb-5">Ce qui fonctionne</h3>
          <ul className="space-y-3.5">
            {works.map((text, i) => (
              <motion.li key={i} {...staggerItem(i + observed.length)} className="flex items-start gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mt-0.5">
                  <Check size={12} strokeWidth={3} />
                </span>
                <span className="text-sm text-slate-700 leading-relaxed">{text}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Slide 4: Timeline & Livrables ── */
const livrables = [
  'Diagnostic technique complet (conserver / simplifier / supprimer)',
  'Réorganisation et nettoyage de l\'espace de travail Notion',
  'Ajustements structurels immédiats (bases de données, relations)',
  'Document de recommandations pour automatisations et outils futurs',
  'Un atelier de formation pour l\'équipe',
];

function TimelineSlide() {
  return (
    <motion.div {...fadeUp(0.24)} className="glass-card rounded-2xl p-10">
      <div className="eyebrow mb-6">Échéancier</div>

      <div className="flex items-stretch gap-0 mb-10">
        <div className="flex-1 relative pr-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shrink-0">1</div>
            <div>
              <div className="text-sm font-bold text-slate-900">Phase 1, Audit & Discovery</div>
              <div className="text-xs text-indigo-600 font-semibold">Mardi 11 mars · après-midi</div>
            </div>
          </div>
          <p className="text-sm text-slate-600 ml-12">
            Demi-journée sur site. Analyse des processus et de l&apos;architecture Notion.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center px-5">
          <div className="w-14 h-[2px] bg-slate-200/80" />
        </div>

        <div className="flex-1 relative pl-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-bold shrink-0">2</div>
            <div>
              <div className="text-sm font-bold text-slate-900">Phase 2, Livraison & Formation</div>
              <div className="text-xs text-slate-500 font-semibold">Date à fixer · sous 4 semaines</div>
            </div>
          </div>
          <p className="text-sm text-slate-600 ml-12">
            Demi-journée sur site. Mise en place nouvelle structure + atelier formation.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-200/50 pt-8">
        <div className="eyebrow mb-4">Livrables inclus</div>
        <ol className="space-y-2.5">
          {livrables.map((text, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-md bg-slate-900/5 text-slate-600 flex items-center justify-center text-xs font-bold mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm text-slate-700">{text}</span>
            </li>
          ))}
        </ol>
      </div>
    </motion.div>
  );
}

/* ── Slide 5: Session Agenda ── */
const sessions = [
  {
    num: 1,
    title: 'Point de vue & Alignement',
    desc: 'On vous présente ce qu\'on a compris de votre situation après nos deux premiers échanges. Vous validez, corrigez, complétez. On clarifie les dernières questions avant de passer à l\'audit.',
  },
  {
    num: 2,
    title: 'Audit page par page',
    desc: 'On parcourt Notion ensemble, page par page. Pour chaque section : est-ce que vous utilisez ça au quotidien, pourquoi, et qu\'est-ce qui manque ? On documente tout en live pour préparer la restructuration.',
  },
  {
    num: 3,
    title: 'Wrap-up & Next Steps',
    desc: 'On récapitule ce qu\'on a appris ensemble, on aligne sur les priorités, et on confirme les prochaines étapes. On repart de notre côté pour construire la nouvelle structure, qu\'on viendra livrer et former lors de la Phase 2.',
  },
];

function SessionSlide() {
  return (
    <motion.div {...fadeUp(0.32)} className="glass-card rounded-2xl p-10">
      <div className="eyebrow mb-3">Aujourd&apos;hui</div>
      <h3 className="text-xl font-bold text-slate-900 mb-8">
        Session on-site, Mardi 11 mars
      </h3>
      <div className="space-y-0">
        {sessions.map((s, i) => (
          <div key={s.num} className="flex gap-5">
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shrink-0">
                {s.num}
              </div>
              {i < sessions.length - 1 && (
                <div className="w-[2px] flex-1 bg-slate-200/60 my-1" />
              )}
            </div>
            <div className={i === sessions.length - 1 ? 'pb-0' : 'pb-7'}>
              <div className="text-sm font-bold text-slate-900">{s.title}</div>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
