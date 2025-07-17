import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { View, Text, Image, TouchableOpacity, Animated, Easing, ScrollView } from "react-native";
import { cmnstyle, foodcard, texts } from "../foodcnsts/appstyles";
import { useState, useEffect, useRef, useCallback } from "react";
import { arrowButton, backButton, nothingeggInfo } from "../foodcnsts/appassts";

const FoodmyrecipesNotes = () => {
    const navigation = useNavigation();
    const [myRecipesStorage, setMyRecipesStorage] = useState([]);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideUpAnim = useRef(new Animated.Value(30)).current;

    const getMyRecipes = useCallback(async () => {
        try {
            const storedRecipes = await AsyncStorage.getItem('MY_RECIPES_DUTCH');
            storedRecipes && setMyRecipesStorage(JSON.parse(storedRecipes));
        } catch (error) {
            console.error('Error retrieving recipes:', error);
        }
    }, []);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
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
    }, []);

    useFocusEffect(
        useCallback(() => {
            getMyRecipes();
        }, [getMyRecipes])
    );

    const AnimatedRecipeCard = ({ recipe, index }) => {
        const cardAnim = useRef(new Animated.Value(0)).current;
        
        useEffect(() => {
            Animated.spring(cardAnim, {
                toValue: 1,
                delay: index * 100,
                friction: 5,
                useNativeDriver: true,
            }).start();
        }, []);

        return (
            <Animated.View
                style={{
                    transform: [
                        { 
                            translateX: cardAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [50, 0]
                            })
                        }
                    ],
                    opacity: cardAnim
                }}
            >
                <TouchableOpacity
                    onPress={() => navigation.navigate('FoodreadmyrecipeNotesEL', { recipe })}
                    style={[foodcard.container, {marginBottom: 16}]}
                    activeOpacity={0.8}
                >
                    <Image
                        source={recipe.image_name}
                        style={foodcard.image}
                    />
                    <View style={{width: '100%', paddingVertical: 16, paddingHorizontal: 14}}>
                        <Text style={foodcard.title}>{recipe.title}</Text>
                        <View style={cmnstyle.row}>
                            <Text style={foodcard.types}>
                                {recipe.difficulty_level}
                            </Text>
                            <Text style={[foodcard.types, {marginHorizontal: 10}]}>|</Text>
                            <Text style={foodcard.types}>{recipe.preparation_time} min</Text>
                            <Text style={[foodcard.types, {marginHorizontal: 10}]}>|</Text>
                            <Text style={foodcard.types}>{recipe.dish_type}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <Animated.View style={[cmnstyle.container, { opacity: fadeAnim }]}>
            <View style={[cmnstyle.row, {marginBottom: 20}]}>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('FoodhomeNotesEL')}
                    hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                >
                    <Image source={backButton} style={cmnstyle.backIcon} />
                </TouchableOpacity>
                <Animated.Text style={[
                    texts.bigTitle, 
                    { 
                        transform: [{ translateY: slideUpAnim }],
                        marginLeft: 10
                    }
                ]}>
                    My Recipes
                </Animated.Text>
            </View>

            <ScrollView
                style={{ width: '100%' }}
                showsVerticalScrollIndicator={false}
            >
                {myRecipesStorage.length > 0 ? (
                    myRecipesStorage.map((recipe, idx) => (
                        <AnimatedRecipeCard key={`${recipe.id}-${idx}`} recipe={recipe} index={idx} />
                    ))
                ) : (
                    <Animated.View 
                        style={{ 
                            alignItems: 'center',
                            opacity: fadeAnim,
                            transform: [{ translateY: slideUpAnim }]
                        }}
                    >
                        <Text style={[texts.bigTitle, {marginBottom: 20}]}>You don't have any recipes yet</Text>
                        <Image
                            source={nothingeggInfo}
                            style={[cmnstyle.noImage, {marginBottom: 20}]}
                        />
                    </Animated.View>
                )}

                <TouchableOpacity
                    style={cmnstyle.bigButton}
                    onPress={() => navigation.navigate('FoodcreaterecipeNotesEL')}
                    activeOpacity={0.7}
                >
                    <Text style={cmnstyle.bigButtonText}>Add</Text>
                    <View style={{position: 'absolute', top: 3, right: 5}}>
                        <Image source={arrowButton} style={cmnstyle.arrowButton} />
                    </View>
                </TouchableOpacity>

                <View style={{height: 100}} />
            </ScrollView>            
        </Animated.View>
    )
};

export default FoodmyrecipesNotes;