import { RoomId } from '@/modules/chat/types';
import { PairingState } from '@/modules/pairing/types';

export interface PairingService {
  createRoom(displayName: string): Promise<{ roomId: RoomId; code: string }>;
  joinRoom(code: string, displayName: string): Promise<{ roomId: RoomId }>;
  getCurrentRoom(): Promise<PairingState>;
  leaveRoom(): Promise<void>;
}
