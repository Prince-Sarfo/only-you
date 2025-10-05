import React, { useMemo, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { ChatHeader } from '@/modules/chat/components/ChatHeader';
import { ChatBubble } from '@/modules/chat/components/ChatBubble';
import { ChatComposer } from '@/modules/chat/components/ChatComposer';
import { useChat } from '@/modules/chat/hooks/useChat';
import { usePairingContext } from '@/modules/pairing/context';
import { useAuth } from '@/context/auth';
import { RoomSettingsSheet } from '@/modules/chat/components/RoomSettingsSheet';
import { TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ViewOnceViewer } from '@/modules/chat/components/ViewOnceViewer';
import { useRouter } from 'expo-router';

export default function ChatScreen() {
  const router = useRouter();
  const { roomId, isPaired } = usePairingContext();
  const { user } = useAuth();
  const userId = useMemo(() => user?.id || user?.phoneNumber || user?.displayName || 'me', [user]);
  const { messages, isSending, send, markRead } = useChat(roomId, userId);
  const [text, setText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [viewOnceMessageId, setViewOnceMessageId] = useState<string | null>(null);

  if (!isPaired || !roomId) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-lg text-center">
          Pair first to start chatting.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View>
        <ChatHeader title="OnlyYou" />
        <View className="px-4 py-2 border-b border-gray-100 flex-row justify-end space-x-2">
          <TouchableOpacity className="px-3 py-1 bg-gray-100 rounded" onPress={() => router.push('/(call)/voice')}>
            <Text>Voice</Text>
          </TouchableOpacity>
          <TouchableOpacity className="px-3 py-1 bg-gray-100 rounded" onPress={() => router.push('/(call)/video')}>
            <Text>Video</Text>
          </TouchableOpacity>
          <TouchableOpacity className="px-3 py-1 bg-gray-100 rounded" onPress={() => setShowSettings(true)}>
            <Text>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (item.viewOnce) setViewOnceMessageId(item.id);
            }}
          >
            <ChatBubble
              text={item.viewOnce ? 'Photo' : item.text}
              isMine={item.senderId === userId}
              time={new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              viewOnce={!!item.viewOnce}
            />
          </TouchableOpacity>
        )}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
      />
      {viewOnceMessageId ? (
        <ViewOnceViewer
          message={messages.find((m) => m.id === viewOnceMessageId)!}
          onClose={() => {
            // Burn on read
            markRead();
            setViewOnceMessageId(null);
          }}
        />
      ) : null}

      <ChatComposer
        value={text}
        onChange={setText}
        onSubmit={() => {
          const t = text.trim();
          if (!t || isSending) return;
          send(t);
          setText('');
        }}
      />
      <View className="absolute bottom-20 right-4">
        <TouchableOpacity
          className="bg-green-500 rounded-full px-4 py-3"
          onPress={async () => {
            const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
            if (res.canceled || res.assets.length === 0) return;
            const uri = res.assets[0].uri;
            await send('', { attachmentUrl: uri, viewOnce: true });
          }}
        >
          <Text className="text-white">View-once</Text>
        </TouchableOpacity>
      </View>
      {showSettings ? (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <RoomSettingsSheet />
          <TouchableOpacity className="p-3" onPress={() => setShowSettings(false)}>
            <Text className="text-center text-gray-700">Close</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}
