'use client'

import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { useAudit } from '@/context/AuditContext';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.25, 0.46, 0.45, 0.94] as const },
});

function SlideNotes({ id, label }: { id: string; label?: string }) {
  const { state, updateNotes } = useAudit();
  const notes = state[id]?.notes || '';

  return (
    <div className="mt-8 pt-6 border-t border-slate-200/40">
      <div className="eyebrow flex items-center gap-2 mb-2">
        <MessageSquare size={12} />
        {label || 'Vos notes'}
      </div>
      <textarea
        value={notes}
        onChange={(e) => updateNotes(id, e.target.value)}
        placeholder="Ajoutez vos notes ici..."
        className="w-full h-24 soft-input rounded-lg p-3 text-sm transition-all resize-y"
      />
    </div>
  );
}

export function MeetingNotes() {
  return (
    <div className="space-y-6">
      <ContexteEntreprise />
      <Reunion1 />
      <Reunion2 />
      <PointsFriction />
      <CeQuiMarche />
      <ContraintesMigration />
    </div>
  );
}

/* ── Slide 1: Contexte Entreprise ── */
function ContexteEntreprise() {
  return (
    <motion.div {...fadeUp(0)} className="glass-card rounded-2xl px-10 py-10">
      <div className="eyebrow mb-4">Contexte Entreprise</div>
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-6">MAPIG, AMO / Conseil technique immobilier</h2>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Équipe</div>
            <p className="text-sm text-slate-700">Cabinet de 2 personnes : Marc Antoine (fondateur) + Landry (arrivé été 2025)</p>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Clients</div>
            <p className="text-sm text-slate-700">La Poste Immobilier, OCDE, Crédit Agricole Immobilier</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Modèle</div>
            <p className="text-sm text-slate-700">Missions intégrées chez des clients institutionnels. Projets de 10k à 200k€.</p>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Revenus</div>
            <p className="text-sm text-slate-700">Honoraires de conseil/pilotage sur missions ponctuelles et récurrentes</p>
          </div>
        </div>
      </div>

      <SlideNotes id="meeting-contexte" />
    </motion.div>
  );
}

