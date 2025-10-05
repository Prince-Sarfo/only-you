import { CallSession, CallType } from '@/modules/calls/types';

export type Unsubscribe = () => void;

export interface CallService {
  getCurrent(): Promise<CallSession | null>;
  start(type: CallType, channelId: string): Promise<CallSession>;
  end(): Promise<void>;
  subscribe(cb: (session: CallSession | null) => void): Unsubscribe;
}
