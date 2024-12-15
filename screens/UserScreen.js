


import React, { useState, useCallback, useLayoutEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Animated, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import the icon
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserScreen = ({ navigation }) => {
    const [questions, setQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [fadeAnim] = useState(new Animated.Value(0));

    // Set the header title and add the logout icon in the top-right
    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Your Questions',
            headerRight: () => (
                <TouchableOpacity onPress={handleLogout}>
                    <Icon name="log-out-outline" size={25} color="#FF6347" style={{ marginRight: 15 }} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]); 
    
    const fetchUserQuestions = useCallback(async () => {
        try {
            const response = await api.get('/questions/users');
            setQuestions(response.data);
            setFilteredQuestions(response.data); // Initialize filtered questions
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch questions. Please try again.');
        }
    }, []);
    

    useFocusEffect(
        useCallback(() => {
            fetchUserQuestions();
        }, [fetchUserQuestions])
    );

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', onPress: () => navigation.navigate('Login') },
            ]
        );
    };

    const renderQuestionItem = ({ item, index }) => (
        <TouchableOpacity
            style={styles.questionItem}
            onPress={() => navigation.navigate('QuestionDetailScreen', { questionId: item._id })}>
            <Text style={styles.questionNumber}>{index + 1}. </Text>
            <View style={styles.questionTextWrapper}>
                <Text style={styles.questionText}>{item.questionText}</Text>
                <Text style={styles.statusText}>Status: {item.status}</Text>
            </View>
            {/* Removed the favorite icon and logic */}
        </TouchableOpacity>
    );

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query) {
            const filteredData = questions.filter((question) =>
                question.questionText.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredQuestions(filteredData);
        } else {
            setFilteredQuestions(questions);
        }
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search questions..."
                value={searchQuery}
                onChangeText={handleSearch}
            />
            {filteredQuestions.length > 0 ? (
                <FlatList
                    data={filteredQuestions}
                    keyExtractor={(item) => item._id}
                    renderItem={renderQuestionItem}
                    style={styles.questionsList}
                />
            ) : (
                <Text style={styles.noQuestionsText}>No questions to display.</Text>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8F5E9',
        padding: 20,
    },
    searchInput: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        borderColor: '#004d40',
        borderWidth: 1,
        marginTop: 16,
        fontFamily: 'Amiri',
    },
    questionItem: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 12,
        marginVertical: 10,
        borderColor: '#004d40',
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Align items to spread across the width
    },
    questionNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2E7D32',
        fontFamily: 'Amiri',
    },
    questionTextWrapper: {
        flex: 1,
        paddingLeft: 10,
    },
    questionText: {
        fontSize: 16,
        color: '#2E7D32',
        fontWeight: 'bold',
        fontFamily: 'Amiri',
    },
    statusText: {
        fontSize: 14,
        color: '#388E3C',
        marginTop: 5,
        fontFamily: 'Amiri',
    },
    noQuestionsText: {
        color: '#b71c1c',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        fontFamily: 'Amiri',
    },
});

export default UserScreen;
