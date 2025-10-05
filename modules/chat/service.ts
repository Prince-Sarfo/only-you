import { ChatMessage, MessageQuery, SendMessageInput, TypingEvent, Unsubscribe } from './types';

export interface ChatService {
  init?: (userId: string) => Promise<void>;
  listMessages: (query: MessageQuery) => Promise<ChatMessage[]>;
  send: (input: SendMessageInput) => Promise<ChatMessage>;
  onMessages: (roomId: string, handler: (messages: ChatMessage[]) => void) => Unsubscribe;
  onTyping: (roomId: string, handler: (event: TypingEvent) => void) => Unsubscribe;
  setTyping: (roomId: string, userId: string, isTyping: boolean) => void;
  clear: (roomId: string) => Promise<void>;
}

export type { ChatMessage, MessageQuery, SendMessageInput, TypingEvent, Unsubscribe };
