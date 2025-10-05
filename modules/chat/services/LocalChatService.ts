import { ChatService, Unsubscribe } from '@/modules/chat/services/ChatService';
import { ChatMessage, RoomId, UserId } from '@/modules/chat/types';
import { storageGetObject, storageSetObject } from '@/modules/core/storage/asyncStorage';
import { LocalRoomSettingsService } from '@/modules/chat/services/LocalRoomSettingsService';
import { generateId } from '@/modules/core/utils/ids';

const ROOM_KEY = (roomId: RoomId) => `chat:room:${roomId}`;

type Listener = (messages: ChatMessage[]) => void;

export class LocalChatService implements ChatService {
  private listeners: Map<RoomId, Set<Listener>> = new Map();
  private roomSettings = new LocalRoomSettingsService();

  async listMessages(roomId: RoomId, limit?: number): Promise<ChatMessage[]> {
    const list = (await storageGetObject<ChatMessage[]>(ROOM_KEY(roomId))) ?? [];
    const sorted = list.sort((a, b) => a.createdAt - b.createdAt);
    if (typeof limit === 'number') {
      return sorted.slice(Math.max(0, sorted.length - limit));
    }
    return sorted;
  }

  subscribeToMessages(roomId: RoomId, onChange: Listener): Unsubscribe {
    if (!this.listeners.has(roomId)) this.listeners.set(roomId, new Set());
    this.listeners.get(roomId)!.add(onChange);

    // emit initial
    this.listMessages(roomId).then(onChange);

    return () => {
      this.listeners.get(roomId)?.delete(onChange);
    };
  }

  private async emit(roomId: RoomId) {
    let messages = await this.listMessages(roomId);
    const settings = await this.roomSettings.get(roomId);
    if (settings.autoDeleteSeconds && settings.autoDeleteSeconds > 0) {
      const cutoff = Date.now() - settings.autoDeleteSeconds * 1000;
      const filtered = messages.filter((m) => m.createdAt >= cutoff);
      if (filtered.length !== messages.length) {
        await storageSetObject(ROOM_KEY(roomId), filtered);
        messages = filtered;
      }
    }
    this.listeners.get(roomId)?.forEach((fn) => fn(messages));
  }

  async sendMessage(
    roomId: RoomId,
    senderId: UserId,
    text: string,
    options?: { attachmentUrl?: string; viewOnce?: boolean }
  ): Promise<ChatMessage> {
    const newMessage: ChatMessage = {
      id: generateId('msg'),
      roomId,
      senderId,
      text,
      createdAt: Date.now(),
      status: 'sent',
      attachmentUrl: options?.attachmentUrl,
      viewOnce: options?.viewOnce,
    };
    const current = (await storageGetObject<ChatMessage[]>(ROOM_KEY(roomId))) ?? [];
    const next = [...current, newMessage];
    await storageSetObject(ROOM_KEY(roomId), next);
    await this.emit(roomId);
    return newMessage;
  }

  async markAsRead(roomId: RoomId, messageIds: string[]): Promise<void> {
    const current = (await storageGetObject<ChatMessage[]>(ROOM_KEY(roomId))) ?? [];
    let modified = false;
    const next = current.filter((m) => {
      if (!messageIds.includes(m.id)) return true;
      if (m.viewOnce) {
        modified = true;
        return false; // burn after read
      }
      if (m.status !== 'read') modified = true;
      return true;
    }).map((m) => (messageIds.includes(m.id) ? { ...m, status: 'read' as const } : m));
    if (modified) {
      await storageSetObject(ROOM_KEY(roomId), next);
      await this.emit(roomId);
    } else {
      // still emit to notify UI
      await this.emit(roomId);
    }
  }

  async clearRoom(roomId: RoomId): Promise<void> {
    await storageSetObject(ROOM_KEY(roomId), []);
    await this.emit(roomId);
  }
}
