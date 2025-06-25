// navigation/AppNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomNavbar from '../navigation/BottomNavabr';

import HomeScreen from '../screens/Home';
import CustomersScreen from '../screens/CustomersScreen';
import CustomerDetails from '../screens/CustomerDetails';
import MakeBillScreen from '../screens/MakeBillScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';

import { useAuth } from '../context/authContext';

const RootStack = createNativeStackNavigator();
const CustomersStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Nested Customers Stack
function CustomersNavigator() {
  return (
    <CustomersStack.Navigator>
      <CustomersStack.Screen name="Customers" component={CustomersScreen} />
      <CustomersStack.Screen name="CustomerDetails" component={CustomerDetails} />
    </CustomersStack.Navigator>
  );
}

// Tabs with Home, Customers, etc.
function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNavbar {...props} />}
      screenOptions={{ headerShown: false }}
      sceneContainerStyle={{ backgroundColor: '#F8FAFC' }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Customers" component={CustomersNavigator} />
      <Tab.Screen name="Bills" component={MakeBillScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Main App Logic (Auth / Main)
export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <RootStack.Screen name="Main" component={MainTabs} />
      ) : (
        <>
          <RootStack.Screen name="Login" component={LoginScreen} />
          <RootStack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
    </RootStack.Navigator>
  );
}
