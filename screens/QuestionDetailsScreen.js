import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Image, ScrollView, TouchableOpacity } from 'react-native';
import api from '../services/api'; 
import RenderHTML from 'react-native-render-html'; 
import CustomImage from '../CustomImage'; 

const QuestionDetailScreen = ({ route, navigation }) => {
    const { questionId } = route.params; 
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await api.get(`/questions/details/${questionId}`); 
                setQuestion(response.data);
            } catch (error) {
                console.error('Failed to fetch question:', error.response ? error.response.data : error.message);
                Alert.alert('Error', 'Failed to fetch question. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [questionId]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#004d40" />
            </View>
        );
    }

    const imageUrl = question?.imagePath ? `https://quranappbackend.websol.cloud/${question.imagePath.replace(/\\/g, '/')}` : null;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {question ? (
                <View style={styles.answerContainer}>
                    <Text style={styles.title}>{question.questionText}</Text>
                    <Text style={styles.statusText}>Status: {question.status}</Text>

                    <Text style={styles.questionText}>Answer:</Text>
                    <RenderHTML
                        contentWidth={300}
                        source={{ html: question.answerText || 'No answer provided.' }}
                        renderers={{
                            img: (htmlAttribs, children, convertedCSSStyles, passProps) => {
                                const imageSrc = htmlAttribs.src ? htmlAttribs.src : null;

                                if (!imageSrc) {
                                    return null;
                                }

                                return (
                                    <CustomImage 
                                        source={{ uri: imageSrc }} 
                                        {...passProps} 
                                        style={styles.renderedImage} 
                                    />
                                );
                            },
                        }}
                    />

                    {imageUrl ? (
                        <Image
                            source={{ uri: imageUrl }}
                            style={styles.image}
                            resizeMode="cover"
                            onError={() => Alert.alert('Error', 'Failed to load image.')}
                        />
                    ) : (
                        <Text style={styles.noImageText}>No image available.</Text>
                    )}

                    {question.category && (
                        <View style={styles.categoryContainer}>
                            <Text style={styles.categoryText}>
                                Category: <Text style={styles.categoryName}>{question.category.name}</Text>
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity style={styles.backButtonContainer} onPress={() => navigation.goBack()}>
                        <Text style={styles.backButton}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <Text>No question data found.</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f4f4f4',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f4f4',
    },
    answerContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#004d40',
        marginBottom: 12,
        fontFamily: 'Amiri',
        textAlign: 'center',
    },
    statusText: {
        fontSize: 16,
        color: '#00796b',
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
        fontFamily: 'Amiri',
    },
    questionText: {
        fontSize: 18,
        color: '#004d40',
        fontWeight: '500',
        marginBottom: 10,
        fontFamily: 'Amiri',
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 12,
        marginVertical: 16,
    },
    noImageText: {
        fontSize: 16,
        color: '#b71c1c',
        textAlign: 'center',
        fontFamily: 'Amiri',
    },
    categoryContainer: {
        marginTop: 20,
        backgroundColor: '#e0f2f1',
        padding: 10,
        borderRadius: 8,
    },
    categoryText: {
        fontSize: 16,
        color: '#004d40',
        fontFamily: 'Amiri',
    },
    categoryName: {
        fontWeight: 'bold',
    },
    backButtonContainer: {
        backgroundColor: '#004d40',
        padding: 12,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    backButton: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Amiri',
    },
    renderedImage: {
        width: 200,
        height: 150,
        marginBottom: 10,
        borderRadius: 8,
    },
});

export default QuestionDetailScreen;
