import EventEmitter from 'eventemitter3';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatService } from './service';
import { ChatMessage, MessageQuery, SendMessageInput, TypingEvent } from './types';
import { generateMessageId } from './utils';

const STORAGE_PREFIX = 'chat:room:';
const TYPING_EVENT = 'typing';
const MESSAGE_EVENT = 'messages';

class LocalChatService implements ChatService {
  private emitter = new EventEmitter();
  private userId: string | null = null;

  async init(userId: string): Promise<void> {
    this.userId = userId;
  }

  private storageKey(roomId: string): string {
    return `${STORAGE_PREFIX}${roomId}`;
  }

  async listMessages(query: MessageQuery): Promise<ChatMessage[]> {
    const raw = await AsyncStorage.getItem(this.storageKey(query.roomId));
    const all: ChatMessage[] = raw ? JSON.parse(raw) : [];
    const sorted = all.sort((a, b) => a.createdAt - b.createdAt);
    if (!query.before && !query.limit) return sorted;
    const filtered = query.before ? sorted.filter(m => m.createdAt < query.before!) : sorted;
    const limited = query.limit ? filtered.slice(-query.limit) : filtered;
    return limited;
  }

  private async appendMessage(roomId: string, message: ChatMessage): Promise<void> {
    const raw = await AsyncStorage.getItem(this.storageKey(roomId));
    const list: ChatMessage[] = raw ? JSON.parse(raw) : [];
    const next = [...list, message];
    await AsyncStorage.setItem(this.storageKey(roomId), JSON.stringify(next));
    this.emitter.emit(`${MESSAGE_EVENT}:${roomId}`, next);
  }

  async send(input: SendMessageInput): Promise<ChatMessage> {
    const message: ChatMessage = {
      id: generateMessageId(),
      roomId: input.roomId,
      senderId: input.senderId,
      text: input.text,
      createdAt: Date.now(),
      status: 'sent'
    };
    await this.appendMessage(input.roomId, message);
    return message;
  }

  onMessages(roomId: string, handler: (messages: ChatMessage[]) => void) {
    const key = `${MESSAGE_EVENT}:${roomId}`;
    this.emitter.on(key, handler);
    // fire initial
    (async () => {
      const raw = await AsyncStorage.getItem(this.storageKey(roomId));
      const list: ChatMessage[] = raw ? JSON.parse(raw) : [];
      handler(list);
    })();
    return () => this.emitter.off(key, handler);
  }

  onTyping(roomId: string, handler: (event: TypingEvent) => void) {
    const key = `${TYPING_EVENT}:${roomId}`;
    this.emitter.on(key, handler);
    return () => this.emitter.off(key, handler);
  }

  setTyping(roomId: string, userId: string, isTyping: boolean) {
    const event: TypingEvent = { roomId, userId, isTyping };
    this.emitter.emit(`${TYPING_EVENT}:${roomId}`, event);
  }

  async clear(roomId: string): Promise<void> {
    await AsyncStorage.removeItem(this.storageKey(roomId));
    this.emitter.emit(`${MESSAGE_EVENT}:${roomId}`, []);
  }
}

export const localChatService = new LocalChatService();
export type { LocalChatService };
