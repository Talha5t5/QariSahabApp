import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';  // Import the splash screen
import AppNavigator from './AppNavigator';
import { LogBox } from 'react-native';

// Suppress all logs (including warnings)
LogBox.ignoreAllLogs(); 


const App = () => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (token) {
                    // Assume token is valid and get the role from AsyncStorage
                    const role = await AsyncStorage.getItem('userRole'); // Set on login
                    setIsAuthenticated(true);
                    setUserRole(role);
                }
            } catch (error) {
                console.error("Error checking token:", error);
            } finally {
                setLoading(false);
                SplashScreen.hide();  // Hide the splash screen when loading is complete
            }
        };

        checkToken();
    }, []);

    if (loading) {
        return <View><ActivityIndicator size="large" /></View>;
    }

    return <AppNavigator userRole={userRole} isAuthenticated={isAuthenticated} />;
};

export default App;
