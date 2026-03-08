'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Status = '✅' | '⚠️' | '❌' | '🔨' | '🔧' | null;

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

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export function AuditProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuditState>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mapig-audit-state');
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('mapig-audit-state', JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const updateStatus = (id: string, status: Status) => {
    setState(prev => ({
      ...prev,
      [id]: { status, notes: prev[id]?.notes || '' }
    }));
  };

  const updateNotes = (id: string, notes: string) => {
    setState(prev => ({
      ...prev,
      [id]: { status: prev[id]?.status || null, notes }
    }));
  };

  const resetAll = () => {
    if (window.confirm("Are you sure you want to reset all data?")) {
      setState({});
      localStorage.removeItem('mapig-audit-state');
    }
  };

  // Prevent hydration mismatch
  if (!isLoaded) return null;

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
