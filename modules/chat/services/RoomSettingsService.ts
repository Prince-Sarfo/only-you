import { RoomId } from '@/modules/chat/types';

export interface RoomSettings {
  autoDeleteSeconds: number | null; // null disables
}

export interface RoomSettingsService {
  get(roomId: RoomId): Promise<RoomSettings>;
  set(roomId: RoomId, settings: Partial<RoomSettings>): Promise<RoomSettings>;
}
