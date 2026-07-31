export function readJSON<T>(key: string, storage: Storage = localStorage): T | null {
  const raw = storage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeJSON(key: string, value: unknown, storage: Storage = localStorage): void {
  storage.setItem(key, JSON.stringify(value));
}

export function removeKey(key: string, storage: Storage = localStorage): void {
  storage.removeItem(key);
}