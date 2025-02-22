import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
    FadeInDown, 
    FadeIn, 
    FadeOut,
    runOnJS 
} from 'react-native-reanimated';

interface InitialScreenProps {
    title: string;
    description: string;
    buttonText: string;
    path: string;
}

export default function InitialScreen({ title, description, buttonText, path }: InitialScreenProps) {
    const router = useRouter();

    const handleNavigation = () => {
        router.navigate(path as any);
    };

    return (
        <Animated.View 
            className="w-full px-8 items-center"
            entering={FadeIn.duration(500)}
            exiting={FadeOut.duration(300)}
        >
            <Animated.View 
                entering={FadeIn.delay(200).duration(1000)}
                className="bg-gray-200 rounded-full w-48 h-48 mb-8 items-center justify-center"
            >
                <Image 
                    source={require('../assets/images/couple1.png')} 
                    className="w-40 h-40"
                    resizeMode="contain"
                />
            </Animated.View>
            
            <Animated.Text 
                entering={FadeInDown.delay(400).duration(1000)}
                className="text-2xl font-bold text-center mb-3"
            >
                {title}
            </Animated.Text>
            
            <Animated.Text 
                entering={FadeInDown.delay(600).duration(1000)}
                className="text-gray-600 text-center mb-8"
            >
                {description}
            </Animated.Text>
            
            <Animated.View
                entering={FadeInDown.delay(800).duration(1000)}
            >
                <TouchableOpacity 
                    onPress={handleNavigation}
                    className="bg-green-500 px-12 py-3 rounded-full"
                >
                    <Text className="text-white font-semibold">
                        {buttonText}
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </Animated.View>
    );
}