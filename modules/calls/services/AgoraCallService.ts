import { CallService, Unsubscribe } from '@/modules/calls/services/CallService';
import { CallSession, CallType } from '@/modules/calls/types';
import { generateId } from '@/modules/core/utils/ids';
import createAgoraRtcEngine, { ChannelProfileType, ClientRoleType, IRtcEngineEventHandler, RtcEngineContext } from 'react-native-agora';

const APP_ID = process.env.EXPO_PUBLIC_AGORA_APP_ID ?? '';

export class AgoraCallService implements CallService {
  private session: CallSession | null = null;
  private listeners = new Set<(s: CallSession | null) => void>();
  private engine: ReturnType<typeof createAgoraRtcEngine> | null = null;
  private audioMuted = false;
  private videoEnabled = true;

  private async ensureEngine(type: CallType) {
    if (this.engine) return;
    this.engine = createAgoraRtcEngine();
    this.engine.initialize({
      appId: APP_ID,
      channelProfile: ChannelProfileType.ChannelProfileCommunication,
    } as RtcEngineContext);
    this.engine.enableAudio();
    if (type === 'video') {
      this.engine.enableVideo();
    }

    const handler: IRtcEngineEventHandler = {
      onJoinChannelSuccess: (connection, elapsed) => {
        if (!this.session) return;
        this.session = { ...this.session, localUid: Number(connection.localUid) };
        this.emit();
      },
      onUserJoined: (connection, uid) => {
        if (!this.session) return;
        this.session = { ...this.session, remoteUids: Array.from(new Set([...(this.session.remoteUids || []), Number(uid)])) };
        this.emit();
      },
      onUserOffline: (connection, uid) => {
        if (!this.session) return;
        this.session = { ...this.session, remoteUids: (this.session.remoteUids || []).filter((u) => u !== Number(uid)) };
        this.emit();
      },
      onLeaveChannel: () => {
        this.session = null;
        this.emit();
      },
    };

    this.engine.registerEventHandler(handler);
  }

  async getCurrent(): Promise<CallSession | null> {
    return this.session;
  }

  async start(type: CallType, channelId: string): Promise<CallSession> {
    await this.ensureEngine(type);
    this.session = {
      id: generateId('call'),
      type,
      channelId,
      startedAt: Date.now(),
      isOngoing: true,
      remoteUids: [],
    };

    // Token handling
    let token: string | null = process.env.EXPO_PUBLIC_AGORA_TOKEN ?? null;
    const endpoint = process.env.EXPO_PUBLIC_AGORA_TOKEN_ENDPOINT;
    if (!token && endpoint) {
      try {
        const res = await fetch(`${endpoint}?channel=${encodeURIComponent(channelId)}`);
        const data = await res.json();
        token = data.token || data.agoraToken || null;
      } catch (e) {
        console.warn('[Agora] Failed to fetch token', e);
      }
    }

    this.engine!.joinChannel(token ?? '', channelId, 0, {
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
    });

    this.emit();
    return this.session;
  }

  async end(): Promise<void> {
    if (this.engine) {
      try { this.engine.leaveChannel(); } catch {}
      try { this.engine.unregisterEventHandler({} as any); } catch {}
      try { this.engine.release(); } catch {}
      this.engine = null;
    }
    if (this.session) {
      this.session = { ...this.session, isOngoing: false };
    }
    this.emit();
    this.session = null;
  }

  subscribe(cb: (session: CallSession | null) => void): Unsubscribe {
    this.listeners.add(cb);
    cb(this.session);
    return () => this.listeners.delete(cb);
  }

  private emit() {
    this.listeners.forEach((l) => l(this.session));
  }

  // Controls
  muteLocalAudio(mute: boolean) {
    if (!this.engine) return;
    this.audioMuted = mute;
    this.engine.muteLocalAudioStream(mute);
  }
  enableLocalVideo(enabled: boolean) {
    if (!this.engine) return;
    this.videoEnabled = enabled;
    this.engine.enableLocalVideo(enabled);
  }
  switchCamera() {
    if (!this.engine) return;
    this.engine.switchCamera();
  }
}
