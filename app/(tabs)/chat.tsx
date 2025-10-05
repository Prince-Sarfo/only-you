import React, { useMemo, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { ChatHeader } from '@/modules/chat/components/ChatHeader';
import { ChatBubble } from '@/modules/chat/components/ChatBubble';
import { ChatComposer } from '@/modules/chat/components/ChatComposer';
import { useChat } from '@/modules/chat/hooks/useChat';
import { usePairingContext } from '@/modules/pairing/context';
import { useAuth } from '@/context/auth';

export default function ChatScreen() {
  const { roomId, isPaired } = usePairingContext();
  const { user } = useAuth();
  const userId = useMemo(() => user?.id || user?.phoneNumber || user?.displayName || 'me', [user]);
  const { messages, isSending, send } = useChat(roomId, userId);
  const [text, setText] = useState('');

  if (!isPaired || !roomId) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-lg text-center">
          Pair first to start chatting.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ChatHeader title="OnlyYou" />

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatBubble
            text={item.text}
            isMine={item.senderId === userId}
            time={new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          />
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
      />

      <ChatComposer
        value={text}
        onChange={setText}
        onSubmit={() => {
          const t = text.trim();
          if (!t || isSending) return;
          send(t);
          setText('');
        }}
      />
    </View>
  );
}
