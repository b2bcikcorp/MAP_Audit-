'use client'

import React, { createContext, useContext, useCallback, useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export type Status = '✅' | '⚠️' | '❌' | null;

export interface ItemState {
  status: Status;
  notes: string;
}

export type AuditState = Record<string, ItemState>;

interface AuditContextType {
  state: AuditState;
  updateStatus: (id: string, status: Status) => void;
  updateNotes: (id: string, notes: string) => void;
  resetAll: () => void;
}

const STORAGE_KEY = 'mapig-audit-state';
const SUPABASE_ROW_ID = 'mapig-audit';
const SYNC_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

const AuditContext = createContext<AuditContextType | undefined>(undefined);

async function loadFromSupabase(): Promise<AuditState | null> {
  try {
    const { data, error } = await supabase
      .from('audit_state')
      .select('data')
      .eq('id', SUPABASE_ROW_ID)
      .single();
    if (error || !data) return null;
    const parsed = data.data as AuditState;
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

async function saveToSupabase(state: AuditState): Promise<void> {
  try {
    await supabase
      .from('audit_state')
      .upsert({ id: SUPABASE_ROW_ID, data: state, updated_at: new Date().toISOString() });
  } catch { /* silent fail, localStorage is the primary store */ }
}

export function AuditProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuditState>({});
  const [hydrated, setHydrated] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef = useRef<AuditState>({});

  stateRef.current = state;

  useEffect(() => {
    async function hydrate() {
      let loaded: AuditState = {};

      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) loaded = JSON.parse(saved);
      } catch { /* ignore */ }

      if (Object.keys(loaded).length === 0) {
        const remote = await loadFromSupabase();
        if (remote) {
          loaded = remote;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
        }
      }

      setState(loaded);
      setHydrated(true);
    }
    hydrate();
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, hydrated]);

  useEffect(() => {
    if (!hydrated) return;

    saveToSupabase(stateRef.current);

    intervalRef.current = setInterval(() => {
      saveToSupabase(stateRef.current);
    }, SYNC_INTERVAL_MS);

    const handleBeforeUnload = () => {
      saveToSupabase(stateRef.current);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hydrated]);

  const updateStatus = useCallback((id: string, status: Status) => {
    setState(prev => ({
      ...prev,
      [id]: { status, notes: prev[id]?.notes || '' }
    }));
  }, []);

  const updateNotes = useCallback((id: string, notes: string) => {
    setState(prev => ({
      ...prev,
      [id]: { status: prev[id]?.status || null, notes }
    }));
  }, []);

  const resetAll = useCallback(() => {
    if (window.confirm('Voulez-vous vraiment réinitialiser toutes les données ?')) {
      setState({});
      localStorage.removeItem(STORAGE_KEY);
      saveToSupabase({});
    }
  }, []);

  return (
    <AuditContext.Provider value={{ state, updateStatus, updateNotes, resetAll }}>
      {children}
    </AuditContext.Provider>
  );
}

export function useAudit() {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error('useAudit must be used within an AuditProvider');
  }
  return context;
}
