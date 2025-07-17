import React, { useState, useRef } from "react";
import { View, Text, Image, TouchableOpacity, Animated, Easing } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { cmnstyle, foodcard, readfood, texts } from "../foodcnsts/appstyles";
import { backButton, nothingeggInfo } from "../foodcnsts/appassts";

const FoodreadcaloriesNotes = ({ entry }) => {
    const navigation = useNavigation();
    const [isDeleting, setIsDeleting] = useState(false);
    
    // Animation refs
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideUpAnim = useRef(new Animated.Value(30)).current;
    const deleteButtonScale = useRef(new Animated.Value(1)).current;
    const cardScale = useRef(new Animated.Value(0.95)).current;

    // Start animations on mount
    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(slideUpAnim, {
                toValue: 0,
                duration: 500,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.spring(cardScale, {
                toValue: 1,
                friction: 6,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const deleteMyRecipe = async () => {
        if (isDeleting) return;
        setIsDeleting(true);
        
        // Button press animation
        Animated.sequence([
            Animated.timing(deleteButtonScale, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.spring(deleteButtonScale, {
                toValue: 1.1,
                friction: 5,
                useNativeDriver: true,
            })
        ]).start();

        try {
            // Get existing calories from storage
            const savedCalories = await AsyncStorage.getItem('MY_CALORIES');
            let calories = savedCalories ? JSON.parse(savedCalories) : [];
            
            // Filter out the current entry
            calories = calories.filter(item => item.id !== entry.id);
            
            // Save back to storage
            await AsyncStorage.setItem('MY_CALORIES', JSON.stringify(calories));
            
            // Animate exit before navigating back
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideUpAnim, {
                    toValue: -30,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start(() => {
                navigation.navigate('FoodcaloriesNotesEL');
            });
            
        } catch (error) {
            console.error('Error deleting entry:', error);
            setIsDeleting(false);
            Animated.spring(deleteButtonScale, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true,
            }).start();
        }
    };

    return (
        <Animated.View style={[cmnstyle.container, { opacity: fadeAnim }]}>

            <Animated.View style={[cmnstyle.row, { 
                width: '100%', 
                justifyContent: 'space-between', 
                marginBottom: 24,
                transform: [{ translateY: slideUpAnim }]
            }]}>
                <View style={cmnstyle.row}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('FoodcaloriesNotesEL')}
                        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    >
                        <Image source={backButton} style={cmnstyle.backIcon} />
                    </TouchableOpacity>
                    <Text
                        style={[texts.bigTitle, { width: '75%' }]}
                        numberOfLines={1}
                        ellipsizeMode='tail'
                    >
                        {entry.dish_name}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('FoodcreatecaloriesNotesEL', { entry })}>
                    <Text style={[texts.label, { color: '#FF00F0', marginBottom: 0, fontSize: 16 }]}>
                        Edit
                    </Text>
                </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[foodcard.container, { 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                transform: [{ scale: cardScale }]
            }]}>
                <View style={{ width: '55%', paddingVertical: 20, paddingHorizontal: 10 }}>
                    <Text style={[readfood.title, { marginBottom: 16 }]}>{entry.dish_name}</Text>

                    <Text style={readfood.ingredientText}>Grams</Text>
                    <Text style={[readfood.infoButtonText, { color: '#fff', marginBottom: 16 }]}>{entry.dish_amount}</Text>

                    <Text style={readfood.ingredientText}>Calories</Text>
                    <Text style={[readfood.infoButtonText, { color: '#fff' }]}>{entry.dish_calories}</Text>
                </View>
                <Image source={nothingeggInfo} style={{width: '46%', height: 120, resizeMode: 'contain'}} />
            </Animated.View>

            <Animated.View
                style={[
                    cmnstyle.bigButton,
                    {
                        position: 'absolute',
                        alignSelf: 'center',
                        bottom: 50,
                        backgroundColor: '#FF0037',
                        transform: [{ scale: deleteButtonScale }],
                        opacity: isDeleting ? 0.7 : 1,
                        width: '100%'
                    }
                ]}
            >
                <TouchableOpacity
                    onPress={deleteMyRecipe}
                    disabled={isDeleting}
                >
                    <Text style={cmnstyle.bigButtonText}>
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Text>
                </TouchableOpacity>
            </Animated.View>

        </Animated.View>
    )
};

export default FoodreadcaloriesNotes;