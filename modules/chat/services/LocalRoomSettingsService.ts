import { RoomId } from '@/modules/chat/types';
import { RoomSettings, RoomSettingsService } from '@/modules/chat/services/RoomSettingsService';
import { storageGetObject, storageSetObject } from '@/modules/core/storage/asyncStorage';

const KEY = (roomId: RoomId) => `roomsettings:${roomId}`;

const DEFAULT_SETTINGS: RoomSettings = {
  autoDeleteSeconds: null,
};

export class LocalRoomSettingsService implements RoomSettingsService {
  async get(roomId: RoomId): Promise<RoomSettings> {
    return (await storageGetObject<RoomSettings>(KEY(roomId))) ?? DEFAULT_SETTINGS;
  }
  async set(roomId: RoomId, settings: Partial<RoomSettings>): Promise<RoomSettings> {
    const current = await this.get(roomId);
    const next: RoomSettings = { ...current, ...settings };
    await storageSetObject(KEY(roomId), next);
    return next;
  }
}
