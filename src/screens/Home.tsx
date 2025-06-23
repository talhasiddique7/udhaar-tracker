import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from './../context/authContext';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const { logout, user } = useAuth();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 Home Screen - Udhaar Tracker</Text>
      <Text style={styles.email}>Logged in as: {user?.email}</Text>

      <TouchableOpacity 
        style={styles.navButton} 
        onPress={() => navigation.navigate('Customers')}
      >
        <Text style={styles.navButtonText}>👥 View Customers</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navButton} 
        onPress={() => navigation.navigate('AddBill')}
      >
        <Text style={styles.navButtonText}>🧾 Make a Bill</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navButton} 
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.navButtonText}>👤 Profile</Text>
      </TouchableOpacity>

          <TouchableOpacity 
        style={styles.navButton} 
        onPress={() => navigation.navigate('CustomerDetails')}
      >
        <Text style={styles.navButtonText}>👤 Customer Details</Text>
      </TouchableOpacity>

      <View style={styles.logoutButtonContainer}>
        <Button title="Logout" onPress={logout} color="#d32f2f" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  email: {
    marginBottom: 20,
    fontSize: 14,
    color: '#555',
  },
  navButton: {
    backgroundColor: '#4F46E5',
    padding: 14,
    borderRadius: 8,
    marginVertical: 8,
    width: '80%',
    alignItems: 'center',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButtonContainer: {
    marginTop: 30,
  },
});
