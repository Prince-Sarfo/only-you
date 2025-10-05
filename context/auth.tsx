import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageGetObject, storageSetObject, storageRemove } from '@/modules/core/storage/asyncStorage';

interface User {
  id: string; // stable identity for senderId
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const persisted = await storageGetObject<User>('auth:user');
      if (persisted) setUser(persisted);
      setIsLoading(false);
    })();
  }, []);

  const login = (userData: Omit<User, 'id'> & { id?: string }) => {
    // ensure id exists even if caller omits it
    const ensured: User = { id: userData.id ?? 'local-user', ...userData } as User;
    setUser(ensured);
    storageSetObject('auth:user', ensured);
  };

  const logout = () => {
    setUser(null);
    storageRemove('auth:user');
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => {
      const next = prev ? { ...prev, ...updates } : null;
      if (next) storageSetObject('auth:user', next);
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading }}>
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