import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import api from '../services/api';

const SignupScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('US');
    const [callingCode, setCallingCode] = useState('1');
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        setLoading(true);
        try {
            const response = await api.post('/users/register', {
                name,
                email,
                password,
                phone: `${callingCode}${phoneNumber}`,
            });
            Alert.alert('Success', 'OTP sent to your email. Please verify your account.');
            navigation.navigate('OTPVerificationScreen', { email });
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>

            <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholderTextColor="#8a8d91"
            />
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                placeholderTextColor="#8a8d91"
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
                placeholderTextColor="#8a8d91"
            />

            <View style={styles.phoneContainer}>
                <CountryPicker
                    countryCode={countryCode}
                    withCallingCode
                    withFilter
                    withFlag
                    onSelect={(country) => {
                        setCountryCode(country.cca2);
                        setCallingCode(country.callingCode[0]);
                    }}
                    visible={showCountryPicker}
                    onClose={() => setShowCountryPicker(false)}
                />
                <TouchableOpacity
                    style={styles.countryPickerButton}
                    onPress={() => setShowCountryPicker(true)}
                >
                    <Text style={styles.callingCodeText}>+{callingCode}</Text>
                </TouchableOpacity>
                <TextInput
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    style={styles.phoneInput}
                    keyboardType="phone-pad"
                    placeholderTextColor="#8a8d91"
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#ffffff" />
                ) : (
                    <Text style={styles.buttonText}>Sign Up</Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Already have an account? Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: '600',
        marginBottom: 24,
        textAlign: 'center',
        color: '#2E7D32',
    },
    input: {
        height: 50,
        borderColor: '#2E7D32',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        backgroundColor: '#ffffff',
        fontSize: 16,
        color: '#2E7D32',
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    countryPickerButton: {
        marginRight: 10,
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    callingCodeText: {
        fontSize: 16,
        color: '#2E7D32',
    },
    phoneInput: {
        flex: 1,
        height: 50,
        borderColor: '#2E7D32',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        backgroundColor: '#ffffff',
        fontSize: 16,
        color: '#2E7D32',
    },
    button: {
        backgroundColor: '#2E7D32',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 16,
    },
    linkText: {
        color: '#00796b',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default SignupScreen;
