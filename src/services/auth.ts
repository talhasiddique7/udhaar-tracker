// services/auth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveUser = async (username: string, password: string) => {
  const user = { username, password };
  await AsyncStorage.setItem('user', JSON.stringify(user));
};

export const getUser = async () => {
  const userData = await AsyncStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};
