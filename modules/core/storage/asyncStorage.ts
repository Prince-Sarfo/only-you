import AsyncStorage from '@react-native-async-storage/async-storage';

export async function storageSetObject<T>(key: string, value: T): Promise<void> {
  const serialized = JSON.stringify(value);
  await AsyncStorage.setItem(key, serialized);
}

export async function storageGetObject<T>(key: string): Promise<T | null> {
  const serialized = await AsyncStorage.getItem(key);
  if (!serialized) return null;
  try {
    return JSON.parse(serialized) as T;
  } catch {
    return null;
  }
}

export async function storageRemove(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

export async function storageGetString(key: string): Promise<string | null> {
  return AsyncStorage.getItem(key);
}

export async function storageSetString(key: string, value: string): Promise<void> {
  await AsyncStorage.setItem(key, value);
}
