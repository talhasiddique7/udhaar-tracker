import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, Dimensions } from 'react-native';
import { useAuth } from '../context/authContext';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../assets/images/Character.png')} // Full illustration
        style={styles.illustration}
        resizeMode="contain"
      />

      <Text style={styles.name}>{user?.name || user?.email || 'User Name'}</Text>
      <Text style={styles.email}>{user?.email}</Text>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  illustration: {
    width: width * 0.8,  // 80% of screen width
    height: width * 0.8,
    marginBottom: 30,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 6,
  },
  email: {
    fontSize: 14,
    color: '#64748b',
  },
});
