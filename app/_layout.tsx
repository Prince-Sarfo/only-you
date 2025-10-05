import { Stack } from 'expo-router';
import "./global.css";
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from "@/context/auth";
import { ThemeProvider } from "@/context/theme";
import { PairingProvider } from "@/modules/pairing/context";
import { CallsProvider } from "@/modules/calls/context";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <PairingProvider>
          <CallsProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="splash-screen" />
              <StatusBar style="light" />
            </Stack>
          </CallsProvider>
        </PairingProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}