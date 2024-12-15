import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../services/api'; // Use the axios instance

const AskQuestionScreen = ({ navigation }) => {
    const [questionText, setQuestionText] = useState('');

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // This function will be called when the screen is focused
        });

        return unsubscribe; // Clean up the subscription on unmount
    }, [navigation]);

    const handleSubmit = async () => {
        try {
            await api.post('/questions/ask', { questionText });
            Alert.alert('Success', 'Your question has been submitted.');
            navigation.goBack(); // Go back to the previous screen
        } catch (error) {
            console.error('Failed to submit question:', error.response ? error.response.data : error.message);
            Alert.alert('Error', 'Failed to submit your question. Please try again.');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Ask a Question</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your question here..."
                    placeholderTextColor="#B0B0B0"
                    value={questionText}
                    onChangeText={(text) => setQuestionText(text)}
                    multiline
                />
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F9F4', // Soft green background
    },
    innerContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#ffffff', // White background for the form
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 5, // Shadow for elevation
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#005D34', // Dark green text color
        fontFamily: 'Amiri', // Assuming this is the same font used in ProfileScreen
    },
    input: {
        height: 150,
        borderColor: '#009688', // Teal border for Islamic theme
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#F0F8F0', // Light green background for input
        color: '#333',
        textAlignVertical: 'top', // Ensures text starts at the top of the TextInput
        fontFamily: 'Amiri', // Assuming this is the same font used in ProfileScreen
    },
    submitButton: {
        backgroundColor: '#004D40', // Darker green for the button
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Amiri', // Assuming this is the same font used in ProfileScreen
    },
});

export default AskQuestionScreen;
