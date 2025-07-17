import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, Animated, Easing, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect, useRef } from "react";
import { cmnstyle, createForm, texts } from "../foodcnsts/appstyles";
import { backButton, trashButton, plusButton } from "../foodcnsts/appassts";

const FoodcreatecaloriesNotes = ({ entry: existingEntry }) => {
    const navigation = useNavigation();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;

    const [entries, setEntries] = useState(
        existingEntry 
            ? [{
                id: existingEntry.id,
                dish_name: existingEntry.dish_name || '',
                dish_amount: existingEntry.dish_amount || '',
                dish_calories: existingEntry.dish_calories || ''
              }]
            : [{
                id: Date.now(),
                dish_name: '',
                dish_amount: '',
                dish_calories: ''
              }]
    );

    useEffect(() => {
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
    }, []);

    const handleUpdateEntry = (index, field, value) => {
        const updatedEntries = [...entries];
        updatedEntries[index][field] = value;
        setEntries(updatedEntries);
    };

    const handleDeleteEntry = (index) => {
        if (entries.length <= 1) return;
        
        Alert.alert(
            'Delete Entry',
            'Are you sure you want to delete this entry?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Delete', 
                    onPress: () => {
                        const newEntries = [...entries];
                        newEntries.splice(index, 1);
                        setEntries(newEntries);
                    } 
                }
            ]
        );
    };

    const handleCreateNewEntry = () => {
        setEntries([
            ...entries, 
            {
                id: Date.now(),
                dish_name: '',
                dish_amount: '',
                dish_calories: ''
            }
        ]);
    };

    const saveCaloriesNotes = async () => {
        const hasValidEntries = entries.some(entry => 
            entry.dish_name.trim() && 
            entry.dish_amount.trim() && 
            entry.dish_calories.trim()
        );
        
        if (!hasValidEntries) {
            Alert.alert('Missing Information', 'Please fill in at least one complete entry');
            return;
        }

        const validEntries = entries.filter(entry => 
            entry.dish_name.trim() && 
            entry.dish_amount.trim() && 
            entry.dish_calories.trim()
        );

        try {
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

            const savedCalories = await AsyncStorage.getItem('MY_CALORIES');
            let allEntries = savedCalories ? JSON.parse(savedCalories) : [];
            
            if (existingEntry) {
                allEntries = allEntries.map(item => 
                    item.id === existingEntry.id ? validEntries[0] : item
                );
            } else {
                allEntries = [...allEntries, ...validEntries];
            }

            await AsyncStorage.setItem('MY_CALORIES', JSON.stringify(allEntries));
            
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
                navigation.navigate('FoodcaloriesNotesEL');
            });
            
        } catch (error) {
            console.error('Error saving calories:', error);
            Alert.alert('Error', 'Failed to save calories');
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
                        {existingEntry ? 'Edit Entry' : 'Enter Calories'}
                    </Animated.Text>
                </View>
                
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <TouchableOpacity onPress={saveCaloriesNotes}>
                        <Text style={[texts.label, { color: '#FF00F0', marginBottom: 0, fontSize: 16 }]}>
                            Done
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>

            <ScrollView style={{ width: '100%' }}>
                {entries.map((entry, index) => (
                    <Animated.View 
                        key={entry.id}
                        style={[
                            createForm.categoryButton, 
                            { 
                                marginBottom: 16,
                                opacity: fadeAnim,
                                transform: [{
                                    translateX: slideAnim.interpolate({
                                        inputRange: [0, 30],
                                        outputRange: [0, 30 - (index * 5)]
                                    })
                                }],
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                borderRadius: 35
                            },
                            index > 0 && {paddingRight: 40}
                        ]}
                    >
                        <TextInput
                            style={[createForm.dishInput, { marginBottom: 8, backgroundColor: '#696969' }]}
                            value={entry.dish_name}
                            onChangeText={(text) => handleUpdateEntry(index, 'dish_name', text)}
                            placeholder='Name of the dish'
                            placeholderTextColor='#303030'
                        />
                        <TextInput
                            style={[createForm.dishInput, {backgroundColor: '#696969'}]}
                            value={entry.dish_amount}
                            onChangeText={(text) => handleUpdateEntry(index, 'dish_amount', text)}
                            placeholder='Grams'
                            placeholderTextColor='#303030'
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={[createForm.dishInput, {backgroundColor: '#696969'}]}
                            value={entry.dish_calories}
                            onChangeText={(text) => handleUpdateEntry(index, 'dish_calories', text)}
                            placeholder='Calories'
                            placeholderTextColor='#303030'
                            keyboardType="numeric"
                        />
                        {index > 0 && (
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    right: 10,
                                    top: '48%'
                                }}
                                onPress={() => handleDeleteEntry(index)}
                            >
                                <Image source={trashButton} style={{width: 25, height: 32, resizeMode: 'contain'}} />
                            </TouchableOpacity>
                        )}
                    </Animated.View>
                ))}

                <TouchableOpacity
                    style={[cmnstyle.bigButton, { marginTop: 16 }]}
                    onPress={handleCreateNewEntry}
                >
                    <Text style={cmnstyle.bigButtonText}>Add</Text>
                    <View style={{ position: 'absolute', top: 5, right: 5 }}>
                        <Image source={plusButton} style={cmnstyle.arrowButton} />
                    </View>
                </TouchableOpacity>

                <View style={{ height: 100 }} />
            </ScrollView>
        </Animated.View>
    )
};

export default FoodcreatecaloriesNotes;