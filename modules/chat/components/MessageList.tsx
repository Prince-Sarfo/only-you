import React, { memo } from 'react';
import { FlatList, Text, View } from 'react-native';
import type { ChatMessage } from '../types';

interface Props {
  userId: string;
  messages: ChatMessage[];
}

function MessageBubble({ message, isOwn }: { message: ChatMessage; isOwn: boolean }) {
  return (
    <View>
      <View
        className={`pb-1 rounded-md max-w-[80%] ${
          isOwn ? 'self-end bg-green-500' : 'self-start bg-gray-800'
        }`}
      >
        <Text className={`px-4 py-2 ${isOwn ? 'text-white' : 'text-white'}`}>{message.text}</Text>
      </View>
      <Text className={`text-xs px-4 pb-1 ${isOwn ? 'text-gray-400 self-end' : 'text-gray-400'}`}>
        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
}

export const MessageList = memo(({ userId, messages }: Props) => {
  return (
    <FlatList
      data={messages}
      renderItem={({ item }) => (
        <MessageBubble message={item} isOwn={item.senderId === userId} />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
      inverted={false}
    />
  );
});

export default MessageList;
