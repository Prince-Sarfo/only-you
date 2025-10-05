import { Stack } from 'expo-router';
import "./global.css";
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from "@/context/auth";
import { ThemeProvider } from "@/context/theme";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="splash-screen" />
          <StatusBar style="light" />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}