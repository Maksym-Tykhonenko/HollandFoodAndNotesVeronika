import { View, Text, Image, TouchableOpacity, ScrollView, Animated, Easing } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { useState, useEffect, useRef } from "react";
import { cmnstyle, foodcard, texts } from "../foodcnsts/appstyles";
import { nothingeggInfo, plusButton } from "../foodcnsts/appassts";

const FoodnotesNotes = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [myNotesStorage, setMyNotesStorage] = useState([]);
    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideUpAnim = useRef(new Animated.Value(30)).current;
    const cardAnimations = useRef([]);
    const addButtonAnim = useRef(new Animated.Value(0)).current;

    const loadNotes = async () => {
        try {
            const storedNotes = await AsyncStorage.getItem('MY_NOTES');
            if (storedNotes) {
                const parsedNotes = JSON.parse(storedNotes);
                setMyNotesStorage(Array.isArray(parsedNotes) ? parsedNotes : []);
                
                cardAnimations.current = parsedNotes.map(() => ({
                    scale: new Animated.Value(0.8),
                    opacity: new Animated.Value(0),
                    translateY: new Animated.Value(20)
                }));
            }
        } catch (error) {
            console.error('Failed to load notes', error);
        }
    };

    useEffect(() => {
        if (isFocused) {
            loadNotes();
            
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(slideUpAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                })
            ]).start();

            Animated.loop(
                Animated.sequence([
                    Animated.timing(addButtonAnim, {
                        toValue: 1,
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(addButtonAnim, {
                        toValue: 0,
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    })
                ])
            ).start();
        } else {
            fadeAnim.setValue(0);
            slideUpAnim.setValue(30);
            addButtonAnim.setValue(0);
        }
    }, [isFocused]);

    useEffect(() => {
        if (myNotesStorage.length > 0) {
            Animated.stagger(150, 
                cardAnimations.current.map((anim, index) => 
                    Animated.parallel([
                        Animated.spring(anim.translateY, {
                            toValue: 0,
                            friction: 6,
                            useNativeDriver: true,
                        }),
                        Animated.spring(anim.scale, {
                            toValue: 1,
                            friction: 3,
                            useNativeDriver: true,
                        }),
                        Animated.timing(anim.opacity, {
                            toValue: 1,
                            duration: 300,
                            useNativeDriver: true,
                        })
                    ])
                )
            ).start();
        }
    }, [myNotesStorage]);

    const handleToggleComplete = async (noteIndex, taskIndex) => {
        try {
            const updatedNotes = [...myNotesStorage];
            updatedNotes[noteIndex].subtasks[taskIndex].completed = 
                !updatedNotes[noteIndex].subtasks[taskIndex].completed;
            
            await AsyncStorage.setItem('MY_NOTES', JSON.stringify(updatedNotes));
            setMyNotesStorage(updatedNotes);
            
            const anim = cardAnimations.current[noteIndex];
            if (anim) {
                Animated.sequence([
                    Animated.timing(anim.scale, {
                        toValue: 1.05,
                        duration: 100,
                        useNativeDriver: true,
                    }),
                    Animated.spring(anim.scale, {
                        toValue: 1,
                        friction: 3,
                        useNativeDriver: true,
                    })
                ]).start();
            }
        } catch (error) {
            console.error('Error toggling task:', error);
        }
    };

    return (
        <Animated.View style={[cmnstyle.container, { opacity: fadeAnim }]}>

            <Animated.Text style={[
                texts.label,
                {
                    fontSize: 21,
                    marginBottom: 24,
                    transform: [{ translateY: slideUpAnim }]
                }
            ]}>
                Notes
            </Animated.Text>

            {myNotesStorage.length > 0 ? (
                <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
                    {myNotesStorage.map((note, noteIdx) => {
                        const anim = cardAnimations.current[noteIdx] || {
                            scale: new Animated.Value(1),
                            opacity: new Animated.Value(1),
                            translateY: new Animated.Value(0)
                        };
                        
                        return (
                            <Animated.View
                                key={note.id}
                                style={{
                                    opacity: anim.opacity,
                                    transform: [
                                        { translateY: anim.translateY },
                                        { scale: anim.scale }
                                    ],
                                    width: '100%',
                                    marginBottom: 12
                                }}
                            >
                                <TouchableOpacity
                                    style={[
                                        foodcard.container,
                                        {
                                            backgroundColor: note.colorTheme,
                                            paddingHorizontal: 10,
                                            paddingVertical: 15,
                                            shadowColor: "#000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 2,
                                            },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 3.84,
                                            elevation: 5,
                                        }
                                    ]}
                                    onPress={() => navigation.navigate('FoodcreatenoteNotesEL', { note })}
                                    activeOpacity={0.9}
                                >
                                    {note.image && (
                                        <Image 
                                            source={{uri: note.image}} 
                                            style={{
                                                width: 150, 
                                                height: 120, 
                                                resizeMode: 'cover', 
                                                borderRadius: 15, 
                                                marginBottom: 15,
                                            }} 
                                        />
                                    )}
                                    <Text style={foodcard.title}>{note.title}</Text>
                                    {note.subtasks.map((task, taskIdx) => (
                                        <View key={taskIdx} style={[cmnstyle.row, {marginBottom: 7}]}>
                                            <TouchableOpacity 
                                                onPress={() => handleToggleComplete(noteIdx, taskIdx)}
                                                activeOpacity={0.6}
                                            >
                                                <View style={{
                                                    width: 20,
                                                    height: 20,
                                                    borderWidth: 2,
                                                    borderColor: '#fff',
                                                    backgroundColor: task.completed ? '#FF00F0' : 'transparent',
                                                    marginRight: 15,
                                                    borderRadius: 4
                                                }} />
                                            </TouchableOpacity>
                                            <Text style={[
                                                foodcard.types,
                                                task.completed && { 
                                                    textDecorationLine: 'line-through',
                                                    opacity: 0.7 
                                                }
                                            ]}>
                                                {task.task}
                                            </Text>
                                        </View>
                                    ))}
                                    {note.topic && <Text style={foodcard.title}>{note.topic}</Text>}
                                    {note.description && <Text style={foodcard.description}>{note.description}</Text>}
                                </TouchableOpacity>
                            </Animated.View>
                        );
                    })}

                    <Animated.View
                        style={{
                            transform: [
                                { 
                                    translateY: addButtonAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, -8]
                                    }) 
                                }
                            ]
                        }}
                    >
                        <TouchableOpacity
                            style={[
                                cmnstyle.bigButton, 
                                { 
                                    marginTop: 20,
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.23,
                                    shadowRadius: 2.62,
                                    elevation: 4,
                                }
                            ]}
                            onPress={() => navigation.navigate('FoodcreatenoteNotesEL')}
                            activeOpacity={0.7}
                        >
                            <Text style={cmnstyle.bigButtonText}>Add</Text>
                            <View style={{ position: 'absolute', top: 5, right: 5 }}>
                                <Image source={plusButton} style={cmnstyle.arrowButton} />
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                    
                    <View style={{ height: 200 }} />
                </ScrollView>
            ) : (
                <Animated.View 
                    style={{ 
                        width: '100%', 
                        alignItems: 'center',
                        opacity: fadeAnim,
                        transform: [{
                            translateY: fadeAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [20, 0],
                            })
                        }],
                    }}
                >
                    <Text style={[texts.bigTitle, { marginBottom: 20, textAlign: 'center' }]}>
                        You don't have any notes
                    </Text>
                    <Animated.Image
                        source={nothingeggInfo}
                        style={[
                            cmnstyle.noImage, 
                            { 
                                marginBottom: 20,
                                transform: [{
                                    rotate: addButtonAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['-5deg', '5deg']
                                    })
                                }]
                            }
                        ]}
                    />
                    <Animated.View
                        style={{
                            transform: [
                                { 
                                    translateY: addButtonAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, -8]
                                    }) 
                                }
                                ],
                            width: '100%'
                        }}
                    >
                        <TouchableOpacity
                            style={[
                                cmnstyle.bigButton,
                                {
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.23,
                                    shadowRadius: 2.62,
                                    elevation: 4,
                                }
                            ]}
                            onPress={() => navigation.navigate('FoodcreatenoteNotesEL')}
                            activeOpacity={0.7}
                        >
                            <Text style={cmnstyle.bigButtonText}>Add</Text>
                            <View style={{ position: 'absolute', top: 5, right: 5 }}>
                                <Image source={plusButton} style={cmnstyle.arrowButton} />
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>
            )}

        </Animated.View>
    )
};

export default FoodnotesNotes;