import { RoomId } from '@/modules/chat/types';

export interface PairingState {
  roomId: RoomId | null;
  code: string | null;
  isPaired: boolean;
}
