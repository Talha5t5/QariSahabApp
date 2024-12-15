import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create an axios instance
const api = axios.create({
    baseURL: 'https://quranappbackend.websol.cloud/api',  // Change this to your backend URL
});

// Add a request interceptor to include the token
api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
