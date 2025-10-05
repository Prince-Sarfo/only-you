import React from 'react';
import { View, TextInput, TouchableOpacity, Image } from 'react-native';

export function ChatComposer({ value, onChange, onSubmit }: { value: string; onChange: (t: string) => void; onSubmit: () => void }) {
  return (
    <View className="flex-row items-center bg-gray-200 mx-4 rounded-full p-2 mb-4">
      <TextInput
        className="flex-1 rounded-full px-4 py-2"
        placeholder="Message"
        value={value}
        onChangeText={onChange}
        onSubmitEditing={onSubmit}
        returnKeyType="send"
      />
      <TouchableOpacity className="ml-2">
        <Image source={require('@/assets/images/Paperclip.png')} />
      </TouchableOpacity>
      <TouchableOpacity className="ml-2" onPress={onSubmit}>
        <Image source={require('@/assets/images/Microphone.png')} />
      </TouchableOpacity>
    </View>
  );
}
