// Chat.js
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";

const messages = [
  {
    id: "1",
    sender: "user",
    text: "Hey, how is it going?",
    time: "4:30 pm",
    image: null,
  },
  {
    id: "2",
    sender: "bot",
    text: "Just finished the project",
    time: "4:30 pm",
    image: null,
  },
  {
    id: "3",
    sender: "user",
    text: "It's going pretty well, thanks",
    time: "4:31 pm",
    image: null,
  },
  {
    id: "4",
    sender: "bot",
    text: "Nice, congrats on finishing the project. I'm just relaxing and catching up on some reading. Any plans for the weekend?",
    time: "4:32 pm",
    image: null,
  },
  // Add more messages as needed
];

const ChatScreen = () => {
  const [messageText, setMessageText] = useState("");
  const [chatMessages, setChatMessages] = useState(messages);

  const sendMessage = () => {
    if (messageText.trim() === "") return;
    
    const newMessage = {
      id: (chatMessages.length + 1).toString(),
      sender: "user",
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      image: null,
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setMessageText("");
  };

  const renderMessage = ({ item }) => (
    <View>

    <View
      className={`pb-1 rounded-md max-w-[80%] ${
          item.sender === "user"
          ? "self-end bg-green-500"
          : "self-start bg-gray-800"
      }`}
    >
      <Text className={`px-4 py-2 ${item.sender === "user" ? "text-white" : "text-white"}`}>
        {item.text}
      </Text>
    </View>
      <Text
        className={`text-xs px-4 pb-1 ${
          item.sender === "user" ? "text-gray-400 self-end" : "text-gray-400"
        }`}
        >
        {item.time}
      </Text>
          </View>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
    
        <Text className="flex-1 text-center text-lg font-semibold">Mary</Text>
      </View>

      {/* Call Options */}
      <View className="flex-row justify-center space-x-4 p-4 bg-gray-50 border-b border-gray-200">
        <TouchableOpacity className="flex-row items-center bg-white px-6 py-2 rounded-full border border-gray-200">
          <Text className="text-lg mr-2">📞</Text>
          <Text>Voice Call</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center bg-white px-6 py-2 rounded-full border border-gray-200">
          <Text className="text-lg mr-2">📹</Text>
          <Text>Video Call</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={chatMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
      />
      
      {/* Input Bar */}
      <View className="flex-row items-center bg-gray-200 mx-4 rounded-full p-2" >
        <TextInput
          className="flex-1  rounded-full px-4 py-2 active:border-none"
          placeholder="Message"
          value={messageText}
          onChangeText={setMessageText}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity className="ml-2">
          <Image source={require('@/assets/images/Paperclip.png')} />
        </TouchableOpacity>
        <TouchableOpacity className="ml-2">
                 <Image source={require('@/assets/images/Microphone.png')} />

        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;
