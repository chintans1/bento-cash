import AsyncStorage from '@react-native-async-storage/async-storage';

export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
    throw Error(`Error reading data for key ${key}, exception ${e}`);
  }
};

export const storeData = async (key: string, value: object) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    // saving error
    throw Error(`Error saving data for key ${key}, exception ${e}`);
  }
};
