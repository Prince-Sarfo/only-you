export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  text: string;
  createdAt: number; // epoch millis
  status?: MessageStatus;
}

export interface SendMessageInput {
  roomId: string;
  senderId: string;
  text: string;
}

export interface MessageQuery {
  roomId: string;
  limit?: number;
  before?: number; // timestamp to paginate backward
}

export interface TypingEvent {
  roomId: string;
  userId: string;
  isTyping: boolean;
}

export interface ConversationSummary {
  roomId: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
}

export type Unsubscribe = () => void;
