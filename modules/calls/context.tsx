import React, { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { LocalCallService } from '@/modules/calls/services/LocalCallService';
import { AgoraCallService } from '@/modules/calls/services/AgoraCallService';
import { CallSession, CallType } from '@/modules/calls/types';
import type { CallService } from '@/modules/calls/services/CallService';
import { usePairingContext } from '@/modules/pairing/context';
import { checkAndRequestPermissions } from '@/setup';

interface CallsContextValue {
  session: CallSession | null;
  startVoice: () => Promise<void>;
  startVideo: () => Promise<void>;
  end: () => Promise<void>;
  muteLocalAudio: (mute: boolean) => void;
  enableLocalVideo: (enabled: boolean) => void;
  switchCamera: () => void;
  muteRemote: (uid: number, mute: boolean) => void;
}

const CallsContext = createContext<CallsContextValue | undefined>(undefined);

export function CallsProvider({ children }: { children: React.ReactNode }) {
  const [service] = useState<CallService>(() => {
    const hasAppId = !!(process.env.EXPO_PUBLIC_AGORA_APP_ID);
    return hasAppId ? new AgoraCallService() : new LocalCallService();
  });
  const [session, setSession] = useState<CallSession | null>(null);
  const unsubRef = useRef<null | (() => void)>(null);
  const { roomId, code } = usePairingContext();

  useEffect(() => {
    unsubRef.current = service.subscribe(setSession);
    return () => { if (unsubRef.current) unsubRef.current(); };
  }, [service]);

  const start = useCallback(async (type: CallType) => {
    const channelId = code || roomId || 'onlyyou';
    if (type === 'video') {
      await checkAndRequestPermissions({ camera: true, microphone: true });
    } else {
      await checkAndRequestPermissions({ microphone: true });
    }
    await service.start(type, channelId);
  }, [service, roomId, code]);

  const startVoice = useCallback(async () => start('voice'), [start]);
  const startVideo = useCallback(async () => start('video'), [start]);
  const end = useCallback(async () => { await service.end(); }, [service]);

  const value = useMemo(() => ({
    session,
    startVoice,
    startVideo,
    end,
    muteLocalAudio: (m: boolean) => service.muteLocalAudio(m),
    enableLocalVideo: (e: boolean) => service.enableLocalVideo(e),
    switchCamera: () => service.switchCamera(),
    muteRemote: (uid: number, mute: boolean) => service.muteRemote(uid, mute),
  }), [session, startVoice, startVideo, end, service]);

  return <CallsContext.Provider value={value}>{children}</CallsContext.Provider>;
}

export function useCalls() {
  const ctx = useContext(CallsContext);
  if (!ctx) throw new Error('useCalls must be used within CallsProvider');
  return ctx;
}
