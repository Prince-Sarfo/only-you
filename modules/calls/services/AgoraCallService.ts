// Optional Agora service scaffold. Replace logic and add SDK init as needed.
// Requires env:
// - EXPO_PUBLIC_AGORA_APP_ID
// - EXPO_PUBLIC_AGORA_TOKEN_ENDPOINT (if using token server)

import { CallService, Unsubscribe } from '@/modules/calls/services/CallService';
import { CallSession, CallType } from '@/modules/calls/types';
import { generateId } from '@/modules/core/utils/ids';

export class AgoraCallService implements CallService {
  private session: CallSession | null = null;
  private listeners = new Set<(s: CallSession | null) => void>();

  async getCurrent(): Promise<CallSession | null> {
    return this.session;
  }

  async start(type: CallType): Promise<CallSession> {
    // TODO: init Agora client, join channel, set up tracks
    this.session = { id: generateId('call'), type, startedAt: Date.now(), isOngoing: true };
    this.emit();
    return this.session;
  }

  async end(): Promise<void> {
    // TODO: leave channel, cleanup tracks
    if (this.session) this.session = { ...this.session, isOngoing: false };
    this.emit();
    this.session = null;
  }

  subscribe(cb: (session: CallSession | null) => void): Unsubscribe {
    this.listeners.add(cb);
    cb(this.session);
    return () => this.listeners.delete(cb);
  }

  private emit() {
    this.listeners.forEach((l) => l(this.session));
  }
}
