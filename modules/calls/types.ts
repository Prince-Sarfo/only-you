export type CallType = 'voice' | 'video';

export interface CallSession {
  id: string;
  type: CallType;
  startedAt: number;
  isOngoing: boolean;
}
