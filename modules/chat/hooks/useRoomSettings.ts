import { useCallback, useEffect, useMemo, useState } from 'react';
import { RoomId } from '@/modules/chat/types';
import { LocalRoomSettingsService } from '@/modules/chat/services/LocalRoomSettingsService';
import { RoomSettings } from '@/modules/chat/services/RoomSettingsService';

export function useRoomSettings(roomId: RoomId | null) {
  const [service] = useState(() => new LocalRoomSettingsService());
  const [settings, setSettings] = useState<RoomSettings>({ autoDeleteSeconds: null });

  useEffect(() => {
    if (!roomId) return;
    service.get(roomId).then(setSettings);
  }, [roomId, service]);

  const setAutoDelete = useCallback(async (seconds: number | null) => {
    if (!roomId) return;
    const next = await service.set(roomId, { autoDeleteSeconds: seconds });
    setSettings(next);
  }, [roomId, service]);

  return useMemo(() => ({ settings, setAutoDelete }), [settings, setAutoDelete]);
}
