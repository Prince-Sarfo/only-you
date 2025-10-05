import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  peerId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  setPeerId: (peerId: string) => Promise<void>;
}

const AUTH_STORAGE_KEY = 'auth:user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (raw) {
          const parsed: User = JSON.parse(raw);
          setUser(parsed);
        }
      } catch {
        // ignore storage errors for now
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const persistUser = useCallback(async (u: User | null) => {
    if (u) {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(u));
    } else {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  const login = useCallback(async (userData: User) => {
    setUser(userData);
    await persistUser(userData);
  }, [persistUser]);

  const logout = useCallback(async () => {
    setUser(null);
    await persistUser(null);
  }, [persistUser]);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    setUser(prev => {
      const next = prev ? { ...prev, ...updates } : (updates.id ? (updates as User) : null);
      // fire-and-forget persist in background; no await here to keep UI snappy
      if (next) {
        persistUser(next);
      }
      return next;
    });
  }, [persistUser]);

  const setPeerId = useCallback(async (peerId: string) => {
    await updateUser({ peerId });
  }, [updateUser]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser, setPeerId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}