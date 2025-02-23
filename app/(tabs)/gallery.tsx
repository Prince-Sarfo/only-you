import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  FlatList,
  Pressable,
  SafeAreaView,
  Modal 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { fileShare, fileDelete } from '../services/shareServices';
import { Image as ExpoImage } from 'expo-image';

const GalleryScreen = () => {
  const [activeTab, setActiveTab] = useState('photos');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Updated mock data with Unsplash images
  const photos = [
    { id: '1', url: 'https://images.unsplash.com/photo-1682687220742-aba19b51f36e' },
    { id: '2', url: 'https://images.unsplash.com/photo-1682687221038-404670f09471' },
    { id: '3', url: 'https://images.unsplash.com/photo-1682687220198-88e9bdea9931' },
    { id: '4', url: 'https://images.unsplash.com/photo-1682687220067-dced0a5865c5' },
  ];

  const videos = [
    { id: '1', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
    { id: '2', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
  ];

  const VideoItem = ({ url }: { url: string }) => {
    return (
      <View className="relative w-full h-full bg-black">
        <Image
          source={{ uri: 'https://i.vimeocdn.com/video/545562176_640.jpg' }} // This should be replaced with actual video thumbnail
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute inset-0 flex items-center justify-center">
          <View className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center">
            <Feather name="play" size={20} color="white" />
          </View>
        </View>
        <View className="absolute bottom-1 right-1 bg-black/50 px-2 py-0.5 rounded">
          <Text className="text-xs text-white">0:30</Text>
        </View>
      </View>
    );
  };

  const handleMorePress = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const ActionModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={() => setShowModal(false)}
    >
      <Pressable 
        className="flex-1 justify-end bg-black/50"
        onPress={() => setShowModal(false)}
      >
        <View className="bg-white rounded-t-2xl">
          <View className="p-4 border-b border-gray-100">
            <Text className="text-lg font-medium text-center text-gray-800">
              Options
            </Text>
          </View>
          <Pressable 
            className="p-4 flex-row items-center"
            onPress={() => {
              // fileShare(selectedItem?.id, activeTab);
              setShowModal(false);
            }}
          >
            <Feather name="share" size={24} color="#075E54" />
            <Text className="ml-3 text-base text-gray-800">Share</Text>
          </Pressable>
          <Pressable 
            className="p-4 flex-row items-center"
            onPress={() => {
              // fileDelete(selectedItem?.id, activeTab);
              setShowModal(false);
            }}
          >
            <Feather name="trash-2" size={24} color="#DC2626" />
            <Text className="ml-3 text-base text-gray-800">Delete</Text>
          </Pressable>
          <Pressable 
            className="p-4 border-t border-gray-100"
            onPress={() => setShowModal(false)}
          >
            <Text className="text-base text-center text-gray-600">Cancel</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );

  const ImageSkeleton = () => (
    <View className="w-full h-full bg-gray-200 animate-pulse rounded-sm" />
  );

  const renderMediaItem = ({ item, type }: { item: { id: string, url: string }, type: string }) => (
    <View className="relative w-[33.33%] aspect-square p-0.5">
      <Pressable 
        className="relative w-full h-full"
        onPress={() => {
          if (type === 'videos') {
            console.log('Play video:', item.url);
          }
        }}
      >
        {type === 'photos' ? (
          <ExpoImage
            source={`${item.url}?auto=format&fit=crop&w=800&q=80`}
            className="w-full h-full rounded-sm"
            contentFit="cover"
            placeholder={ImageSkeleton()}
            transition={300}
          />
        ) : (
          <VideoItem url={item.url} />
        )}
        
        <TouchableOpacity 
          onPress={() => handleMorePress(item)}
          className="absolute top-1 right-1 p-2"
        >
          <Feather name="more-vertical" size={20} color="white" />
        </TouchableOpacity>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white  ">
      {/* Updated Header */}
      <View className="px-4 py-3 border-b border-gray-100 flex self-center pt-10">
        <Text className="text-xl font-medium text-gray-800">
          Memories
        </Text>
      </View>

      {/* Updated Tabs */}
      <View className="flex-row justify-center px-4 border-b border-gray-100 ">
        <Pressable 
          className={`mr-8 py-3 ${activeTab === 'photos' ? 'border-b-2 border-[#075E54]' : ''}`}
          onPress={() => setActiveTab('photos')}
        >
          <Text className={`text-base ${activeTab === 'photos' ? 'text-[#075E54] font-medium' : 'text-gray-600'}`}>
            Photos
          </Text>
        </Pressable>
        <Pressable 
          className={`py-3 ${activeTab === 'videos' ? 'border-b-2 border-[#075E54]' : ''}`}
          onPress={() => setActiveTab('videos')}
        >
          <Text className={`text-base ${activeTab === 'videos' ? 'text-[#075E54] font-medium' : 'text-gray-600'}`}>
            Videos
          </Text>
        </Pressable>
      </View>

      {/* Updated Content */}
      <FlatList
        data={activeTab === 'photos' ? photos : videos}
        renderItem={(item) => renderMediaItem({ ...item, type: activeTab })}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        numColumns={3}
      />

      <ActionModal />
    </SafeAreaView>
  );
};

export default GalleryScreen;
