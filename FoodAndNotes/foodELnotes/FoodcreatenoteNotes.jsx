import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, Animated, Easing, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchImageLibrary } from "react-native-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState, useEffect, useRef } from "react";
import { cmnstyle, createForm, texts } from "../foodcnsts/appstyles";
import { backButton, plusButton, profilecameraInfo, smallPlusButton, trashButton } from "../foodcnsts/appassts";

const FoodcreatenoteNotes = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { note: existingNote } = route.params || {};
    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;
    const subtaskAnimations = useRef([]);

    const [title, setTitle] = useState(existingNote?.title || '');
    const [image, setImage] = useState(existingNote?.image || null);
    const [subtasks, setSubtasks] = useState(
        existingNote?.subtasks?.length > 0 
            ? existingNote.subtasks 
            : [{ completed: false, task: '' }]
    );
    const [topic, setTopic] = useState(existingNote?.topic || '');
    const [colorTheme, setColorTheme] = useState(existingNote?.colorTheme || '#FF00F0');
    const [description, setDescription] = useState(existingNote?.description || '');

    useEffect(() => {
        subtaskAnimations.current = subtasks.map(() => new Animated.Value(0));
        
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            })
        ]).start();

        Animated.stagger(100, 
            subtaskAnimations.current.map(anim => 
                Animated.spring(anim, {
                    toValue: 1,
                    friction: 5,
                    useNativeDriver: true,
                })
            )
        ).start();
    }, []);

    const handleAddSubtask = () => {
        const newSubtasks = [...subtasks, { completed: false, task: '' }];
        setSubtasks(newSubtasks);
        
        const newAnim = new Animated.Value(0);
        subtaskAnimations.current.push(newAnim);
        Animated.spring(newAnim, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
        }).start();
    };

    const handleDeleteSubtask = (index) => {
        if (subtasks.length <= 1) return;
        
        Alert.alert(
            'Delete Subtask',
            'Are you sure you want to delete this subtask?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Delete', 
                    onPress: () => {
                        const newSubtasks = [...subtasks];
                        newSubtasks.splice(index, 1);
                        setSubtasks(newSubtasks);
                        subtaskAnimations.current.splice(index, 1);
                    } 
                }
            ]
        );
    };

    const handleUpdateSubtask = (index, field, value) => {
        const newSubtasks = [...subtasks];
        newSubtasks[index][field] = value;
        setSubtasks(newSubtasks);
    };

    const handleToggleComplete = (index) => {
        const newSubtasks = [...subtasks];
        newSubtasks[index].completed = !newSubtasks[index].completed;
        setSubtasks(newSubtasks);
    };

    const uploadImage = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: 0.8,
            });
            if (!result.didCancel && result.assets?.[0]?.uri) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Image picker error:', error);
        }
    };

    const saveNoteToStorage = async () => {

        const hasContent = 
            title.trim() || 
            image || 
            topic.trim() || 
            subtasks.some(st => st.task.trim()) || 
            description.trim();
        
        if (!hasContent) {
            Alert.alert(
                'Empty Note', 
                'Please fill at least one field (title, image, topic, subtask, or description)'
            );
            return;
        }

        Animated.sequence([
            Animated.timing(buttonScale, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.spring(buttonScale, {
                toValue: 1.1,
                friction: 5,
                useNativeDriver: true,
            })
        ]).start();

        try {
            const noteData = {
                id: existingNote?.id || Date.now(),
                title: title.trim(),
                image,
                subtasks: subtasks.filter(st => st.task.trim()),
                topic: topic.trim(),
                colorTheme,
                description: description.trim(),
                createdAt: existingNote?.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const savedNotes = await AsyncStorage.getItem('MY_NOTES');
            let allNotes = savedNotes ? JSON.parse(savedNotes) : [];
            
            if (existingNote) {
                allNotes = allNotes.map(note => 
                    note.id === existingNote.id ? noteData : note
                );
            } else {
                allNotes = [...allNotes, noteData];
            }

            await AsyncStorage.setItem('MY_NOTES', JSON.stringify(allNotes));
            
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: -30,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start(() => {
                navigation.navigate('FoodnotesNotesEL');
            });
            
        } catch (error) {
            console.error('Error saving note:', error);
            Alert.alert('Error', 'Failed to save note');
        }
    };

    return (
        <Animated.View style={[cmnstyle.container, { opacity: fadeAnim }]}>

            <View style={[cmnstyle.row, { marginBottom: 20, width: '100%', justifyContent: 'space-between' }]}>
                <View style={cmnstyle.row}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    >
                        <Image source={backButton} style={cmnstyle.backIcon} />
                    </TouchableOpacity>
                    <Animated.Text style={[
                        texts.bigTitle,
                        {
                            marginLeft: 10,
                            transform: [{ translateX: slideAnim }]
                        }
                    ]}>
                        {existingNote ? 'Edit note' : 'Create note'}
                    </Animated.Text>
                </View>
                
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <TouchableOpacity onPress={saveNoteToStorage}>
                        <Text style={[texts.label, { color: '#FF00F0', marginBottom: 0, fontSize: 16 }]}>
                            Done
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>

            <ScrollView style={{ width: '100%' }}>
                <Animated.View
                    style={[
                        createForm.categoryButton,
                        {
                            transform: [{ translateX: slideAnim }],
                            paddingVertical: 28.5,
                            paddingHorizontal: 15,
                            marginBottom: 24,
                            borderRadius: 23
                        }
                    ]}>
                    <TextInput
                        style={createForm.noteInput}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Enter the text"
                        placeholderTextColor={'#696969'}
                    />
                </Animated.View>

                <TouchableOpacity
                    onPress={uploadImage}
                    style={[createForm.uploadButton, {width: 110, height: 85, borderRadius: 15, marginBottom: 24}]}
                >
                    <Image
                        source={image ? { uri: image } : profilecameraInfo}
                        style={
                            image ? { width: '100%', height: '100%', resizeMode: 'cover' }
                                : {width: 49, height: 49, resizeMode: 'contain'}
                        }
                    />
                    <View style={{position: 'absolute', top: 2, right: 2, zIndex: 10}}>
                        <Image source={smallPlusButton} style={{width: 32, height: 32, resizeMode: 'contain'}} />
                    </View>
                </TouchableOpacity>

                <Text style={createForm.noteLabel}>Subtasks</Text>
                {subtasks.map((item, idx) => (
                    <Animated.View 
                        key={idx}
                        style={{
                            opacity: subtaskAnimations.current[idx] || 1,
                            transform: [{
                                translateY: (subtaskAnimations.current[idx] || new Animated.Value(0)).interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [20, 0],
                                })
                            }],
                            width: '100%',
                            marginBottom: 20
                        }}
                    >
                        <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                            <TouchableOpacity onPress={() => handleToggleComplete(idx)}>
                                <View style={{
                                    width: 20,
                                    height: 20,
                                    borderWidth: 2,
                                    borderColor: '#696969',
                                    backgroundColor: item.completed ? '#FF00F0' : 'transparent',
                                    marginRight: 15
                                }} />
                            </TouchableOpacity>
                            <TextInput
                                style={[createForm.noteInput, {marginBottom: 10}]}
                                value={item.task}
                                onChangeText={(text) => handleUpdateSubtask(idx, 'task', text)}
                                placeholder="Enter subtask"
                                placeholderTextColor={'#696969'}
                            />
                            <TouchableOpacity onPress={() => handleDeleteSubtask(idx)}>
                                <Image source={trashButton} style={{width: 25, height: 32, resizeMode: 'contain'}} />
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                ))}

                <TouchableOpacity
                    onPress={handleAddSubtask}
                    style={[cmnstyle.bigButton, { marginBottom: 24 }]}
                >
                    <Text style={cmnstyle.bigButtonText}>Add</Text>
                    <View style={{ position: 'absolute', top: 5, right: 5 }}>
                        <Image source={plusButton} style={cmnstyle.arrowButton} />
                    </View>
                </TouchableOpacity>

                <Text style={createForm.noteLabel}>Topic</Text>
                <TextInput
                    style={[createForm.noteInput, {marginBottom: 24}]}
                    value={topic}
                    onChangeText={setTopic}
                    placeholder="Enter topic"
                    placeholderTextColor={'#696969'}
                />

                <Text style={createForm.noteLabel}>The color of the note</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24}}>
                    {['#FF00F0', '#9747FF', '#00117C', '#303030'].map((color, idx) => (
                        <TouchableOpacity
                            key={idx}
                            onPress={() => setColorTheme(color)}
                        >
                            <View style={{
                                width: 35,
                                height: 35,
                                borderRadius: 100,
                                backgroundColor: color,
                                borderWidth: colorTheme === color ? 2 : 0,
                                borderColor: '#fff'
                            }} />
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={createForm.noteLabel}>Description</Text>
                <TextInput
                    style={createForm.noteInput}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Enter description"
                    placeholderTextColor={'#696969'}
                    multiline
                    numberOfLines={4}
                />

                <View style={{height: 100}} />
            </ScrollView>
        </Animated.View>
    )
};

export default FoodcreatenoteNotes;