import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { UserDraft, UserProfile } from '../types/user';

const USERS_COLLECTION = 'users';

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snapshot = await getDoc(doc(db, USERS_COLLECTION, uid));
  if (!snapshot.exists()) return null;
  return { id: uid, ...(snapshot.data() as Omit<UserProfile, 'id'>) };
}

export async function createUserProfile(uid: string, draft: UserDraft): Promise<UserProfile> {
  await setDoc(doc(db, USERS_COLLECTION, uid), draft);
  return { id: uid, ...draft };
}

export async function updateUserProfile(uid: string, draft: UserDraft): Promise<UserProfile> {
  await setDoc(doc(db, USERS_COLLECTION, uid), draft, { merge: true });
  return { id: uid, ...draft };
}

export async function deleteUserProfile(uid: string): Promise<void> {
  await deleteDoc(doc(db, USERS_COLLECTION, uid));
}