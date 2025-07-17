import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Animated, Easing } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { cmnstyle, foodcard, texts } from "../foodcnsts/appstyles";
import { nothingeggInfo, plusButton } from "../foodcnsts/appassts";

const FoodcaloriesNotes = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [myCaloriesStorage, setMyCaloriesStorage] = useState([]);

    const slideUpAnim = useRef(new Animated.Value(30)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;
    const entryAnimations = useRef([]);

    const loadCalories = async () => {
        try {
            const storedCalories = await AsyncStorage.getItem('MY_CALORIES');
            if (storedCalories) {
                const parsedCalories = JSON.parse(storedCalories);
                setMyCaloriesStorage(Array.isArray(parsedCalories) ? parsedCalories : []);
                
                entryAnimations.current = parsedCalories.map(() => new Animated.Value(0));
            }
        } catch (error) {
            console.error('Failed to load calories', error);
        }
    };

    useEffect(() => {
        if (isFocused) {
            loadCalories();
        }
    }, [isFocused]);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(slideUpAnim, {
                toValue: 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            })
        ]).start();

        const timeout = setTimeout(() => {
            Animated.stagger(100, 
                entryAnimations.current.map(anim => 
                    Animated.spring(anim, {
                        toValue: 1,
                        friction: 5,
                        useNativeDriver: true,
                    })
                )
            ).start();
        }, 300);

        return () => clearTimeout(timeout);
    }, []);

    const handleAddPress = () => {
        Animated.sequence([
            Animated.timing(buttonScale, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.spring(buttonScale, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true,
            })
        ]).start(() => {
            navigation.navigate('FoodcreatecaloriesNotesEL');
        });
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
                Calories
            </Animated.Text>

            {
                myCaloriesStorage.length > 0 ? (
                    <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
                        <View style={[cmnstyle.row, {width: '100%', justifyContent: 'space-between', flexWrap: 'wrap'}]}>

                            {myCaloriesStorage.map((entry, idx) => (
                                <Animated.View
                                    key={entry.id || idx}
                                    style={{
                                        opacity: entryAnimations.current[idx] || 0,
                                        transform: [
                                            {
                                                translateY: (entryAnimations.current[idx] || new Animated.Value(0)).interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [20, 0],
                                                }),
                                            },
                                        ],
                                        width: '48.5%',
                                        marginBottom: 10
                                    }}
                                >
                                    <TouchableOpacity
                                        style={[foodcard.container, { paddingVertical: 20, paddingHorizontal: 10 }]}
                                        onPress={() => navigation.navigate('FoodreadcaloriesNotesEL', { entry })}
                                        activeOpacity={0.8}
                                    >
                                        <Text
                                            style={[foodcard.title, {width: '90%'}]}
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                        >
                                            {entry.dish_name}
                                        </Text>
                                        <View style={cmnstyle.row}>
                                            <Text style={foodcard.types}>{entry.dish_amount} grams</Text>
                                            <Text style={[foodcard.types, { marginHorizontal: 10 }]}>|</Text>
                                            <Text style={foodcard.types}>{entry.dish_calories} kcal</Text>
                                        </View>
                                    </TouchableOpacity>
                                </Animated.View>
                            ))}

                        </View>

                        <Animated.View style={{ transform: [{ scale: buttonScale }], width: '100%', marginTop: 30 }}>
                            <TouchableOpacity
                                style={cmnstyle.bigButton}
                                onPress={handleAddPress}
                                activeOpacity={0.7}
                            >
                                <Text style={cmnstyle.bigButtonText}>Add</Text>
                                <View style={{ position: 'absolute', top: 5, right: 5 }}>
                                    <Image source={plusButton} style={cmnstyle.arrowButton} />
                                </View>
                            </TouchableOpacity>
                        </Animated.View>

                        <View style={{ height: 150 }} />
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
                                }),
                            }],
                        }}
                    >
                        <Text style={[texts.bigTitle, { marginBottom: 20, textAlign: 'center' }]}>You don't have any calories records yet</Text>
                        <Image
                            source={nothingeggInfo}
                            style={[cmnstyle.noImage, { marginBottom: 20 }]}
                        />
                        
                        <Animated.View style={{ transform: [{ scale: buttonScale }], width: '100%' }}>
                            <TouchableOpacity
                                style={cmnstyle.bigButton}
                                onPress={handleAddPress}
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
    );
};

export default FoodcaloriesNotes;