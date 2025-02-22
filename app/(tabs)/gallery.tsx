
import React from 'react';
import { View, Image, FlatList, TouchableOpacity } from 'react-native';

const media = [
  { id: '1', type: 'image', uri: 'https://example.com/image1.jpg' },
  { id: '2', type: 'video', uri: 'https://example.com/video1.mp4' },
  { id: '3', type: 'image', uri: 'https://example.com/image2.jpg' },
  { id: '4', type: 'video', uri: 'https://example.com/video2.mp4' },
  // Add more media items as needed
];

const GalleryScreen = () => {
  const renderMedia = ({ item }) => (
    <TouchableOpacity className="p-1 w-1/3" onPress={() => {/* Handle media click */}}>
      <View className="aspect-square">
        {item.type === 'image' ? (
          <Image source={{ uri: item.uri }} className="w-full h-full rounded-lg" resizeMode="cover" />
        ) : (
          // Add a video thumbnail or icon here
          <View className="bg-gray-300 w-full h-full rounded-lg flex items-center justify-center">
            <Image source={{ uri: 'https://example.com/video-icon.png' }} className="w-12 h-12" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={media}
        renderItem={renderMedia}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={{ padding: 4 }}
      />
    </View>
  );
};

export default GalleryScreen;
