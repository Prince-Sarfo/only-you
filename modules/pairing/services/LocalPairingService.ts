import { PairingService } from '@/modules/pairing/services/PairingService';
import { RoomId } from '@/modules/chat/types';
import { PairingState } from '@/modules/pairing/types';
import { storageGetObject, storageRemove, storageSetObject } from '@/modules/core/storage/asyncStorage';
import { generateId, generateRoomCode } from '@/modules/core/utils/ids';

const PAIRING_KEY = 'pairing:state';

type Persisted = { roomId: RoomId; code: string };

export class LocalPairingService implements PairingService {
  async createRoom(displayName: string): Promise<{ roomId: RoomId; code: string }> {
    const roomId = generateId('room');
    const code = generateRoomCode();
    const state: Persisted = { roomId, code };
    await storageSetObject(PAIRING_KEY, state);
    return { roomId, code };
  }

  async joinRoom(code: string, _displayName: string): Promise<{ roomId: RoomId }> {
    // In local mode, treat the code as the roomId for simplicity
    const roomId = code.trim();
    const state: Persisted = { roomId, code: roomId };
    await storageSetObject(PAIRING_KEY, state);
    return { roomId };
  }

  async getCurrentRoom(): Promise<PairingState> {
    const persisted = await storageGetObject<Persisted>(PAIRING_KEY);
    if (!persisted) return { roomId: null, code: null, isPaired: false };
    return { roomId: persisted.roomId, code: persisted.code, isPaired: true };
  }

  async leaveRoom(): Promise<void> {
    await storageRemove(PAIRING_KEY);
  }
}
