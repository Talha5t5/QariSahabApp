import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import api from '../services/api';

const OTPVerificationScreen = ({ route, navigation }) => {
  const { email } = route.params; // Receiving email from SignupScreen
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOTP = async () => {
    try {
      const response = await api.post('/users/verify-otp', { email, otp });
      Alert.alert('Success', 'Account verified successfully.');
      navigation.navigate('Login'); // Navigate to LoginScreen after successful verification
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'OTP verification failed.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <TextInput
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        style={styles.input}
        placeholderTextColor="#8a8d91"
      />
      <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOTP}disabled={loading}>
      {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.verifyButtonText}>Verify</Text> }
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#e0f2f1',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#004d40',
  },
  input: {
    height: 50,
    backgroundColor: '#ffffff',
    borderColor: '#004d40',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    color: '#004d40',
  },
  verifyButton: {
    backgroundColor: '#00796b',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginTop: 20,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default OTPVerificationScreen;
