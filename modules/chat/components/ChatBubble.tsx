import React from 'react';
import { View, Text } from 'react-native';

export function ChatBubble({ text, isMine, time }: { text: string; isMine: boolean; time?: string }) {
  return (
    <View>
      <View
        className={`pb-1 rounded-md max-w-[80%] ${
          isMine ? 'self-end bg-green-500' : 'self-start bg-gray-800'
        }`}
      >
        <Text className={`px-4 py-2 ${isMine ? 'text-white' : 'text-white'}`}>{text}</Text>
      </View>
      {time ? (
        <Text className={`text-xs px-4 pb-1 ${isMine ? 'text-gray-400 self-end' : 'text-gray-400'}`}>{time}</Text>
      ) : null}
    </View>
  );
}
