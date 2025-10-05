/*
Setup guide for OnlyYou app

1) Install dependencies
- npm install
- npx expo prebuild (for EAS/dev client) if using native modules like react-native-agora
- Use a Development Build (Expo Go does NOT support react-native-agora)

2) Environment variables
- Set your Agora App ID:
  - export EXPO_PUBLIC_AGORA_APP_ID="YOUR_AGORA_APP_ID"
- Optional: Token for development without token server (not recommended for prod):
  - export EXPO_PUBLIC_AGORA_TOKEN="YOUR_TEMP_TOKEN"
- Optional: Token endpoint if you have a server that issues tokens per channel/uid:
  - export EXPO_PUBLIC_AGORA_TOKEN_ENDPOINT="https://your.api/token"

3) Permissions (runtime)
- iOS/Android runtime permissions will be requested when entering call screens.
- For manual request in your own flows, use checkAndRequestPermissions below.

4) Platform permissions (build-time info)
- iOS Info.plist keys (if you customize native config):
  - NSCameraUsageDescription
  - NSMicrophoneUsageDescription
- Android Manifest permissions (added by SDKs):
  - android.permission.CAMERA
  - android.permission.RECORD_AUDIO

5) Pairing and chat
- Pair in the Pair tab, then chat in Chat tab. View-once and auto-delete are built in.

*/

import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';

export type PermissionTargets = {
  camera?: boolean;
  microphone?: boolean;
};

export async function checkAndRequestPermissions(targets: PermissionTargets): Promise<boolean> {
  const results: boolean[] = [];
  if (targets.camera) {
    const { status } = await Camera.requestCameraPermissionsAsync();
    results.push(status === 'granted');
  }
  if (targets.microphone) {
    const { status } = await Audio.requestPermissionsAsync();
    results.push(status === 'granted');
  }
  return results.every(Boolean);
}

export function assertAgoraEnv(): { appId: string; token?: string; tokenEndpoint?: string } {
  const appId = process.env.EXPO_PUBLIC_AGORA_APP_ID ?? '';
  const token = process.env.EXPO_PUBLIC_AGORA_TOKEN ?? undefined;
  const tokenEndpoint = process.env.EXPO_PUBLIC_AGORA_TOKEN_ENDPOINT ?? undefined;
  if (!appId) {
    console.warn('[Setup] EXPO_PUBLIC_AGORA_APP_ID is not set. Calls will use local mock service.');
  }
  return { appId, token, tokenEndpoint };
}
