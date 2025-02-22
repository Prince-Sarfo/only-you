import {  SafeAreaView } from "react-native";
import InitialScreen from "../../components/initial-screen";

export default function OnboardingOneScreen() {
    return (
        <SafeAreaView className="flex-1 justify-center items-center top-0"> 
            <InitialScreen 
                title="Simple and Intuitive" 
                description="Easily navigate and enjoy a cluster-free chat experience" 
                buttonText="NEXT" 
                path="/(onboarding)/onboarding-two" 
            />
        </SafeAreaView>
    )
}