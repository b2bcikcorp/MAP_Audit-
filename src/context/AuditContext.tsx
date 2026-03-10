'use client'

import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';

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
const AuditContext = createContext<AuditContextType | undefined>(undefined);

export function AuditProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuditState>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setState(JSON.parse(saved));
    } catch { /* ignore corrupt data */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, hydrated]);

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