/* ── Slide 2: Réunion 1 ── */
function Reunion1() {
  const priorities = [
    { title: 'Retrouver des documents rapidement', desc: 'En réunion, impossible de localiser des fichiers ou historiques sur des missions de 2+ ans' },
    { title: 'Architecture et organisation', desc: 'Centraliser tout pour avoir des réponses sans fouiller mails, rapports, photos' },
    { title: 'Deux modes opératoires', desc: 'Phase travaux vs. exploitation d\'un site nécessitent des structures différentes mais une même architecture de base' },
  ];

  return (
    <motion.div {...fadeUp(0.08)} className="glass-card rounded-2xl px-10 py-10">
      <div className="eyebrow mb-2">Réunion 1, Découverte initiale</div>
      <div className="flex items-baseline gap-3 flex-wrap mb-8">
        <h3 className="text-xl font-bold text-slate-900">Avec Marc Antoine</h3>
        <span className="text-xs text-slate-400 font-medium">Samuel & Taddeo (TRAX) · Avant le 6 mars</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">État actuel de Notion</div>
          <ul className="space-y-2">
            {[
              'Mis en place en sept. 2025, abandonné depuis novembre',
              'Architecture de base bien faite mais trop généraliste',
              'Impression de double travail quand ils essaient de l\'utiliser',
              'La partie "notes de réunion" est la plus utilisée',
            ].map((t, i) => (
              <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                <span className="text-slate-400 mt-1 shrink-0">·</span>{t}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Workflow quotidien</div>
          <ul className="space-y-2">
            {[
              'Missions différentes, chacune avec son propre suivi',
              'Travail principalement sur Excel, réseau interne/drive, et chat',
              'Besoin de visibilité sur les actions de la semaine',
              'Pas accroché à Excel, prêt à basculer si Notion est bien monté',
            ].map((t, i) => (
              <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                <span className="text-slate-400 mt-1 shrink-0">·</span>{t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200/40 pt-6">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Top 3 priorités (Marc Antoine)</div>
        <div className="space-y-4">
          {priorities.map((p, i) => (
            <div key={i} className="flex gap-3">
              <span className="shrink-0 w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold mt-0.5">{i + 1}</span>
              <div>
                <div className="text-sm font-semibold text-slate-900">{p.title}</div>
                <p className="text-sm text-slate-600 mt-0.5">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SlideNotes id="meeting-reunion1" />
    </motion.div>
  );
}

/* ── Slide 3: Réunion 2 ── */
function Reunion2() {
  return (
    <motion.div {...fadeUp(0.16)} className="glass-card rounded-2xl px-10 py-10">
      <div className="eyebrow mb-2">Réunion 2, Deep Dive</div>
      <div className="flex items-baseline gap-3 flex-wrap mb-8">
        <h3 className="text-xl font-bold text-slate-900">Avec Landry</h3>
        <span className="text-xs text-slate-400 font-medium">Samuel & Taddeo (TRAX) · 6 mars 2026</span>
      </div>

      <div className="space-y-8">
        {/* Team structure */}
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Structure équipe & missions</div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-l-[3px] border-indigo-400 pl-4">
              <div className="text-sm font-bold text-slate-900 mb-1">Marc Antoine</div>
              <ul className="space-y-1.5 text-sm text-slate-700">
                <li>La Poste Immobilier (17e), mission 1,5 an, 6+ mois restants</li>
                <li>Gestion de services (Lumière)</li>
                <li>Suivi travaux lourd, plans d&apos;action partagés (20 participants/réunion)</li>
              </ul>
            </div>
            <div className="border-l-[3px] border-purple-400 pl-4">
              <div className="text-sm font-bold text-slate-900 mb-1">Landry</div>
              <ul className="space-y-1.5 text-sm text-slate-700">
                <li>OCDE : accompagnement technique locataire + propriétaire</li>
                <li>Crédit Agricole Immobilier : gestion technique, pilotage prestataires</li>
                <li>Mission type : suivi quotidien, décharger le client sur le technique</li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-slate-600 mt-4 italic">Missions tournantes : quand l&apos;un est absent, l&apos;autre reprend mais perd du temps à retrouver le contexte.</p>
        </div>

        {/* Tools */}
        <div className="border-t border-slate-200/40 pt-6">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Outils actuels</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Base de travail', value: 'Excel (4+ fichiers/projet)' },
              { label: 'Documents', value: 'OneDrive / réseau interne' },
              { label: 'Mail', value: 'Outlook (pas Google)' },
              { label: 'IA', value: 'Claude connecté à Notion' },
            ].map((tool, i) => (
              <div key={i}>
                <div className="text-xs font-semibold text-slate-500 mb-0.5">{tool.label}</div>
                <div className="text-sm text-slate-800 font-medium">{tool.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SlideNotes id="meeting-reunion2" />
    </motion.div>
  );
}

/* ── Slide 4: Points de Friction ── */
const frictions = [
  {
    title: 'Comptes rendus de réunion',
    time: '~8h/semaine pour l\'équipe',
    details: [
      '2 à 3 réunions formelles/semaine, chacune génère ~1h de rédaction après',
      '3 à 4 réunions supplémentaires certaines semaines + réunions impromptues',
      'Template Word roulant qui grossit (après 6 semaines, un sujet = 1 page entière)',
      'Processus : 1h réunion → 1h réécriture CR → export PDF → diffusion mail',
    ],
    roi: '8h/semaine → 1-2h/semaine avec automatisation CR. Gain ~300h/an',
  },
  {
    title: 'Recherche de documents et réponse emails',
    time: '~30min/jour',
    details: [
      'Chasse aux documents historiques dans mails, rapports, photos',
      'Très chronophage quand on reprend un projet après des semaines d\'absence',
      'Pas de centralisation : infos dispersées entre OneDrive, mail, Excel, chat',
    ],
    roi: '~2,5h/semaine → réduction de 60-70% avec recherche centralisée',
  },
  {
    title: 'Création de nouvelles missions',
    time: 'Plusieurs heures par mission',
    details: [
      'Aucun moyen simple de dupliquer une structure de mission dans Notion',
      'Nouvelle mission = tout remonter manuellement',
      'Veulent des templates par type de mission (gestion technique, AMO, gestion de services)',
    ],
    roi: 'Sur 4-6 nouvelles missions/an → templates = quelques minutes au lieu d\'heures',
  },
  {
    title: 'Navigation et UX Notion',
    time: 'Friction permanente',
    details: [
      '"Téléportation" quand on ouvre une page : perte de contexte',
      'Trop de vues, trop de liens, trop d\'infos visuelles',
      'Pages vides jamais remplies',
      'PPA apparaît comme section séparée alors que c\'est une sous-mission de l\'OCDE',
    ],
    roi: 'Simplification de la navigation → adoption Notion',
  },
];

function PointsFriction() {
  return (
    <motion.div {...fadeUp(0.24)} className="glass-card rounded-2xl px-10 py-10">
      <div className="eyebrow mb-4">Diagnostic</div>
      <h3 className="text-xl font-bold text-slate-900 mb-8">Points de friction identifiés</h3>

      <div className="space-y-8">
        {frictions.map((f, i) => (
          <div key={i} className={i > 0 ? 'border-t border-slate-200/40 pt-8' : ''}>
            <div className="flex items-start gap-3 mb-3">
              <span className="shrink-0 w-7 h-7 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold mt-0.5">{i + 1}</span>
              <div>
                <div className="text-base font-bold text-slate-900">{f.title}</div>
                <div className="text-xs text-slate-500 font-medium">{f.time}</div>
              </div>
            </div>
            <ul className="space-y-1.5 ml-10 mb-3">
              {f.details.map((d, j) => (
                <li key={j} className="text-sm text-slate-700 flex items-start gap-2">
                  <span className="text-slate-400 mt-1 shrink-0">·</span>{d}
                </li>
              ))}
            </ul>
            <div className="ml-10 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-md px-3 py-1.5 inline-block">
              ROI : {f.roi}
            </div>
          </div>
        ))}
      </div>

      <SlideNotes id="meeting-frictions" />
    </motion.div>
  );
}

/* ── Slide 5: Ce qui marche bien ── */
const bonPoints = [
  {
    title: 'Base clients/contacts',
    desc: 'Simple, a les infos nécessaires, la section la plus remplie. Mais trop de champs liés qui remontent des infos non pertinentes → nettoyage nécessaire.',
  },
  {
    title: 'Suivi PPA (OCDE)',
    desc: 'Structure par phases (Étude → Consultation → Travaux → Réception). Chaque ligne = numéro de travaux interne client. Tâches/sous-tâches avec priorités et deadlines. Claude a même rempli un tableau depuis des rapports PDF. C\'est le modèle à dupliquer.',
  },
  {
    title: 'Partage de CR via Notion',
    desc: 'Landry a réussi à partager des pages publiques Notion comme CR. Fonctionne bien mais les clients institutionnels français préfèrent les PDF classiques.',
  },
];

function CeQuiMarche() {
  return (
    <motion.div {...fadeUp(0.32)} className="glass-card rounded-2xl px-10 py-10 accent-emerald">
      <div className="eyebrow mb-4">À conserver</div>
      <h3 className="text-xl font-bold text-slate-900 mb-8">Ce qui marche bien</h3>

      <div className="space-y-6">
        {bonPoints.map((p, i) => (
          <div key={i} className="flex gap-4">
            <span className="shrink-0 w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold mt-0.5">✓</span>
            <div>
              <div className="text-sm font-bold text-slate-900 mb-1">{p.title}</div>
              <p className="text-sm text-slate-700 leading-relaxed">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <SlideNotes id="meeting-ce-qui-marche" />
    </motion.div>
  );
}

/* ── Slide 6: Contraintes & Migration ── */
function ContraintesMigration() {
  return (
    <motion.div {...fadeUp(0.4)} className="glass-card rounded-2xl px-10 py-10">
      <div className="eyebrow mb-4">Contraintes</div>
      <h3 className="text-xl font-bold text-slate-900 mb-8">Contraintes client & migration</h3>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="text-xs font-semibold text-rose-600 uppercase tracking-wider mb-3">Contrainte majeure</div>
          <p className="text-sm text-slate-700 leading-relaxed mb-4">
            Clients institutionnels français (fonds d&apos;investissement) très conservateurs. Travaillent sur Outlook/Excel. Réfractaires aux liens partagés, Google Sheets, pages Notion.
          </p>
          <div className="text-sm font-medium text-rose-700 bg-rose-50 rounded-md px-3 py-2">
            Toute solution doit inclure un export PDF/Excel propre pour la diffusion externe.
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Migration de données</div>
          <ul className="space-y-2">
            {[
              'Depuis novembre, rien n\'a été mis dans Notion',
              'Pas besoin de tout remettre : repartir à l\'instant T',
              'Investissement d\'une demi-journée à une journée pour rattraper',
              'Templates par type de mission (gestion technique, AMO, gestion de services)',
            ].map((t, i) => (
              <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                <span className="text-slate-400 mt-1 shrink-0">·</span>{t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <SlideNotes id="meeting-contraintes" />
    </motion.div>
  );
}
