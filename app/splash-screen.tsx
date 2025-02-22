import { View, Text, SafeAreaView, StatusBar } from "react-native";
import { Link } from "expo-router";
export default function SplashScreen() {



  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <View className="flex-1 justify-center items-center">
        <Text className=" text-4xl font-bold text-center ">
            <Link href="/(onboarding)/onboarding-one"> 
          Only<Text className="text-primary">You</Text>
            </Link>
        </Text>
      </View>
      <StatusBar />
    </SafeAreaView>
  );
}
