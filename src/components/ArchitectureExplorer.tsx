'use client'

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudit } from '@/context/AuditContext';
import auditData from '@/data/audit-data.json';

/* ------------------------------------------------------------------ */
/*  SHARED TYPES & GRAPH RENDERER                                     */
/* ------------------------------------------------------------------ */

interface GraphNode {
  id: string;
  icon: string;
  name: string;
  relations: string[];
  color?: string;
  tag?: string;
  tagType?: 'warning' | 'smart' | 'dead' | 'pillar';
  desc: string;
  /** Audit page name(s) this node corresponds to in audit-data.json */
  auditPages?: string[];
}

interface GraphEdge { from: string; to: string }

const GRAPH_THEME = {
  edgeActive: '#6366f1',
  edgeBase: 'rgba(51, 65, 85, 0.22)',
  edgeDim: 'rgba(51, 65, 85, 0.08)',
  ringActive: '#6366f1',
  ringConnected: 'rgba(99, 102, 241, 0.45)',
  ringIdle: 'rgba(51, 65, 85, 0.2)',
  badgeHigh: '#e11d48',
  badgeMid: '#d97706',
  badgeLow: '#6366f1',
} as const;

/** Returns a transparent health fill color (green/yellow/red) or null */
function healthFill(pct: number | null): string | null {
  if (pct === null) return null;
  if (pct >= 70) return 'rgba(16, 185, 129, 0.22)';   // emerald
  if (pct >= 40) return 'rgba(245, 158, 11, 0.22)';    // amber
  return 'rgba(225, 29, 72, 0.22)';                    // rose
}

/** Returns a transparent health ring color */
function healthRing(pct: number | null): string | null {
  if (pct === null) return null;
  if (pct >= 70) return 'rgba(16, 185, 129, 0.7)';
  if (pct >= 40) return 'rgba(245, 158, 11, 0.7)';
  return 'rgba(225, 29, 72, 0.7)';
}

function dedupeEdges(nodes: GraphNode[]): GraphEdge[] {
  const set = new Set<string>();
  const edges: GraphEdge[] = [];
  nodes.forEach(n => {
    n.relations.forEach(r => {
      if (r === n.id) return;
      const key = [n.id, r].sort().join('--');
      if (!set.has(key)) { set.add(key); edges.push({ from: n.id, to: r }); }
    });
  });
  return edges;
}

function ellipsePositions(nodeList: GraphNode[], cx: number, cy: number, rx: number, ry: number, innerIds?: string[]) {
  const positions: Record<string, { x: number; y: number }> = {};
  const outer = innerIds ? nodeList.filter(n => !innerIds.includes(n.id)) : nodeList;
  const inner = innerIds ? nodeList.filter(n => innerIds.includes(n.id)) : [];

  outer.forEach((n, i) => {
    const angle = (2 * Math.PI * i) / outer.length - Math.PI / 2;
    positions[n.id] = { x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle) };
  });
  inner.forEach((n, i) => {
    const angle = (2 * Math.PI * (i + 0.5)) / Math.max(inner.length, 1) - Math.PI / 2;
    positions[n.id] = { x: cx + rx * 0.4 * Math.cos(angle), y: cy + ry * 0.4 * Math.sin(angle) };
  });
  return positions;
}


/* ------------------------------------------------------------------ */
/*  PER-NODE HEALTH HOOK (used in graph via prop drilling)            */
/* ------------------------------------------------------------------ */

function useNodeHealthMap(nodes: GraphNode[]): Record<string, number | null> {
  const { state } = useAudit();
  const result: Record<string, number | null> = {};

  const normalise = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '');

  const pillarData = auditData as { pillar: string; pages: { pageName: string; items: { element: string }[] }[] }[];

  nodes.forEach(node => {
    const pagesToMatch = node.auditPages ?? [node.name];
    let evaluated = 0, optimal = 0;
    pillarData.forEach(pillar => {
      pillar.pages.forEach(page => {
        const match = pagesToMatch.some(pn =>
          normalise(page.pageName).includes(normalise(pn)) ||
          normalise(pn).includes(normalise(page.pageName))
        );
        if (!match) return;
        page.items.forEach(item => {
          const id = `${pillar.pillar}-${page.pageName}-${item.element}`;
          const s = state[id]?.status;
          if (s) {
            evaluated++;
            if (s === '✅') optimal++;
          }
        });
      });
    });
    result[node.id] = evaluated > 0 ? Math.round((optimal / evaluated) * 100) : null;
  });

  return result;
}

