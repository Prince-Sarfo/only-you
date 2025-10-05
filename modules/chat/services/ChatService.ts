import { ChatMessage, RoomId, UserId } from '@/modules/chat/types';

export type Unsubscribe = () => void;

export interface ChatService {
  listMessages(roomId: RoomId, limit?: number): Promise<ChatMessage[]>;
  subscribeToMessages(
    roomId: RoomId,
    onChange: (messages: ChatMessage[]) => void
  ): Unsubscribe;
  sendMessage(
    roomId: RoomId,
    senderId: UserId,
    text: string,
    options?: { attachmentUrl?: string; viewOnce?: boolean }
  ): Promise<ChatMessage>;
  markAsRead(roomId: RoomId, messageIds: string[]): Promise<void>;
  clearRoom(roomId: RoomId): Promise<void>;
}
