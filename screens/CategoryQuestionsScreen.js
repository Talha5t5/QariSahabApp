import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import api from '../services/api';

const CategoryQuestionsScreen = ({ route, navigation }) => {
  const { categoryId } = route.params; // Get the categoryId from route params
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchCategoryQuestions = async () => {
      try {
        // Fetch answered questions for the selected category
        const response = await api.get(`/questions/${categoryId}?answered=true`);
        console.log('Fetched Questions:', response.data); // Log fetched questions
        setQuestions(response.data);
      } catch (error) {
        console.error('Failed to fetch category questions:', error.response ? error.response.data : error.message);
        Alert.alert('Error', 'Failed to fetch questions. Please try again.');
      } finally {
        setLoading(false); // Stop loading after fetch completes
      }
    };

    fetchCategoryQuestions();
  }, [categoryId]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#004D40" style={styles.loader} />
      ) : questions.length === 0 ? (
        <Text style={styles.noQuestionsText}>No questions found in this category.</Text>
      ) : (
        <FlatList
          data={questions}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.questionItem}>
              <Text style={styles.questionText}>{item.questionText}</Text>
              <TouchableOpacity
                style={styles.answerButton}
                onPress={() => navigation.navigate('AnswerDetails', { questionId: item._id })}
              >
                <Text style={styles.answerButtonText}>View Answer</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F4F9F4',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noQuestionsText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#6c757d',
    marginTop: 20,
  },
  questionItem: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  questionText: {
    fontSize: 16,
    color: '#333333',
  },
  answerButton: {
    backgroundColor: '#004D40',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  answerButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default CategoryQuestionsScreen;
