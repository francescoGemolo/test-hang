import { createContext, useEffect, useState, type ReactNode } from 'react';
import { authRepository } from '../data/authRepository';
import type { UserDraft, UserProfile } from '../types/user';

export interface AuthContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  login: (draft: UserDraft, remember: boolean) => Promise<void>;
  updateProfile: (draft: UserDraft) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([authRepository.getCurrentUser(), authRepository.wasRemembered()]).then(
      ([current, remembered]) => {
        setUser(current);
        setRemember(remembered);
        setIsLoading(false);
      },
    );
  }, []);

  async function login(draft: UserDraft, rememberChoice: boolean) {
    const next: UserProfile = { id: crypto.randomUUID(), ...draft };
    await authRepository.saveUser(next, rememberChoice);
    setUser(next);
    setRemember(rememberChoice);
  }

  async function updateProfile(draft: UserDraft) {
    if (!user) return;
    const next: UserProfile = { ...user, ...draft };
    await authRepository.saveUser(next, remember);
    setUser(next);
  }

  async function logout() {
    await authRepository.deleteUser();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}