import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useCalls } from '@/modules/calls/context';

export default function VoiceCallScreen() {
  const { startVoice, end } = useCalls();
  const [duration, setDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    startVoice();
    timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startVoice]);
  const mins = Math.floor(duration / 60).toString().padStart(2, '0');
  const secs = (duration % 60).toString().padStart(2, '0');
  return (
    <View className="flex-1 bg-black items-center justify-center">
      <Text className="text-white text-3xl mb-4">Voice Call</Text>
      <Text className="text-white text-xl mb-8">{mins}:{secs}</Text>
      <TouchableOpacity className="bg-red-600 px-6 py-3 rounded-full" onPress={end}>
        <Text className="text-white">End</Text>
      </TouchableOpacity>
    </View>
  );
}
