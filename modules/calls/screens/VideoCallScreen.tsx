import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useCalls } from '@/modules/calls/context';
import { RtcSurfaceView, VideoCanvas } from 'react-native-agora';
import { RenderModeType } from 'react-native-agora';
import { usePairingContext } from '@/modules/pairing/context';

export default function VideoCallScreen() {
  const { startVideo, end, switchCamera, enableLocalVideo, muteLocalAudio, session } = useCalls();
  const [muted, setMuted] = React.useState(false);
  const [videoOn, setVideoOn] = React.useState(true);
  React.useEffect(() => { startVideo(); }, [startVideo]);
  const remoteUids = session?.remoteUids ?? [];
  return (
    <View className="flex-1 bg-black">
      <View className="flex-1 items-center justify-center">
        <Text className="text-white text-2xl mb-3">Video Call</Text>
        <View className="w-64 h-40 rounded mb-4 overflow-hidden">
          <RtcSurfaceView canvas={{ uid: 0, renderMode: RenderModeType.RenderModeFit } as VideoCanvas} />
        </View>
        <View className="flex-row flex-wrap justify-center">
          {remoteUids.length === 0 ? (
            <View className="w-64 h-40 rounded mb-4 overflow-hidden bg-gray-700 items-center justify-center">
              <Text className="text-white/60">Waiting for remote</Text>
            </View>
          ) : (
            remoteUids.map((uid) => (
              <View key={uid} className="w-64 h-40 rounded mb-4 overflow-hidden">
                <RtcSurfaceView canvas={{ uid, renderMode: RenderModeType.RenderModeFit } as VideoCanvas} />
              </View>
            ))
          )}
        </View>
      </View>
      <View className="flex-row justify-center items-center space-x-4 p-4">
        <TouchableOpacity
          className="px-4 py-2 bg-white/10 rounded"
          onPress={() => { const next = !muted; setMuted(next); muteLocalAudio(next); }}
        >
          <Text className="text-white">{muted ? 'Unmute' : 'Mute'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="px-4 py-2 bg-white/10 rounded"
          onPress={() => { const next = !videoOn; setVideoOn(next); enableLocalVideo(next); }}
        >
          <Text className="text-white">{videoOn ? 'Video Off' : 'Video On'}</Text>
        </TouchableOpacity>
        <TouchableOpacity className="px-4 py-2 bg-white/10 rounded" onPress={switchCamera}>
          <Text className="text-white">Switch</Text>
        </TouchableOpacity>
        <TouchableOpacity className="px-4 py-2 bg-red-600 rounded" onPress={end}>
          <Text className="text-white">End</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
