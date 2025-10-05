import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { usePairingContext } from '@/modules/pairing/context';
import { useAuth } from '@/context/auth';

export default function PairingScreen() {
  const { createRoom, joinRoom, code, isPaired } = usePairingContext();
  const { user } = useAuth();
  const [joinCode, setJoinCode] = useState('');
  const displayName = user?.displayName || 'You';

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-semibold mb-2">Pair your chat</Text>
      <Text className="text-gray-600 mb-6">Only two people can share a room.</Text>

      <TouchableOpacity
        className="bg-green-500 rounded-lg p-4 mb-4"
        onPress={async () => {
          const res = await createRoom(displayName);
          alert(`Room created. Share this code: ${res.code}`);
        }}
      >
        <Text className="text-white text-center font-medium">Create room</Text>
      </TouchableOpacity>

      <View className="border border-gray-200 rounded-lg p-4 mb-4">
        <Text className="text-gray-800 mb-2">Join with code</Text>
        <TextInput
          value={joinCode}
          onChangeText={setJoinCode}
          placeholder="Enter 6-char code"
          autoCapitalize="characters"
          className="border border-gray-300 rounded px-3 py-2 mb-3"
        />
        <TouchableOpacity
          className="bg-gray-900 rounded p-3"
          onPress={async () => {
            const code = joinCode.trim().toUpperCase();
            if (!code) return;
            await joinRoom(code, displayName);
            setJoinCode('');
          }}
        >
          <Text className="text-white text-center">Join</Text>
        </TouchableOpacity>
      </View>

      {isPaired ? (
        <View className="p-3 bg-gray-50 rounded">
          <Text className="text-gray-700">Paired. Current code: {code}</Text>
        </View>
      ) : null}
    </View>
  );
}
