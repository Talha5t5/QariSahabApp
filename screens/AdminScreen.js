import React, { useCallback, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../services/api';
import striptags from 'striptags';

const AdminScreen = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Pending Questions',
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout}>
          <Icon name="log-out-outline" size={25} style={{ marginRight: 15 }} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      fetchPendingQuestions();
    }, [])
  );

  const fetchPendingQuestions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/questions?status=Pending');
      setQuestions(response.data);
      setFilteredQuestions(response.data);
    } catch (error) {
      console.error('Failed to fetch questions:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to fetch questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
    if (text === '') {
      setFilteredQuestions(questions);
    } else {
      const filtered = questions.filter((question) =>
        striptags(question.questionText.toLowerCase()).includes(text.toLowerCase())
      );
      setFilteredQuestions(filtered);
    }
  };

  const handleAnswerQuestion = (questionId) => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to answer this question?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => navigation.navigate('AnswerQuestionScreen', { questionId }),
        },
      ]
    );
  };

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

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search questions..."
        value={searchTerm}
        onChangeText={handleSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#388E3C" />
      ) : filteredQuestions.length === 0 ? (
        <View style={styles.messageContainer}>
          <Text style={styles.noQuestionsText}>No questions left to answer.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredQuestions}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => {
            const questionText = striptags(item.questionText || "");
            const truncatedQuestion = questionText.length > 100 ? `${questionText.substring(0, 100)}...` : questionText;
          
            return (
              <View style={styles.questionItem}>
                 <Text style={styles.questionText}>Question {index + 1}: {striptags(item.questionText).substring(0, 100)}...</Text>
                <Text style={styles.categoryText}>Category: {item.category || 'Uncategorized'}</Text>
                <Text style={styles.userText}>Asked by: {item.user?.name || 'Unknown'}</Text>
                <Text style={styles.dateText}>Date: {new Date(item.createdAt).toLocaleDateString()}</Text>
                <TouchableOpacity style={styles.button} onPress={() => handleAnswerQuestion(item._id)}>
                  <Text style={styles.buttonText}>Answer Question</Text>
                </TouchableOpacity>
              </View>
            );
          }}
          
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#E8F5E9',
  },
  searchInput: {
    height: 40,
    borderColor: '#1B5E20',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
    marginBottom: 12,
  },
  messageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  noQuestionsText: {
    fontSize: 16,
    color: '#2E7D32',
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
    color: '#2E7D32',
  },
  categoryText: {
    fontSize: 14,
    color: '#388E3C',
  },
  userText: {
    fontSize: 12,
    color: '#004d40',
  },
  dateText: {
    fontSize: 12,
    color: '#616161',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#388E3C',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default AdminScreen;
