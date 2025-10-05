import React, { useState } from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
  onSend: (text: string) => Promise<void> | void;
  onTyping: (isTyping: boolean) => void;
}

export default function MessageInput({ onSend, onTyping }: Props) {
  const [text, setText] = useState('');

  const handleSubmit = async () => {
    const current = text;
    setText('');
    await onSend(current);
  };

  return (
    <View className="flex-row items-center bg-gray-200 mx-4 rounded-full p-2 mb-4">
      <TextInput
        className="flex-1  rounded-full px-4 py-2 active:border-none"
        placeholder="Message"
        value={text}
        onChangeText={(t) => {
          setText(t);
          onTyping(true);
        }}
        onSubmitEditing={handleSubmit}
      />
      <TouchableOpacity className="ml-2">
        <Image source={require('@/assets/images/Paperclip.png')} />
      </TouchableOpacity>
      <TouchableOpacity className="ml-2">
        <Image source={require('@/assets/images/Microphone.png')} />
      </TouchableOpacity>
    </View>
  );
}
