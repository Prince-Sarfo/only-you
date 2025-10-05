import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useCalls } from '@/modules/calls/context';
import { RtcSurfaceView, VideoCanvas } from 'react-native-agora';
import { RenderModeType } from 'react-native-agora';
import { usePairingContext } from '@/modules/pairing/context';

export default function VideoCallScreen() {
  const { startVideo, end } = useCalls();
  React.useEffect(() => { startVideo(); }, [startVideo]);
  return (
    <View className="flex-1 bg-black items-center justify-center">
      <Text className="text-white text-3xl mb-4">Video Call</Text>
      {/* Local preview */}
      <View className="w-64 h-40 rounded mb-4 overflow-hidden">
        <RtcSurfaceView canvas={{ uid: 0, renderMode: RenderModeType.RenderModeFit } as VideoCanvas} />
      </View>
      {/* Remote placeholder; in a real app, map remote UIDs from session */}
      <View className="w-64 h-40 rounded mb-4 overflow-hidden">
        <RtcSurfaceView canvas={{ uid: 1, renderMode: RenderModeType.RenderModeFit } as VideoCanvas} />
      </View>
      <TouchableOpacity className="bg-red-600 px-6 py-3 rounded-full" onPress={end}>
        <Text className="text-white">End</Text>
      </TouchableOpacity>
    </View>
  );
}
