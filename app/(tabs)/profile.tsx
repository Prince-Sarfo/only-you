import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import { useAuth } from "@/context/auth"; 
import { useTheme } from "@/context/theme"; 
import { useState } from "react";

export default function ProfileScreen() {
    const { user, logout, updateUser } = useAuth();
    const { toggleTheme, isDark } = useTheme();
    const [isEditing, setIsEditing] = useState(false);

    return (
        <View className="flex-1 p-5">
            <View className="items-center mb-8">
                <TouchableOpacity onPress={() => {}}>
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
                <TouchableOpacity 
                    className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-3"
                    onPress={toggleTheme}
                >
                    <Text className="dark:text-white">Toggle Theme</Text>
                </TouchableOpacity>

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