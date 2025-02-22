import React, { useState } from "react";
import { View, Text, SafeAreaView, FlatList, TextInput, TouchableOpacity, ScrollView } from "react-native";



export default function ChatScreen() {
    const [messages, setMessages] = useState<{ text: string; id: string }[]>([]);
    const [input, setInput] = useState("");


    const sendMessage = () => {
        if (input.trim()) {
            setMessages([...messages, { text: input, id: messages.length.toString() }]);
            setInput("");
        }
    };

    return (
        <SafeAreaView className="flex-1">
            <ScrollView>

            <View className="flex-1">
                <FlatList
                    data={messages}
                    renderItem={({ item }) => (
                        <View className="p-2">
                            <Text className="bg-gray-200 p-2 rounded">{item.text}</Text>
                        </View>
                    )}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ padding: 10 }}
                    />
            </View>
            </ScrollView>
            <View className="flex-row p-2">
                <TextInput
                    value={input}
                    onChangeText={setInput}
                    placeholder="Type a message"
                    className="flex-1 border border-gray-300 rounded p-2"
                />
                <TouchableOpacity onPress={sendMessage} className="ml-2 bg-blue-500 p-2 rounded">
                    <Text className="text-white">Send</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}
