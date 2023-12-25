import * as SecureStore from 'expo-secure-store';

export async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

export async function getValueFor(key: string): Promise<string> {
  return await SecureStore.getItemAsync(key);
}

export async function doesKeyExist(key: string): Promise<boolean> {
  return (await SecureStore.getItemAsync(key)).length > 0;
}