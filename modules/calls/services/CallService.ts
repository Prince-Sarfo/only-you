import { CallSession, CallType } from '@/modules/calls/types';

export type Unsubscribe = () => void;

export interface CallService {
  getCurrent(): Promise<CallSession | null>;
  start(type: CallType, channelId: string): Promise<CallSession>;
  end(): Promise<void>;
  subscribe(cb: (session: CallSession | null) => void): Unsubscribe;
  // Controls
  muteLocalAudio(mute: boolean): void;
  enableLocalVideo(enabled: boolean): void;
  switchCamera(): void;
  muteRemote(uid: number, mute: boolean): void;
}
