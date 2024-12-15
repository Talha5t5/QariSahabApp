import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api'; // Ensure this points to your API base URL
import { launchImageLibrary } from 'react-native-image-picker';

const ProfileScreen = ({ navigation }) => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
        profilePicture: null,
    });
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    Alert.alert('Error', 'Token not found, please login again.');
                    return;
                }

                const response = await api.get('/users/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const user = response.data || {};
                setUserData({
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    profilePicture: user.profilePicture || null,
                });
            } catch (error) {
                Alert.alert('Error', 'Failed to load user data.' + (error.response?.data.message || ''));
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Image picker logic
    const handleImagePicker = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.error('ImagePicker Error: ', response.error);
                Alert.alert('Error', 'Failed to pick image.');
            } else if (response.assets) {
                const newImageUri = response.assets[0].uri;

                // Check if the selected image size exceeds 5 MB
                const imageSize = response.assets[0].fileSize; // Get the file size in bytes
                if (imageSize > 5 * 1024 * 1024) { // Convert 5 MB to bytes
                    Alert.alert('Error', 'Image size exceeds 5 MB. Please select a smaller image.');
                    return;
                }

                setSelectedImage(newImageUri); // Set the selected image URI
            }
        });
    };

    const handleSave = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const formData = new FormData();
            formData.append('name', userData.name);
            formData.append('email', userData.email);
            formData.append('phone', userData.phone);

            // Check if a new image is selected for upload
            if (selectedImage && selectedImage !== userData.profilePicture) {
                formData.append('profilePicture', {
                    uri: selectedImage,
                    type: 'image/jpeg',
                    name: 'profile.jpg',
                });
            }

            const response = await api.put('/users/profile', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            Alert.alert('Success', 'Profile updated successfully!');

            // Update the userData after successful save
            const updatedUser = response.data.user;
            setUserData({
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                profilePicture: updatedUser.profilePicture,
            });
            setSelectedImage(null); // Reset selected image after saving
        } catch (error) {
            console.error('Update Error:', error);
            Alert.alert('Error', 'Failed to update profile. ' + (error.response?.data.message || ''));
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading profile...</Text>
            </View>
        );
    }

    const profileImageUrl = selectedImage || 
        (userData.profilePicture ? `https://quranappbackend.websol.cloud${userData.profilePicture}` : null);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <TouchableOpacity onPress={handleImagePicker}>
                {profileImageUrl ? (
                    <Image source={{ uri: profileImageUrl }} style={styles.image} />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Text style={styles.imagePlaceholderText}>Select Profile Picture</Text>
                    </View>
                )}
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={userData.name}
                onChangeText={(text) => setUserData({ ...userData, name: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={userData.email}
                onChangeText={(text) => setUserData({ ...userData, email: text })}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={userData.phone}
                onChangeText={(text) => setUserData({ ...userData, phone: text })}
                keyboardType="phone-pad"
            />
            <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Back</Text>
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
    backButton: {
        backgroundColor: '#cccccc',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#333',
        fontWeight: '600',
        fontSize: 16,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
        alignSelf: 'center',
    },
    imagePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        alignSelf: 'center',
    },
    imagePlaceholderText: {
        color: '#888888',
        fontSize: 14,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f4f4',
    },
});

export default ProfileScreen;
