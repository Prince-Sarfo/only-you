import { useEffect, useMemo, useRef, useState } from 'react';
import { localChatService } from './localService';
import type { ChatMessage } from './types';

export function useChatRoom(roomId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTypingPeer, setIsTypingPeer] = useState(false);

  useEffect(() => {
    const offMessages = localChatService.onMessages(roomId, setMessages);
    const offTyping = localChatService.onTyping(roomId, (e) => {
      setIsTypingPeer(e.isTyping);
    });
    return () => { offMessages(); offTyping(); };
  }, [roomId]);

  return { messages, isTypingPeer };
}

export function useTyping(roomId: string, userId: string) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setTyping = (typing: boolean) => {
    localChatService.setTyping(roomId, userId, typing);
    if (typing) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        localChatService.setTyping(roomId, userId, false);
      }, 1500);
    }
  };

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  return { setTyping };
}

export function useSendMessage(roomId: string, senderId: string) {
  const send = async (text: string) => {
    if (!text.trim()) return;
    await localChatService.send({ roomId, senderId, text: text.trim() });
  };
  return useMemo(() => ({ send }), [roomId, senderId]);
}
