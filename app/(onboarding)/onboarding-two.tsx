import {  SafeAreaView } from "react-native";
import InitialScreen from "../../components/initial-screen";

export default function OnboardingTwoScreen() {
    return (
        <SafeAreaView className="flex-1 justify-center items-center top-0"> 
            <InitialScreen 
                title="Your Privacy First" 
                description="Your chats are secured and private" 
                buttonText="NEXT" 
                path="/(onboarding)/onboarding-three" 
            />
        </SafeAreaView>
    )
}