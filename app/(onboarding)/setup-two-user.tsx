import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/auth';

export default function SetupTwoUser() {
  const { login, updateUser, user } = useAuth();
  const [myId, setMyId] = useState(user?.id ?? 'me');
  const [peerId, setPeerId] = useState(user?.peerId ?? 'peer');
  const [displayName, setDisplayName] = useState(user?.displayName ?? 'Me');
  const router = useRouter();

  const handleContinue = async () => {
    if (!user) {
      await login({ id: myId, displayName, peerId });
    } else {
      await updateUser({ id: myId, displayName, peerId });
    }
    router.replace('/(tabs)/chat');
  };

  return (
    <SafeAreaView className="flex-1 items-center p-6">
      <Text className="text-2xl font-bold mb-6">Setup Two-User Chat</Text>
      <View className="w-full">
        <Text className="mb-1">Your ID</Text>
        <TextInput
          className="border rounded p-3 mb-4"
          placeholder="e.g. alice"
          value={myId}
          onChangeText={setMyId}
          autoCapitalize="none"
        />
        <Text className="mb-1">Display Name</Text>
        <TextInput
          className="border rounded p-3 mb-4"
          placeholder="e.g. Alice"
          value={displayName}
          onChangeText={setDisplayName}
        />
        <Text className="mb-1">Peer ID</Text>
        <TextInput
          className="border rounded p-3 mb-4"
          placeholder="e.g. bob"
          value={peerId}
          onChangeText={setPeerId}
          autoCapitalize="none"
        />
        <TouchableOpacity className="bg-green-500 rounded p-4" onPress={handleContinue}>
          <Text className="text-white text-center font-semibold">Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
