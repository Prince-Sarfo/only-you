import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { usePairingContext } from '@/modules/pairing/context';
import { useRoomSettings } from '@/modules/chat/hooks/useRoomSettings';

const OPTIONS = [
  { label: 'Off', value: null },
  { label: '30s', value: 30 },
  { label: '1m', value: 60 },
  { label: '5m', value: 5 * 60 },
  { label: '1h', value: 60 * 60 },
  { label: '24h', value: 24 * 60 * 60 },
];

export function RoomSettingsSheet() {
  const { roomId } = usePairingContext();
  const { settings, setAutoDelete } = useRoomSettings(roomId);
  const currentLabel = useMemo(() => {
    const match = OPTIONS.find((o) => o.value === settings.autoDeleteSeconds);
    return match ? match.label : 'Off';
  }, [settings.autoDeleteSeconds]);

  return (
    <View className="p-4">
      <Text className="text-lg font-semibold mb-2">Auto-delete messages</Text>
      <Text className="text-gray-600 mb-4">Current: {currentLabel}</Text>
      <View className="flex-row flex-wrap">
        {OPTIONS.map((opt) => (
          <TouchableOpacity
            key={String(opt.value)}
            className="px-3 py-2 bg-gray-100 rounded mr-2 mb-2"
            onPress={() => setAutoDelete(opt.value as any)}
          >
            <Text>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
