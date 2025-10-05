import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function VideoCallScreen() {
  return (
    <View className="flex-1 bg-black items-center justify-center">
      <Text className="text-white text-3xl mb-4">Video Call</Text>
      <View className="w-64 h-40 bg-gray-700 rounded mb-4" />
      <TouchableOpacity className="bg-red-600 px-6 py-3 rounded-full">
        <Text className="text-white">End</Text>
      </TouchableOpacity>
    </View>
  );
}
