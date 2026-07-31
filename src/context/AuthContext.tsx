import { createContext, useEffect, useState, type ReactNode } from 'react';
import { deleteUser } from 'firebase/auth';
import {
  type FirebaseUser,
  signInWithEmail,
  signInWithGoogle,
  signOut as authSignOut,
  signUpWithEmail,
  subscribeToAuthState,
} from '../data/authService';
import { createUserProfile, deleteUserProfile, getUserProfile, updateUserProfile } from '../data/userProfileRepository';
import type { UserDraft, UserProfile } from '../types/user';

export type AuthStatus = 'loading' | 'guest' | 'needs-profile' | 'authenticated';

export interface AuthContextValue {
  status: AuthStatus;
  firebaseUser: FirebaseUser | null;
  profile: UserProfile | null;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  completeProfile: (draft: UserDraft) => Promise<void>;
  updateProfile: (draft: UserDraft) => Promise<void>;
  deleteAccount: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (nextUser) => {
      setFirebaseUser(nextUser);
      if (!nextUser) {
        setProfile(null);
        setStatus('guest');
        return;
      }
      const existingProfile = await getUserProfile(nextUser.uid);
      setProfile(existingProfile);
      setStatus(existingProfile ? 'authenticated' : 'needs-profile');
    });
    return unsubscribe;
  }, []);

  async function handleSignUpWithEmail(email: string, password: string) {
    await signUpWithEmail(email, password);
  }

  async function handleSignInWithEmail(email: string, password: string) {
    await signInWithEmail(email, password);
  }

  async function handleSignInWithGoogle() {
    await signInWithGoogle();
  }

  async function completeProfile(draft: UserDraft) {
    if (!firebaseUser) return;
    const nextProfile = await createUserProfile(firebaseUser.uid, draft);
    setProfile(nextProfile);
    setStatus('authenticated');
  }

  async function updateProfile(draft: UserDraft) {
    if (!firebaseUser) return;
    const nextProfile = await updateUserProfile(firebaseUser.uid, draft);
    setProfile(nextProfile);
  }

  async function deleteAccount() {
    if (!firebaseUser) return;
    await deleteUserProfile(firebaseUser.uid);
    await deleteUser(firebaseUser);
  }

  return (
    <AuthContext.Provider
      value={{
        status,
        firebaseUser,
        profile,
        signUpWithEmail: handleSignUpWithEmail,
        signInWithEmail: handleSignInWithEmail,
        signInWithGoogle: handleSignInWithGoogle,
        completeProfile,
        updateProfile,
        deleteAccount,
        signOut: authSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}