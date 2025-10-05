import React from 'react';
import { Text, View } from 'react-native';

interface Props {
  peerName?: string;
  isTyping: boolean;
}

export default function ChatHeader({ peerName = 'Peer', isTyping }: Props) {
  return (
    <View className="flex-row items-center p-4 border-b border-gray-200">
      <Text className="flex-1 text-center text-lg font-semibold">{peerName}</Text>
      {isTyping ? <Text className="text-xs text-gray-500">typing...</Text> : null}
    </View>
  );
}
