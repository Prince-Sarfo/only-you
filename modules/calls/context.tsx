import React, { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { LocalCallService } from '@/modules/calls/services/LocalCallService';
import { CallSession, CallType } from '@/modules/calls/types';
import type { CallService } from '@/modules/calls/services/CallService';

interface CallsContextValue {
  session: CallSession | null;
  startVoice: () => Promise<void>;
  startVideo: () => Promise<void>;
  end: () => Promise<void>;
}

const CallsContext = createContext<CallsContextValue | undefined>(undefined);

export function CallsProvider({ children }: { children: React.ReactNode }) {
  const [service] = useState<CallService>(() => new LocalCallService());
  const [session, setSession] = useState<CallSession | null>(null);
  const unsubRef = useRef<null | (() => void)>(null);

  useEffect(() => {
    unsubRef.current = service.subscribe(setSession);
    return () => { if (unsubRef.current) unsubRef.current(); };
  }, [service]);

  const start = useCallback(async (type: CallType) => {
    await service.start(type);
  }, [service]);

  const startVoice = useCallback(async () => start('voice'), [start]);
  const startVideo = useCallback(async () => start('video'), [start]);
  const end = useCallback(async () => { await service.end(); }, [service]);

  const value = useMemo(() => ({ session, startVoice, startVideo, end }), [session, startVoice, startVideo, end]);

  return <CallsContext.Provider value={value}>{children}</CallsContext.Provider>;
}

export function useCalls() {
  const ctx = useContext(CallsContext);
  if (!ctx) throw new Error('useCalls must be used within CallsProvider');
  return ctx;
}
