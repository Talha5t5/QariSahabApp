import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import api from '../services/api';

const AddCategoryScreen = ({ navigation }) => {
    const [newCategory, setNewCategory] = useState('');

    const handleAddCategory = async () => {
        if (!newCategory.trim()) {
            Alert.alert('Error', 'Category name cannot be empty.');
            return;
        }

        try {
            const response = await api.post('/categories', { name: newCategory });
            Alert.alert('Success', 'Category added successfully.');
            setNewCategory('');
            navigation.goBack(); // Go back after successful addition
        } catch (error) {
            console.error('Failed to add category:', error.response ? error.response.data : error.message);
            Alert.alert('Error', 'Failed to add category. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Enter new category"
                placeholderTextColor="#a9a9a9"
                value={newCategory}
                onChangeText={(text) => setNewCategory(text)}
            />
            <Button title="Add Category" onPress={handleAddCategory} color="#4CAF50" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        backgroundColor: '#F4F9F4',
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 8,
        marginBottom: 16,
    },
});

export default AddCategoryScreen;
