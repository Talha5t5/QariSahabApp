import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Image } from 'react-native';
import api from '../services/api'; // Import your API configuration
import RenderHTML from 'react-native-render-html'; // Import the HTML rendering library
import CustomImage from '../CustomImage'; // Custom image renderer

const AnswerDetailsScreen = ({ route }) => {
    const { questionId } = route.params; // Get the questionId from route params
    const [answer, setAnswer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnswer = async () => {
            try {
                const response = await api.get(`/questions/answer/${questionId}`); // Fetch the answer
                setAnswer(response.data);
            } catch (error) {
                console.error('Failed to fetch answer:', error.response ? error.response.data : error.message);
                Alert.alert('Error', 'Failed to fetch answer. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchAnswer();
    }, [questionId]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    // Construct the image URL if available
    const imageUrl = answer?.imagePath ? `https://quranappbackend.websol.cloud/${answer.imagePath.replace(/\\/g, '/')}` : null;

    return (
        <View style={styles.container}>
            {answer ? (
                <View style={styles.answerContainer}>
                    <Text style={styles.questionText}>Question:</Text>
                    <Text style={styles.answerText}>{answer.questionText || 'No question text provided.'}</Text>

                    <Text style={styles.questionText}>Answer:</Text>
                    {/* Render HTML for the answer text */}
                    <RenderHTML
                        contentWidth={300}
                        source={{ html: answer.answerText || 'No answer provided.' }}
                        renderers={{
                            img: (htmlAttribs, children, convertedCSSStyles, passProps) => {
                                const imageSrc = htmlAttribs.src ? htmlAttribs.src : null;

                                // Check if the src attribute exists and is valid
                                if (!imageSrc) {
                                    return null; // Skip rendering if src is invalid
                                }

                                return (
                                    <CustomImage 
                                        source={{ uri: imageSrc }} 
                                        {...passProps} 
                                        style={styles.renderedImage} // Optional: Custom styles for the rendered image
                                    />
                                );
                            },
                        }}
                    />

                    {/* Render the image below the answer text, if available */}
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
                </View>
            ) : (
                <Text>No answer found.</Text>
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
    answerContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 16,
        elevation: 2,
    },
    questionText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    answerText: {
        fontSize: 16,
        color: '#333333',
        marginBottom: 10, // Add space between answer text and image
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginTop: 20, // Add space between the image and answer content
    },
    noImageText: {
        color: '#999',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 20, // Add space before the "No image available" text
    },
    renderedImage: {
        width: '100%',   // Optional styling for rendered HTML images
        height: 200,
        borderRadius: 8,
        marginTop: 10,   // Add space between HTML content and the image
    },
});

export default AnswerDetailsScreen;
