export type UserId = string;
export type RoomId = string;

export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface ChatMessage {
  id: string;
  roomId: RoomId;
  senderId: UserId;
  text: string;
  createdAt: number; // epoch ms
  status: MessageStatus;
  attachmentUrl?: string;
  viewOnce?: boolean; // if true, delete after first view
}
