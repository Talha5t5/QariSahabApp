import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import striptags from 'striptags';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api'; // Import your API service

const AnswerDetailScreen = ({ route, navigation }) => {
    const { question } = route.params; // Retrieve the passed question details
    const [userRole, setUserRole] = useState(null); // State for user role

    const imageUrl = question.imagePath ? `https://quranappbackend.websol.cloud/${question.imagePath.replace(/\\/g, '/')}` : null;

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    Alert.alert('Error', 'You need to log in to access this page.');
                    return;
                }

                // Fetch user info including the role from the API
                const response = await api.get('/users/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Assuming the response contains the user role
                setUserRole(response.data.role); // Adjust this according to your backend response
            } catch (error) {
                Alert.alert('Error', 'Failed to fetch user role.');
            }
        };

        fetchUserRole();
    }, []);

    // Function to handle edit action
    const handleEdit = () => {
        navigation.navigate('EditAnswer', { question });
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.questionText}>Question</Text>
            <Text style={styles.questionDetailText}>{question.questionText}</Text>

            <Text style={styles.answerText}>Answer</Text>
            <Text style={styles.answerDetailText}>
                {striptags(question.answerText)} {/* Show full answer */}
            </Text>

            {imageUrl && (
                <Image 
                    source={{ uri: imageUrl }} 
                    style={styles.image} 
                    resizeMode="cover" 
                />
            )}
            <Text style={styles.categoryText}>
                Category: {question.category && question.category.name ? question.category.name : 'No category'}
            </Text>

            {/* Conditional rendering of the edit button */}
            {userRole === 'admin' && (
                <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                    <Text style={styles.editButtonText}>Edit Answer</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f4f9f4',
        paddingBottom: 100, // Increase padding at the bottom for better spacing
    },
    questionText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#004d40',
    },
    questionDetailText: {
        fontSize: 18,
        marginBottom: 16,
        lineHeight: 24,
        color: '#424242',
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#e0f2f1', // Light background for better visibility
    },
    answerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#2e7d32',
    },
    answerDetailText: {
        fontSize: 16,
        marginBottom: 16,
        lineHeight: 22,
        color: '#424242',
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#e0f2f1', // Light background for better visibility
    },
    categoryText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#00796b',
        marginBottom: 12,
    },
    image: {
        width: '100%',   
        height: 300,    
        borderRadius: 8,
        marginTop: 12,
        borderColor: '#cfd8dc',
        borderWidth: 1, // Add border for image
        backgroundColor: '#f0f0f0', // Placeholder color
    },
    editButton: {
        backgroundColor: '#00796b',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 24, // Increased margin below the button
    },
    editButtonText: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default AnswerDetailScreen;
