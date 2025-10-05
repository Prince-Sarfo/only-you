import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PairingState } from '@/modules/pairing/types';
import { PairingService } from '@/modules/pairing/services/PairingService';
import { LocalPairingService } from '@/modules/pairing/services/LocalPairingService';

interface PairingContextValue extends PairingState {
  createRoom: (displayName: string) => Promise<{ roomId: string; code: string }>;
  joinRoom: (code: string, displayName: string) => Promise<{ roomId: string }>;
  leaveRoom: () => Promise<void>;
  refresh: () => Promise<void>;
}

const PairingContext = createContext<PairingContextValue | undefined>(undefined);

export function PairingProvider({ children }: { children: React.ReactNode }) {
  const [service] = useState<PairingService>(() => new LocalPairingService());
  const [state, setState] = useState<PairingState>({ roomId: null, code: null, isPaired: false });

  const refresh = useCallback(async () => {
    const s = await service.getCurrentRoom();
    setState(s);
  }, [service]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createRoom = useCallback(async (displayName: string) => {
    const res = await service.createRoom(displayName);
    await refresh();
    return res;
  }, [service, refresh]);

  const joinRoomFn = useCallback(async (code: string, displayName: string) => {
    const res = await service.joinRoom(code, displayName);
    await refresh();
    return res;
  }, [service, refresh]);

  const leaveRoomFn = useCallback(async () => {
    await service.leaveRoom();
    await refresh();
  }, [service, refresh]);

  const value = useMemo<PairingContextValue>(() => ({
    ...state,
    createRoom,
    joinRoom: joinRoomFn,
    leaveRoom: leaveRoomFn,
    refresh,
  }), [state, createRoom, joinRoomFn, leaveRoomFn, refresh]);

  return (
    <PairingContext.Provider value={value}>
      {children}
    </PairingContext.Provider>
  );
}

export function usePairingContext(): PairingContextValue {
  const ctx = useContext(PairingContext);
  if (!ctx) throw new Error('usePairingContext must be used within PairingProvider');
  return ctx;
}
