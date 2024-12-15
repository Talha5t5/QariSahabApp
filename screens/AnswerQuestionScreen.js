import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Button,
    StyleSheet,
    Alert,
    ScrollView,
    Image,
    TouchableOpacity,
    Text,
    Modal,
    TextInput,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import api from '../services/api';
import striptags from 'striptags';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

const AnswerQuestionScreen = ({ route, navigation }) => {
    const { questionId } = route.params;
    const [questionText, setQuestionText] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [open, setOpen] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const richText = useRef();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                setCategories(response.data.map((category) => ({
                    label: category.name,
                    value: category._id,
                })));
            } catch (error) {
                console.error('Failed to fetch categories:', error.message);
                Alert.alert('Error', 'Failed to fetch categories. Please try again.');
            }
        };

        const fetchQuestionDetails = async () => {
            try {
                const response = await api.get(`/questions/details/${questionId}`);
                setQuestionText(response.data.questionText);
            } catch (error) {
                console.error('Failed to fetch question:', error.message);
                Alert.alert('Error', 'Failed to fetch question. Please try again.');
            }
        };

        fetchCategories();
        fetchQuestionDetails();
    }, [questionId]);

    const handleSubmit = async () => {
        const answerText = await richText.current.getContentHtml();
        const plainTextAnswer = striptags(answerText);

        if (!selectedCategory) {
            Alert.alert('Error', 'Please select a category.');
            return;
        }

        const formData = new FormData();
        formData.append('answerText', plainTextAnswer);
        formData.append('category', selectedCategory);

        if (selectedImage) {
            formData.append('image', {
                uri: selectedImage.uri,
                type: selectedImage.type,
                name: selectedImage.fileName,
            });
        }

        try {
            await api.put(`/questions/answere/${questionId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Alert.alert('Success', 'Answer submitted successfully.');
            navigation.goBack();
        } catch (error) {
            console.error('Failed to submit the answer:', error.message);
            Alert.alert('Error', 'Failed to submit the answer. Please try again.');
        }
    };

    const handleImagePick = async () => {
        launchImageLibrary({}, (response) => {
            if (response.assets && response.assets.length > 0) {
                const image = response.assets[0];
                if (image.fileSize > 50 * 1024 * 1024) {
                    Alert.alert('Error', 'The selected image exceeds the 25MB size limit.');
                    return;
                }
                setSelectedImage({
                    uri: image.uri,
                    type: image.type,
                    fileName: image.fileName,
                });
            }
        });
    };

    const handleAddCategory = async () => {
        if (!newCategory.trim()) {
            Alert.alert('Error', 'Category name cannot be empty.');
            return;
        }

        try {
            const response = await api.post('/categories', { name: newCategory });
            setCategories([...categories, { label: response.data.category.name, value: response.data.category._id }]);
            setNewCategory('');
            setModalVisible(false);
            Alert.alert('Success', 'Category added successfully.');
        } catch (error) {
            console.error('Failed to add category:', error.message);
            Alert.alert('Error', 'Failed to add category. Please try again.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.innerContainer} keyboardShouldPersistTaps="handled">
            {/* Display the question at the top */}
            <Text style={styles.questionText}>Question:</Text>
            <Text style={styles.questionTextBold}>{questionText}</Text>

            <RichEditor
                ref={richText}
                style={styles.editor}
                placeholder="Enter your answer here..."
                initialHeight={150}
            />
            <RichToolbar
                editor={richText}
                actions={[
                    actions.setBold,
                    actions.setItalic,
                    actions.setUnderline,
                    actions.insertLink,
                    actions.insertImage,
                ]}
                onPressAddImage={handleImagePick}
            />

            <View style={styles.dropdownWrapper}>
                <DropDownPicker
                    open={open}
                    value={selectedCategory}
                    items={categories}
                    setOpen={setOpen}
                    setValue={setSelectedCategory}
                    setItems={setCategories}
                    placeholder="Select a category..."
                    containerStyle={styles.dropdownContainer}
                    dropDownContainerStyle={styles.dropdownScroll}
                    listMode="SCROLLVIEW"
                />
                <TouchableOpacity
                    style={styles.addCategoryButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.addCategoryButtonText}>+</Text>
                </TouchableOpacity>
            </View>

            {selectedImage && (
                <Image
                    source={{ uri: selectedImage.uri }}
                    style={styles.imagePreview}
                />
            )}

            <Button title="Submit Answer" onPress={handleSubmit} color="#2E8B57" />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Category</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter new category"
                            placeholderTextColor="#a9a9a9"
                            value={newCategory}
                            onChangeText={setNewCategory}
                        />
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity onPress={handleAddCategory} style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>Add Category</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    innerContainer: {
        padding: 16,
        backgroundColor: '#f7f7f7', // Change to your desired background color
    },
    questionText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 5,
    },
    questionTextBold: {
        fontSize: 18,
        color: '#555',
        marginBottom: 10,
    },
    editor: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#fff',
        marginBottom: 16,
    },
    dropdownWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    dropdownContainer: {
        flex: 1,
    },
    dropdownScroll: {
        maxHeight: 200,
    },
    addCategoryButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 80,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    addCategoryButtonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        lineHeight: 24,
    },
    imagePreview: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        color: '#333',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
        flex: 1,
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default AnswerQuestionScreen;