function InteractiveGraph({ nodes, edges, positions, width, height, subtitle, healthMap }: {
  nodes: GraphNode[]; edges: GraphEdge[];
  positions: Record<string, { x: number; y: number }>;
  width: number; height: number; subtitle?: string;
  healthMap?: Record<string, number | null>;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const activeId = hoveredId || selectedId;
  const activeNode = activeId ? nodes.find(n => n.id === activeId) : null;

  const connectedIds = useMemo(() => {
    if (!activeId) return new Set<string>();
    const node = nodes.find(n => n.id === activeId);
    if (!node) return new Set<string>();
    const s = new Set(node.relations.filter(r => r !== activeId));
    s.add(activeId);
    return s;
  }, [activeId, nodes]);

  return (
    <div className="rounded-2xl overflow-hidden relative bg-slate-50/70 border border-slate-200/60" style={{ boxShadow: '0 2px 12px rgba(15,23,42,0.04)' }}>
      {subtitle && (
        <div className="absolute top-3 left-4 eyebrow select-none">{subtitle}</div>
      )}
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" style={{ maxHeight: '75vh' }}>
        {edges.map((edge, i) => {
          const fp = positions[edge.from], tp = positions[edge.to];
          if (!fp || !tp) return null;
          const isHl = activeId && (edge.from === activeId || edge.to === activeId);
          const isDim = activeId && !isHl;
          const mx = (fp.x + tp.x) / 2, my = (fp.y + tp.y) / 2;
          const dx = tp.x - fp.x, dy = tp.y - fp.y;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const curv = 18 + (i % 3) * 10;
          const cpx = mx + (-dy / len) * curv, cpy = my + (dx / len) * curv;
          return (
            <path key={`${edge.from}-${edge.to}`}
              d={`M ${fp.x} ${fp.y} Q ${cpx} ${cpy} ${tp.x} ${tp.y}`}
              fill="none"
              stroke={isHl ? GRAPH_THEME.edgeActive : isDim ? GRAPH_THEME.edgeDim : GRAPH_THEME.edgeBase}
              strokeWidth={isHl ? 2.5 : 1}
              className="transition-all duration-300"
            />
          );
        })}

        {nodes.map(node => {
          const pos = positions[node.id];
          if (!pos) return null;
          const isActive = activeId === node.id;
          const isConn = connectedIds.has(node.id);
          const isDim = activeId ? !isConn : false;
          const rc = node.relations.filter(r => r !== node.id).length;
          const nr = 24 + rc * 1.8;

          const pct = healthMap ? healthMap[node.id] ?? null : null;
          const hFill = healthFill(pct);
          const hRing = healthRing(pct);

          let ring = hRing || node.color || GRAPH_THEME.ringIdle;
          if (node.tagType === 'dead') ring = 'rgba(100, 116, 139, 0.35)';
          if (isActive) ring = GRAPH_THEME.ringActive;
          else if (isConn && activeId) ring = GRAPH_THEME.ringConnected;

          const baseFill = hFill ?? (node.tagType === 'dead' ? 'rgba(241,245,249,0.5)' : 'rgba(255,255,255,0.48)');
          const activeFill = hFill
            ? hFill.replace('0.22', '0.38')
            : 'rgba(99,102,241,0.12)';

          return (
            <g key={node.id} className="cursor-pointer"
              onMouseEnter={() => setHoveredId(node.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelectedId(selectedId === node.id ? null : node.id)}
              style={{ transition: 'opacity 0.3s', opacity: isDim ? 0.12 : 1 }}
            >
              {isActive && <circle cx={pos.x} cy={pos.y} r={nr + 12} fill="none" stroke={GRAPH_THEME.ringActive} strokeWidth={1} opacity={0.3} />}
              {/* Health outer glow ring when health data exists */}
              {pct !== null && !isActive && (
                <circle cx={pos.x} cy={pos.y} r={nr + 5} fill="none"
                  stroke={hRing ?? 'transparent'} strokeWidth={3} opacity={isDim ? 0 : 0.5}
                />
              )}
              <circle cx={pos.x} cy={pos.y} r={nr}
                fill={isActive ? activeFill : baseFill}
                stroke={ring} strokeWidth={isActive ? 2.5 : 1.5}
              />
              <text x={pos.x} y={pos.y - 4} textAnchor="middle" dominantBaseline="middle" fontSize={17}>{node.icon}</text>
              <text x={pos.x} y={pos.y + 15} textAnchor="middle" dominantBaseline="middle" fontSize={9.5} fontWeight={600}
                fill={isDim ? 'rgba(51,65,85,0.25)' : 'rgba(30,41,59,0.88)'} className="select-none"
              >{node.name}</text>
              {rc > 0 && (
                <>
                  <circle cx={pos.x + nr - 3} cy={pos.y - nr + 5} r={9}
                    fill={rc >= 8 ? GRAPH_THEME.badgeHigh : rc >= 5 ? GRAPH_THEME.badgeMid : GRAPH_THEME.badgeLow}
                  />
                  <text x={pos.x + nr - 3} y={pos.y - nr + 6} textAnchor="middle" dominantBaseline="middle" fontSize={8} fontWeight={700} fill="white">{rc}</text>
                </>
              )}
              {/* Health % label below node */}
              {pct !== null && !isDim && (
                <text x={pos.x} y={pos.y + nr + 13} textAnchor="middle" dominantBaseline="middle" fontSize={8} fontWeight={700}
                  fill={pct >= 70 ? '#059669' : pct >= 40 ? '#d97706' : '#e11d48'}
                  className="select-none"
                >{pct}%</text>
              )}
              {node.tag && !isDim && pct === null && (
                <text x={pos.x} y={pos.y + nr + 13} textAnchor="middle" dominantBaseline="middle" fontSize={7} fontWeight={700}
                  fill={node.tagType === 'warning' ? '#e11d48' : node.tagType === 'dead' ? '#64748b' : node.tagType === 'pillar' ? (node.color || '#64748b') : '#059669'}
                  letterSpacing={0.5} className="uppercase select-none"
                >{node.tag}</text>
              )}
            </g>
          );
        })}
      </svg>

      <AnimatePresence>
        {activeNode && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-lg border border-slate-200/80 rounded-xl p-4 flex items-start gap-4 shadow-xl"
          >
            <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-2xl shrink-0">{activeNode.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h4 className="text-lg font-bold text-slate-900">{activeNode.name}</h4>
                {activeNode.relations.length > 0 && (
                  <span className="text-xs font-mono bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                    {activeNode.relations.filter(r => r !== activeNode.id).length} connexions
                  </span>
                )}
                {healthMap && healthMap[activeNode.id] !== null && healthMap[activeNode.id] !== undefined && (() => {
                  const p = healthMap[activeNode.id]!;
                  const cls = p >= 70 ? 'bg-emerald-100 text-emerald-700' : p >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700';
                  const label = p >= 70 ? '🟢' : p >= 40 ? '🟡' : '🔴';
                  return <span className={`text-xs font-mono px-2 py-0.5 rounded ${cls}`}>{label} {p}% optimal</span>;
                })()}
                {activeNode.tag && !(healthMap && healthMap[activeNode.id] !== null) && (
                  <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                    activeNode.tagType === 'warning' ? 'bg-rose-100 text-rose-700' :
                    activeNode.tagType === 'dead' ? 'bg-slate-100 text-slate-500' :
                    activeNode.tagType === 'pillar' ? 'bg-slate-100 text-slate-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>{activeNode.tag}</span>
                )}
              </div>
              <p className="text-sm text-slate-600 mt-1">{activeNode.desc}</p>
              {activeNode.relations.filter(r => r !== activeNode.id).length > 0 && (
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {activeNode.relations.filter(r => r !== activeNode.id).map(r => {
                    const rn = nodes.find(n => n.id === r);
                    return <span key={r} className="text-xs bg-white border border-slate-200 rounded px-2 py-0.5 text-slate-600">{rn?.icon} {rn?.name}</span>;
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Health legend */}
      {healthMap && Object.values(healthMap).some(v => v !== null) && (
        <div className="absolute top-2.5 right-3 flex items-center gap-3 text-[10px] text-slate-500 font-semibold select-none bg-white/70 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-slate-200/40">
          <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(16,185,129,0.7)' }} />Bon</span>
          <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(245,158,11,0.7)' }} />Moyen</span>
          <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(225,29,72,0.7)' }} />Critique</span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  GRAPH 1: DATABASE RELATIONS                                       */
/* ------------------------------------------------------------------ */

const dbNodes: GraphNode[] = [
  { id: 'tache', icon: '→', name: 'Tâche', relations: ['mission', 'client', 'contact', 'prestataire', 'occupant', 'sous-tache', 'ppa', 'document', 'notes'], tag: 'LA PLUS CONNECTÉE', tagType: 'warning', desc: "10 relations, 4 formules. Chaque tâche est connectée à quasi tout.", auditPages: ['DB_MAP_Tâche'] },
  { id: 'contact', icon: '👤', name: 'Contact', relations: ['client', 'prestataire', 'occupant', 'mission', 'tache', 'sous-tache', 'document', 'notes', 'ppa'], tag: 'LA PLUS COMPLEXE', tagType: 'warning', desc: "9 relations + formule auto type client/presta. Un mur de champs.", auditPages: ['Contact'] },
  { id: 'notes', icon: '📝', name: 'Notes', relations: ['client', 'contact', 'prestataire', 'occupant', 'mission', 'tache', 'document', 'ppa'], desc: "8 relations. Connectée à tout sauf sous-tâches.", auditPages: ['Note'] },
  { id: 'mission', icon: '📁', name: 'Mission', relations: ['client', 'contact', 'prestataire', 'tache', 'document', 'notes', 'ppa'], tag: 'ENTITÉ CŒUR', tagType: 'warning', desc: "7 relations, 2 formules (% avancement, nb tâches). Tout gravite autour.", auditPages: ['Mission', 'DB_MAP_Mission'] },
  { id: 'document', icon: '📄', name: 'Document', relations: ['client', 'contact', 'prestataire', 'mission', 'tache', 'notes', 'ppa'], tag: 'ALERTES', tagType: 'smart', desc: "7 relations + alertes préavis contrat. Feature utile si comprise.", auditPages: ['Document'] },
  { id: 'client', icon: '⭐', name: 'Client', relations: ['contact', 'mission', 'tache', 'document', 'notes', 'ppa'], desc: "6 relations. Point d'entrée donneur d'ordre.", auditPages: ['Client'] },
  { id: 'prestataire', icon: '🏭', name: 'Prestataire', relations: ['contact', 'mission', 'tache', 'document', 'notes', 'ppa'], desc: "6 relations. Sous-traitants et fournisseurs.", auditPages: ['Prestataire', 'DB_MAP_Prestataire'] },
  { id: 'ppa', icon: '📊', name: 'PPA', relations: ['client', 'contact', 'prestataire', 'mission', 'tache', 'document', 'notes'], desc: "Connecté à tout. Phasage projet (Étude→Consultation→Travaux→Réception).", auditPages: ['PPA'] },
  { id: 'sous-tache', icon: '↳', name: 'Sous-tâche', relations: ['tache', 'contact', 'sous-tache'], desc: "4 relations dont auto-référence (bloqué par/bloque). 12 phases chantier.", auditPages: ['DB_MAP_Sous tâche'] },
  { id: 'occupant', icon: '🏢', name: 'Occupant', relations: ['contact', 'notes', 'tache'], desc: "3 relations. Locataires des sites. Candidat fusion avec Contact.", auditPages: ['Occupant', 'DB_MAP_Occupant'] },
  { id: 'widget', icon: '⬜', name: 'Widget', relations: [], tag: 'INUTILISÉ', tagType: 'dead', desc: "Aucune relation. 1 seul champ titre. Candidat suppression.", auditPages: ['DB_MAP_Widget'] },
  { id: 'contrat', icon: '📋', name: 'Gestion contrat', relations: [], tag: 'REDONDANT', tagType: 'dead', desc: "Aucune relation. Doublon probable avec Document.", auditPages: ['Pilotage contrat'] },
];

/* ------------------------------------------------------------------ */
/*  GRAPH 2: NAVIGATION PAGES                                        */
/* ------------------------------------------------------------------ */

const BLUE = '#5ba3c9';
const GREEN = '#6bb57e';
const RED = '#e06060';
const PURPLE = '#b388d9';

/*
  Relations below represent ONLY genuine content-level navigation — i.e. links
  a user would click from within a page's own content (embedded views, related DB
  links, buttons pointing to another page). The synced nav bar is excluded because
  it provides the same 15 targets universally from every page and is what makes
  the graph a nearly-complete mesh. Removing it reveals the actual intentional
  content topology.

  Mapping per page (source → destination when you use content on that page):
  - home       → ma-journee, synthese, db-map  (entry-point tiles + admin link)
  - ma-journee → tache-transverse (task quick-add), mission (task opened → mission)
  - vue-equipes→ ma-journee (same DB filtered by person)
  - note       → mission (inline relation), client (inline relation), contact (inline relation), document (attached to note)
  - document   → mission (relation), client (relation), pilotage-contrat (contract alert links)
  - synthese   → mission, ppa, tache-transverse  (3 inline views)
  - tache-transverse → mission, ppa  (filtered views of those DBs)
  - mission    → client, ppa, prestataire, travaux-presta (drill-down from mission card)
  - ppa        → mission, tache-transverse  (PPA phases link to tasks)
  - prestataire→ mission, contact, travaux-presta  (annuaire → missions & contacts)
  - pilotage-contrat → document, prestataire  (contract ↔ doc + presta)
  - travaux-presta → prestataire, mission  (tasks filtered by presta)
  - client     → mission, contact  (client card → missions & contacts)
  - contact    → client, prestataire, mission  (contact card → org + missions)
  - occupant   → contact, mission  (occupant → contact merge candidate + mission)
  - travaux-client → client, mission  (tasks filtered by client)
  - db-map     → (admin only, no content nav)
*/

const pageNodes: GraphNode[] = [
  // Hub — home links to daily pages via tiles
  {
    id: 'home', icon: '🏠', name: 'Espace MAPIG',
    relations: ['ma-journee', 'synthese', 'db-map'],
    color: 'rgba(100,100,100,0.4)', tag: "PAGE D'ACCUEIL", tagType: 'pillar',
    desc: "Page racine. Hub avec tuiles vers les piliers principaux + lien admin DB_MAP.",
    auditPages: ['Espace MAPIG (Home)'],
  },
  // Blue — Opération Quotidienne
  {
    id: 'ma-journee', icon: '📅', name: 'Ma journée',
    relations: ['home', 'vue-equipes', 'tache-transverse', 'mission'],
    color: BLUE, tag: 'QUOTIDIEN', tagType: 'pillar',
    desc: "Dashboard perso, mes tâches du jour. Bouton ajout rapide → tâche transverse. Tâches liées à missions.",
    auditPages: ['Ma journée'],
  },
  {
    id: 'vue-equipes', icon: '👥', name: 'Vue équipes',
    relations: ['ma-journee'],
    color: BLUE, tag: 'QUOTIDIEN', tagType: 'pillar',
    desc: "Vue par équipe. Même DB que Ma journée, juste filtrée différemment. Overkill pour 2 personnes.",
    auditPages: ['Vue équipes'],
  },
  {
    id: 'note', icon: '📝', name: 'Note',
    relations: ['mission', 'client', 'contact', 'document'],
    color: BLUE, tag: 'QUOTIDIEN', tagType: 'pillar',
    desc: "Notes de réunion. Relations inline vers Mission, Client, Contact, Document.",
    auditPages: ['Note'],
  },
  {
    id: 'document', icon: '📄', name: 'Document',
    relations: ['mission', 'client', 'pilotage-contrat'],
    color: BLUE, tag: 'QUOTIDIEN', tagType: 'pillar',
    desc: "Fichiers & contrats. Vue inline DB_MAP_Document. Alerte préavis → lien vers Pilotage contrat.",
    auditPages: ['Document'],
  },
  // Green — Travaux
  {
    id: 'synthese', icon: '🧭', name: 'Synthèse',
    relations: ['home', 'mission', 'ppa', 'tache-transverse'],
    color: GREEN, tag: 'TRAVAUX', tagType: 'pillar',
    desc: "Dashboard 3 colonnes avec vues inline Mission, PPA, Tâches transverses.",
    auditPages: ['Synthèse (Dashboard)'],
  },
  {
    id: 'tache-transverse', icon: '↔️', name: 'Tâche transverse',
    relations: ['mission', 'ppa'],
    color: GREEN, tag: 'TRAVAUX', tagType: 'pillar',
    desc: "Tâches multi-projets filtrées. Liens vers Mission et PPA si remplis.",
    auditPages: ['Tâche transverse'],
  },
  {
    id: 'mission', icon: '📁', name: 'Mission',
    relations: ['client', 'ppa', 'prestataire', 'travaux-presta'],
    color: GREEN, tag: 'TRAVAUX', tagType: 'pillar',
    desc: "Tous les projets. Depuis une fiche Mission: accès Client, PPA, Prestataires, Travaux.",
    auditPages: ['Mission'],
  },
  {
    id: 'ppa', icon: '📊', name: 'PPA',
    relations: ['mission', 'tache-transverse'],
    color: GREEN, tag: 'TRAVAUX', tagType: 'pillar',
    desc: "Phasage projet. Phases PPA liées à Mission + tâches transverses.",
    auditPages: ['PPA (Phasage)'],
  },
  // Red — Prestataires
  {
    id: 'prestataire', icon: '🏗️', name: 'Prestataire',
    relations: ['mission', 'contact', 'travaux-presta'],
    color: RED, tag: 'PRESTATAIRES', tagType: 'pillar',
    desc: "Annuaire prestataires. Depuis fiche: accès Mission, Contact, Travaux/presta.",
    auditPages: ['Prestataire'],
  },
  {
    id: 'pilotage-contrat', icon: '📋', name: 'Pilotage contrat',
    relations: ['document', 'prestataire'],
    color: RED, tag: 'PRESTATAIRES', tagType: 'pillar',
    desc: "Suivi contrats. Lié à Document (doublon alerte) et Prestataire.",
    auditPages: ['Pilotage contrat'],
  },
  {
    id: 'travaux-presta', icon: '🔧', name: 'Travaux/presta',
    relations: ['prestataire', 'mission'],
    color: RED, tag: 'PRESTATAIRES', tagType: 'pillar',
    desc: "Tâches filtrées par prestataire. PAGE VIDE, relations Prestataire↔Tâche non remplies.",
    auditPages: ['Travaux par prestataire'],
  },
  // Purple — Client & Contact
  {
    id: 'client', icon: '⭐', name: 'Client',
    relations: ['mission', 'contact'],
    color: PURPLE, tag: 'CLIENT', tagType: 'pillar',
    desc: "Annuaire clients. Depuis fiche: accès Missions et Contacts associés.",
    auditPages: ['Client'],
  },
  {
    id: 'contact', icon: '👤', name: 'Contact',
    relations: ['client', 'prestataire', 'mission'],
    color: PURPLE, tag: 'CLIENT', tagType: 'pillar',
    desc: "Personnes. Depuis fiche Contact: accès Client (org), Prestataire (si presta), Mission.",
    auditPages: ['Contact'],
  },
  {
    id: 'occupant', icon: '🏢', name: 'Occupant',
    relations: ['contact', 'mission'],
    color: PURPLE, tag: 'CLIENT', tagType: 'pillar',
    desc: "Locataires des sites. Doublon pur, candidat fusion avec Contact. Lié à Mission.",
    auditPages: ['Occupant'],
  },
  {
    id: 'travaux-client', icon: '🔨', name: 'Travaux/client',
    relations: ['client', 'mission'],
    color: PURPLE, tag: 'CLIENT', tagType: 'pillar',
    desc: "Tâches filtrées par client. Quasi VIDE, filtre avancement trop restrictif.",
    auditPages: ['Travaux par client'],
  },
  // Hidden admin
  {
    id: 'db-map', icon: '🗄️', name: 'Database MAP',
    relations: ['home'],
    color: 'rgba(255,255,255,0.1)', tag: 'ADMIN CACHÉ', tagType: 'dead',
    desc: "Page admin cachée contenant les 12 bases brutes. Les users ne la voient jamais.",
    auditPages: ['Database MAP (admin)'],
  },
];

/* ------------------------------------------------------------------ */
/*  MAIN EXPORT                                                       */
/* ------------------------------------------------------------------ */

export function ArchitectureExplorer() {
  const dbEdges = useMemo(() => dedupeEdges(dbNodes), []);
  const pageEdges = useMemo(() => dedupeEdges(pageNodes), []);

  const dbHealthMap = useNodeHealthMap(dbNodes);
  const pageHealthMap = useNodeHealthMap(pageNodes);

  const W = 900, H = 700;
  const dbPositions = useMemo(() => ellipsePositions(dbNodes, W / 2, H / 2, 340, 270, ['widget', 'contrat']), []);
  const pagePositions = useMemo(() => ellipsePositions(pageNodes, W / 2, H / 2, 370, 290, ['db-map']), []);

  const totalRelFields = dbNodes.reduce((a, n) => a + n.relations.filter(r => r !== n.id).length, 0);

  const hasAnyDbHealth = Object.values(dbHealthMap).some(v => v !== null);
  const hasAnyPageHealth = Object.values(pageHealthMap).some(v => v !== null);

  return (
    <div className="space-y-16">
      {/* SECTION 1: Database Relations */}
      <section className="space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shrink-0">1</div>
            <h3 className="text-lg font-bold text-slate-900">Architecture Relationnelle, Les 12 Bases</h3>
          </div>
          <p className="text-sm text-slate-600 ml-11">
            Survolez une base pour voir ses connexions directes. Plus il y a de lignes, plus c&apos;est complexe.
            {hasAnyDbHealth && <span className="ml-2 text-indigo-700 font-semibold">Les couleurs reflètent vos évaluations.</span>}
          </p>
          <div className="flex gap-6 mt-3 ml-11 text-sm text-slate-500">
            <span>12 bases</span>
            <span className="text-indigo-600 font-semibold">{dbEdges.length} connexions</span>
            <span className="text-rose-600 font-semibold">~{totalRelFields} champs relation</span>
          </div>
        </div>

        <InteractiveGraph nodes={dbNodes} edges={dbEdges} positions={dbPositions} width={W} height={H} subtitle="BASES DE DONNÉES" healthMap={dbHealthMap} />

        <div className="flex gap-8 ml-11">
          <div>
            <div className="text-2xl font-bold text-rose-700">~60</div>
            <div className="text-xs text-slate-500 mt-0.5">Champs de relation</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-700">12</div>
            <div className="text-xs text-slate-500 mt-0.5">Bases pour 2 personnes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-indigo-700">{dbEdges.length}</div>
            <div className="text-xs text-slate-500 mt-0.5">Connexions inter-bases</div>
          </div>
        </div>
      </section>

      {/* Section divider */}
      <div className="border-t border-slate-200/50" />

      {/* SECTION 2: Navigation Pages */}
      <section className="space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shrink-0">2</div>
            <h3 className="text-lg font-bold text-slate-900">Navigation, Les 16 Pages de Vue</h3>
          </div>
          <p className="text-sm text-slate-600 ml-11">
            Connexions basées sur la <strong>navigation contenu réelle</strong> de chaque page.
            La synced nav bar est exclue pour révéler la topologie intentionnelle.
            {hasAnyPageHealth && <span className="ml-2 text-indigo-700 font-semibold">Couleur = santé d&apos;après votre grille.</span>}
          </p>
          <div className="flex gap-5 mt-3 ml-11 text-sm text-slate-500 flex-wrap">
            <span><span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ background: BLUE }} />Quotidien</span>
            <span><span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ background: GREEN }} />Travaux</span>
            <span><span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ background: RED }} />Prestataires</span>
            <span><span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ background: PURPLE }} />Client</span>
          </div>
        </div>

        <InteractiveGraph nodes={pageNodes} edges={pageEdges} positions={pagePositions} width={W} height={H} subtitle="PAGES DE VUE" healthMap={pageHealthMap} />

        <div className="flex gap-8 ml-11">
          <div>
            <div className="text-2xl font-bold text-rose-700">{pageEdges.length}</div>
            <div className="text-xs text-slate-500 mt-0.5">Liens de navigation croisés</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-700">16</div>
            <div className="text-xs text-slate-500 mt-0.5">Pages pour 2 personnes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-indigo-700">13+</div>
            <div className="text-xs text-slate-500 mt-0.5">Cibles nav (synced bar)</div>
          </div>
        </div>
      </section>
    </div>
  );
}
