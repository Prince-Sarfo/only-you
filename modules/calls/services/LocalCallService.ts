import { CallService, Unsubscribe } from '@/modules/calls/services/CallService';
import { CallSession, CallType } from '@/modules/calls/types';
import { generateId } from '@/modules/core/utils/ids';

export class LocalCallService implements CallService {
  private session: CallSession | null = null;
  private listeners = new Set<(s: CallSession | null) => void>();

  async getCurrent(): Promise<CallSession | null> {
    return this.session;
  }

  async start(type: CallType, channelId: string): Promise<CallSession> {
    this.session = {
      id: generateId('call'),
      type,
      channelId,
      startedAt: Date.now(),
      isOngoing: true,
      remoteUids: [],
    };
    this.emit();
    return this.session;
  }

  async end(): Promise<void> {
    if (this.session) {
      this.session = { ...this.session, isOngoing: false };
    }
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
