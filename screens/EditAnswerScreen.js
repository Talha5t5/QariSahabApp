import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, TextInput } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DocumentPicker from 'react-native-document-picker';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from 'html-entities';

const EditAnswerScreen = ({ route, navigation }) => {
    const { question } = route.params;
    const [category, setCategory] = useState(question.category ? question.category._id : null);
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [photo, setPhoto] = useState(question.imagePath || null);
    const [answerText, setAnswerText] = useState(question.answerText); // Initial answer text

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load categories.');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handlePhotoUpload = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
            });
            setPhoto(res[0]);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled photo upload');
            } else {
                Alert.alert('Error', 'Failed to pick the image.');
            }
        }
    };

    const handleSave = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'Token not found, please login again.');
                return;
            }

            const formData = new FormData();
            formData.append('answerText', answerText);
            formData.append('category', category);

            // Include photo if uploaded
            if (photo && typeof photo !== 'string') {
                formData.append('image', {
                    uri: photo.uri,
                    name: photo.name,
                    type: photo.type,
                });
            }

            // Change the endpoint to match your route
            const response = await api.put(`questions/answers/${question._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            Alert.alert('Success', 'Answer updated successfully!');
            navigation.goBack();
        } catch (error) {
            console.log('Error Response:', error.response?.data || error.message);
            Alert.alert('Error', 'Failed to update the answer.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Edit Answer</Text>

            {/* Simple TextInput for editing text */}
            <TextInput
                style={styles.textInput}
                multiline
                value={answerText}
                onChangeText={setAnswerText}
                placeholder="Enter your answer here..."
            />

            <Text style={styles.label}>Category</Text>
            <DropDownPicker
                open={open}
                value={category}
                items={categories.map(c => ({ label: c.name, value: c._id }))}
                setValue={setCategory}
                setOpen={setOpen}
                placeholder="Select a category"
            />

            <Text style={styles.label}>Upload Photo</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={handlePhotoUpload}>
                <Text style={styles.buttonText}>Choose Photo</Text>
            </TouchableOpacity>
            {photo && (
                <Image
                    source={{ uri: typeof photo === 'string' ? `https://quranappbackend.websol.cloud/${photo.replace(/\\/g, '/')}` : photo.uri }}
                    style={styles.imagePreview}
                />
            )}

            <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Update Answer</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f4f9f4',
    },
    label: {
        fontSize: 18,
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 16,
        minHeight: 200,
        padding: 10,
        backgroundColor: '#fff',
    },
    uploadButton: {
        backgroundColor: '#00796b',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#00796b',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    imagePreview: {
        width: 100,
        height: 100,
        marginTop: 10,
        marginBottom: 20,
        borderRadius: 8,
    },
});

export default EditAnswerScreen;
