'use client'

import { useState, useEffect, type ReactNode } from 'react';
import { motion } from 'framer-motion';

const ACCESS_CODE = 'mapig2026';
const STORAGE_KEY = 'mapig-unlocked';

export function CodeGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY) === 'true') {
      setUnlocked(true);
    }
    setHydrated(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().toLowerCase() === ACCESS_CODE) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setUnlocked(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 600);
    }
  };

  if (!hydrated) return null;
  if (unlocked) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="glass-card rounded-2xl px-10 py-12 w-full max-w-sm text-center"
      >
        <h1 className="text-lg font-bold text-slate-900 tracking-tight mb-1">
          TRAX AI <span className="text-slate-400 font-normal mx-1">x</span> MAPIG
        </h1>
        <p className="text-sm text-slate-500 mb-8">Entrez le code d&apos;accès</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            animate={error ? { x: [0, -12, 12, -8, 8, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <input
              type="password"
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(false); }}
              placeholder="Code d'accès"
              autoFocus
              className={`w-full soft-input rounded-lg px-4 py-3 text-center text-sm font-medium tracking-widest transition-all ${
                error ? 'ring-2 ring-rose-400' : ''
              }`}
            />
          </motion.div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-rose-500 font-medium"
            >
              Code incorrect
            </motion.p>
          )}

          <button
            type="submit"
            className="w-full bg-slate-900 text-white text-sm font-semibold py-3 rounded-lg hover:bg-slate-800 active:scale-[0.98] transition-all"
          >
            Accéder
          </button>
        </form>
      </motion.div>
    </div>
  );
}
