import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = 'auth_user_id';

export const saveSession = async (userId) => {
  await AsyncStorage.setItem(SESSION_KEY, userId);
};

export const getSession = async () => {
  return await AsyncStorage.getItem(SESSION_KEY);
};

export const clearSession = async () => {
  await AsyncStorage.removeItem(SESSION_KEY);
};