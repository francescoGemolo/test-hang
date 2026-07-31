import type { UserProfile } from '../types/user';
import { readJSON, removeKey, writeJSON } from './storage';

const USER_KEY = 'hangout:user';

export interface AuthRepository {
  getCurrentUser(): Promise<UserProfile | null>;
  wasRemembered(): Promise<boolean>;
  saveUser(user: UserProfile, remember: boolean): Promise<void>;
  deleteUser(): Promise<void>;
}

class LocalAuthRepository implements AuthRepository {
  async getCurrentUser(): Promise<UserProfile | null> {
    return readJSON<UserProfile>(USER_KEY, localStorage) ?? readJSON<UserProfile>(USER_KEY, sessionStorage);
  }

  async wasRemembered(): Promise<boolean> {
    return readJSON<UserProfile>(USER_KEY, localStorage) !== null;
  }

  async saveUser(user: UserProfile, remember: boolean): Promise<void> {
    removeKey(USER_KEY, localStorage);
    removeKey(USER_KEY, sessionStorage);
    writeJSON(USER_KEY, user, remember ? localStorage : sessionStorage);
  }

  async deleteUser(): Promise<void> {
    removeKey(USER_KEY, localStorage);
    removeKey(USER_KEY, sessionStorage);
  }
}

export const authRepository: AuthRepository = new LocalAuthRepository();