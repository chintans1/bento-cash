import * as SecureStore from 'expo-secure-store';

export async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

export async function getValueFor(key: string): Promise<string> {
  return SecureStore.getItemAsync(key);
}

export async function doesKeyExist(key: string) {
  const value = await SecureStore.getItemAsync(key);

  if (value != null) {
    return value.length > 0;
  }
  return false;
}
