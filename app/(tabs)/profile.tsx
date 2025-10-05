import { View, Text, Image, TouchableOpacity, TextInput, Alert } from "react-native";
import { useAuth } from "@/context/auth"; 
import { useTheme } from "@/context/theme"; 
import { useState } from "react";
import { usePairingContext } from "@/modules/pairing/context";
import * as ImagePicker from 'expo-image-picker';
import { File, Paths } from 'expo-file-system';

export default function ProfileScreen() {
    const { user, logout, updateUser } = useAuth();
    const { toggleTheme, isDark } = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const { isPaired, code, leaveRoom } = usePairingContext();

    return (
        <View className="flex-1 p-5">
            <View className="items-center mb-8">
                <TouchableOpacity onPress={async () => {
                    try {
                        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                        if (status !== 'granted') {
                          Alert.alert('Permission required', 'We need access to your photos to set a profile picture.');
                          return;
                        }
                        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.8 });
                        if (result.canceled || result.assets.length === 0) return;
                        const asset = result.assets[0];
                        // persist to app document directory for stability
                        const ext = asset.fileName?.split('.').pop() || 'jpg';
                        const destFile = new File(Paths.document, `profile.${ext}`);
                        const srcFile = new File(asset.uri);
                        srcFile.copy(destFile);
                        updateUser({ photoURL: destFile.uri });
                    } catch (e) {
                        console.warn(e);
                        Alert.alert('Error', 'Failed to update profile photo.');
                    }
                }}>
                    <Image 
                        source={user?.photoURL ? { uri: user.photoURL } : require('@/assets/images/Profile.png')}
                        className="w-32 h-32 rounded-full mb-2"
                    />
                    <Text className="text-blue-500 text-center mt-1">Edit Photo</Text>
                </TouchableOpacity>

                {isEditing ? (
                    <TextInput
                        value={user?.displayName}
                        onChangeText={(text) => updateUser({ displayName: text })}
                        className="text-2xl font-bold text-center border-b border-blue-500 my-2 p-1"
                    />
                ) : (
                    <Text className="text-2xl font-bold my-2">{user?.displayName || 'User'}</Text>
                )}
                <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                    <Text className="text-blue-500 text-base">
                        {isEditing ? 'Save' : 'Edit Name'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View className="mt-5">
                {isPaired ? (
                  <View className="p-4 bg-green-50 rounded-lg mb-3">
                    <Text className="text-green-700">Paired code: {code}</Text>
                    <TouchableOpacity onPress={leaveRoom} className="mt-2">
                      <Text className="text-red-500">Leave room</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
                <View className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-3">
                    <Text className="dark:text-white mb-2">Theme</Text>
                    <View className="flex-row space-x-3">
                        <TouchableOpacity onPress={() => { if (isDark) toggleTheme(); }} className="px-4 py-2 bg-white dark:bg-gray-700 rounded">
                            <Text className="dark:text-white">Light</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { if (!isDark) toggleTheme(); }} className="px-4 py-2 bg-white dark:bg-gray-700 rounded">
                            <Text className="dark:text-white">Dark</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity 
                    className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-3"
                    onPress={() => {/* Add phone number change logic */}}
                >
                    <Text className="dark:text-white">Change Phone Number</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-3"
                    onPress={logout}
                >
                    <Text className="text-red-500 text-center">Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}