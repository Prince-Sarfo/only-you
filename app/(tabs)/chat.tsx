import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useAuth } from '@/context/auth';
import { makeRoomId } from '@/modules/chat/utils';
import { localChatService } from '@/modules/chat/localService';
import { useChatRoom, useSendMessage, useTyping } from '@/modules/chat/hooks';
import ChatHeader from '@/modules/chat/components/ChatHeader';
import MessageList from '@/modules/chat/components/MessageList';
import MessageInput from '@/modules/chat/components/MessageInput';

export default function ChatScreen() {
  const { user } = useAuth();
  const userId = user?.id ?? 'me';
  const peerId = user?.peerId ?? 'peer';
  const roomId = makeRoomId(userId, peerId);

  useEffect(() => {
    localChatService.init(userId);
  }, [userId]);

  const { messages, isTypingPeer } = useChatRoom(roomId);
  const { send } = useSendMessage(roomId, userId);
  const { setTyping } = useTyping(roomId, userId);

  return (
    <View className="flex-1 bg-white">
      <ChatHeader peerName={peerId} isTyping={isTypingPeer} />
      <MessageList userId={userId} messages={messages} />
      <MessageInput onSend={send} onTyping={(t) => setTyping(t)} />
    </View>
  );
}
