import React from 'react';
import { View, Text } from 'react-native';

export function ChatHeader({ title }: { title: string }) {
  return (
    <View className="flex-row items-center p-4 border-b border-gray-200 bg-white">
      <Text className="flex-1 text-center text-lg font-semibold">{title}</Text>
    </View>
  );
}
