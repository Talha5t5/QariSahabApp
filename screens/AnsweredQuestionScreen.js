import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import api from '../services/api';
import striptags from 'striptags';
import RNPickerSelect from 'react-native-picker-select';

const AnsweredQuestionsScreen = ({ navigation }) => {
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnsweredQuestions();
    }, []);

    useEffect(() => {
        filterQuestions();
    }, [answeredQuestions, selectedCategory]);

    const fetchAnsweredQuestions = async () => {
        setLoading(true); // Start loading
        try {
            const response = await api.get('/questions/answered');
            setAnsweredQuestions(response.data);

            const uniqueCategories = [...new Set(response.data.map(question => question.category ? question.category.name : ''))]
                .filter(category => category)
                .map(category => ({ label: category, value: category }));

            setCategoryOptions(uniqueCategories);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch answered questions.');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const filterQuestions = () => {
        const filtered = selectedCategory === 'all'
            ? answeredQuestions
            : answeredQuestions.filter(q => q.category && q.category.name === selectedCategory);
        setFilteredQuestions(filtered);
    };

    const renderQuestionItem = ({ item, index }) => (
        <TouchableOpacity style={styles.questionItem} onPress={() => navigation.navigate('Answerfull', { question: item })}>
            <Text style={styles.questionText}>Question {index + 1}: {item.questionText}</Text>
            <Text style={styles.answerText}>Answer {index + 1}: {striptags(item.answerText).substring(0, 100)}...</Text>
            <Text style={styles.categoryText}>Category: {item.category?.name || 'No category'}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <RNPickerSelect
                onValueChange={setSelectedCategory}
                items={[{ label: 'All', value: 'all' }, ...categoryOptions]}
                style={pickerSelectStyles}
                placeholder={{ label: 'Select a category...', value: 'all' }}
            />
            {loading ? (
                <ActivityIndicator size="large" color="#00796b" style={styles.loader} />
            ) : (
                filteredQuestions.length === 0 ? (
                    <Text style={styles.noResultsText}>No questions found.</Text>
                ) : (
                    <FlatList
                        data={filteredQuestions}
                        keyExtractor={item => item._id}
                        renderItem={renderQuestionItem}
                        contentContainerStyle={styles.list}
                    />
                )
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#E8F5E9', // Light green
    },
    list: {
        paddingBottom: 16,
    },
    questionItem: {
        padding: 16,
        marginBottom: 10,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
    },
    questionText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#2E7D32', // Dark green
    },
    answerText: {
        fontSize: 14,
        color: '#388E3C', // Medium green
    },
    categoryText: {
        fontSize: 12,
        color: '#004d40',
        marginTop: 4,
    },
    noResultsText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#00796b',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

const pickerSelectStyles = {
    inputIOS: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#00796b',
        borderRadius: 8,
        backgroundColor: '#ffffff',
        marginBottom: 16,
        fontSize: 16,
    },
    inputAndroid: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#00796b',
        borderRadius: 8,
        backgroundColor: '#ffffff',
        marginBottom: 16,
        fontSize: 16,
    },
};

export default AnsweredQuestionsScreen;
