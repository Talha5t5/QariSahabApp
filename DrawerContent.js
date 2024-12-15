import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DrawerContent = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Menu</Text>
            <TouchableOpacity onPress={() => navigation.navigate('UserScreen')}>
                <Text style={styles.menuItem}>User Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('AdminScreen')}>
                <Text style={styles.menuItem}>Admin Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.menuItem}>Signup</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.menuItem}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    menuItem: {
        fontSize: 18,
        marginVertical: 10,
    },
});

export default DrawerContent;
