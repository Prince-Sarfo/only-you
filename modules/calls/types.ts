export type CallType = 'voice' | 'video';

export interface CallSession {
  id: string;
  type: CallType;
  channelId: string;
  startedAt: number;
  isOngoing: boolean;
  localUid?: number;
  remoteUids: number[];
}
