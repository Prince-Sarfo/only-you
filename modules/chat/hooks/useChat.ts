import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LocalChatService } from '@/modules/chat/services/LocalChatService';
import { ChatMessage, RoomId, UserId } from '@/modules/chat/types';

export function useChat(roomId: RoomId | null, userId: UserId | null) {
  const [service] = useState(() => new LocalChatService());
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const unsubRef = useRef<null | (() => void)>(null);

  useEffect(() => {
    if (!roomId) return;
    if (unsubRef.current) unsubRef.current();
    unsubRef.current = service.subscribeToMessages(roomId, setMessages);
    return () => {
      if (unsubRef.current) unsubRef.current();
    };
  }, [roomId, service]);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || !roomId || !userId) return;
    setIsSending(true);
    try {
      await service.sendMessage(roomId, userId, text.trim());
    } finally {
      setIsSending(false);
    }
  }, [service, roomId, userId]);

  const markRead = useCallback(async () => {
    if (!roomId) return;
    const ids = messages.map((m) => m.id);
    if (ids.length === 0) return;
    await service.markAsRead(roomId, ids);
  }, [service, roomId, messages]);

  return useMemo(() => ({ messages, isSending, send, markRead }), [messages, isSending, send, markRead]);
}
