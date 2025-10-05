import { ChatService, Unsubscribe } from '@/modules/chat/services/ChatService';
import { ChatMessage, RoomId, UserId } from '@/modules/chat/types';
import { storageGetObject, storageSetObject } from '@/modules/core/storage/asyncStorage';
import { generateId } from '@/modules/core/utils/ids';

const ROOM_KEY = (roomId: RoomId) => `chat:room:${roomId}`;

type Listener = (messages: ChatMessage[]) => void;

export class LocalChatService implements ChatService {
  private listeners: Map<RoomId, Set<Listener>> = new Map();

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
    const messages = await this.listMessages(roomId);
    this.listeners.get(roomId)?.forEach((fn) => fn(messages));
  }

  async sendMessage(roomId: RoomId, senderId: UserId, text: string): Promise<ChatMessage> {
    const newMessage: ChatMessage = {
      id: generateId('msg'),
      roomId,
      senderId,
      text,
      createdAt: Date.now(),
      status: 'sent',
    };
    const current = (await storageGetObject<ChatMessage[]>(ROOM_KEY(roomId))) ?? [];
    const next = [...current, newMessage];
    await storageSetObject(ROOM_KEY(roomId), next);
    await this.emit(roomId);
    return newMessage;
  }

  async markAsRead(roomId: RoomId, messageIds: string[]): Promise<void> {
    const current = (await storageGetObject<ChatMessage[]>(ROOM_KEY(roomId))) ?? [];
    const next = current.map((m) => (messageIds.includes(m.id) ? { ...m, status: 'read' as const } : m));
    await storageSetObject(ROOM_KEY(roomId), next);
    await this.emit(roomId);
  }

  async clearRoom(roomId: RoomId): Promise<void> {
    await storageSetObject(ROOM_KEY(roomId), []);
    await this.emit(roomId);
  }
}
