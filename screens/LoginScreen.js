import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await api.post('/users/login', { email, password });
            if (response.data && response.data.data && response.data.data.user) {
                const { user } = response.data.data;
                const { token } = response.data;

                if (response.data.status === 'success' && token) {
                    await AsyncStorage.setItem('token', token);
                    await AsyncStorage.setItem('userRole', user.role);

                    navigation.reset({
                        index: 0,
                        routes: [{ name: user.role === 'admin' ? 'AdminScreen' : 'UserScreen' }],
                    });
                } else {
                    Alert.alert('Error', 'Invalid credentials or missing token');
                }
            } else {
                Alert.alert('Error', 'Unexpected response structure');
            }
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
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
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.buttonText}>Log In</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
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

export default LoginScreen;
