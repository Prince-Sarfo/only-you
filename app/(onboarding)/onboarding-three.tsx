import {  SafeAreaView } from "react-native";
import InitialScreen from "../../components/initial-screen";

export default function OnboardingThreeScreen() {
    return (
        <SafeAreaView className="flex-1 justify-center items-center top-0"> 
            <InitialScreen 
                title="Focused Conversation" 
                description="Dive deep and stay engaged with the person who matters" 
                buttonText="NEXT" 
                path="/(tabs)/chat"
            />
        </SafeAreaView>
    )
}