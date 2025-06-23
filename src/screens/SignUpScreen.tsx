import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ScrollView,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { useAuth } from '../context/authContext';
import { MaterialIcons } from '@expo/vector-icons';

export default function SignUpScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();

const handleSignUp = async () => {
  // Basic field validation
  if (!name || !email || !password) {
    Alert.alert('Error', 'Please fill in all fields');
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Alert.alert('Error', 'Please enter a valid email address');
    return;
  }

  // Password strength validation (minimum 8 chars with at least 1 number)
  const passwordRegex = /^(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    Alert.alert(
      'Weak Password',
      'Password must be at least 8 characters long and contain at least one number'
    );
    return;
  }

  // Name validation (minimum 2 characters)
  if (name.trim().length < 2) {
    Alert.alert('Error', 'Please enter a valid name (at least 2 characters)');
    return;
  }

  setIsLoading(true);
  try {
    const { error } = await signup(name, email, password);

    if (error) {
      Alert.alert('Sign up failed', error.message);
    } else {
      Alert.alert(
        'Account Created',
        'Your Udhaar Book account has been successfully created!',
        [
          {
            text: 'Continue',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    }
  } catch (error: any) {
    console.error('Signup error:', error);
    Alert.alert(
      'Error',
      error?.message || 'Failed to create account. Please try again later.'
    );
  } finally {
    setIsLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Image 
              source={require('../../assets/images/signup2.png')} 
              style={styles.logo} 
              resizeMode="contain"
            />
            
            <Text style={styles.title}>Create Your Account</Text>
            <Text style={styles.subtitle}>Manage your shop's credit easily</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="person" size={20} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="email" size={20} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="lock" size={20} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Create a password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.toggleButton}
                >
                  <MaterialIcons 
                    name={showPassword ? 'visibility-off' : 'visibility'} 
                    size={20} 
                    color="#888" 
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.passwordHint}>
                Use at least 8 characters with a mix of letters and numbers
              </Text>
            </View>

            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]} 
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}> Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: windowWidth * 0.08,
    paddingBottom: 40,
  },
  logo: {
    width: windowWidth * 0.4,
    height: windowWidth * 0.4,
    alignSelf: 'center',
    marginBottom: windowHeight * 0.02,
  },
  title: {
    fontSize: windowWidth * 0.08,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: windowWidth * 0.04,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: windowHeight * 0.05,
  },
  inputContainer: {
    marginBottom: windowHeight * 0.02,
  },
  label: {
    fontSize: windowWidth * 0.04,
    color: '#1E293B',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: windowHeight * 0.06,
    color: '#1E293B',
    fontSize: windowWidth * 0.04,
    paddingVertical: 0,
  },
  passwordHint: {
    fontSize: windowWidth * 0.03,
    color: '#64748B',
    marginTop: 6,
  },
  toggleButton: {
    padding: 8,
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: windowHeight * 0.02,
    borderRadius: 10,
    marginTop: windowHeight * 0.03,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#A5B4FC',
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: windowWidth * 0.045,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: windowHeight * 0.03,
  },
  footerText: {
    color: '#64748B',
    fontSize: windowWidth * 0.035,
  },
  footerLink: {
    color: '#4F46E5',
    fontSize: windowWidth * 0.035,
    fontWeight: '600',
  },
});