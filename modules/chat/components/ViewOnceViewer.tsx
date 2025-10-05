import React, { useEffect } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { ChatMessage } from '@/modules/chat/types';

export function ViewOnceViewer({ message, onClose }: { message: ChatMessage; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000); // auto-close after 5s
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <View className="absolute inset-0 bg-black/90 items-center justify-center">
      {message.attachmentUrl ? (
        <Image source={{ uri: message.attachmentUrl }} className="w-80 h-80" resizeMode="contain" />
      ) : null}
      <TouchableOpacity className="mt-4 px-4 py-2 bg-white/10 rounded" onPress={onClose}>
        <Text className="text-white">Close</Text>
      </TouchableOpacity>
    </View>
  );
}
