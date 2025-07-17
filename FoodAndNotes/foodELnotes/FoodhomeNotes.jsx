import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { View, Text, Image, TouchableOpacity, Animated, Easing, ScrollView } from "react-native";
import { cmnstyle, foodcard, texts } from "../foodcnsts/appstyles";
import foodnews from "../foodcnsts/foodnews";
import dutchrecipes from "../foodcnsts/dutchrecipes";
import { useState, useEffect, useRef, useCallback } from "react";
import { nothingeggInfo, plusButton } from "../foodcnsts/appassts";

const FoodhomeNotes = () => {
    const navigation = useNavigation();
    const [myRecipesStorage, setMyRecipesStorage] = useState([]);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideUpAnim = useRef(new Animated.Value(30)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    const getMyRecipes = async () => {
        try {
            const storedRecipes = await AsyncStorage.getItem('MY_RECIPES_DUTCH');
            if (storedRecipes) {
                setMyRecipesStorage(JSON.parse(storedRecipes));
            }
        } catch (error) {
            console.error('Error retrieving recipes:', error);
        }
    };

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
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    useFocusEffect(
        useCallback(() => {
            getMyRecipes();
        }, [])
    );

    const AnimatedRecipeCard = ({ recipe, index, isDutch = false }) => {
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
                        { scale: cardAnim },
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
                    onPress={() => navigation.navigate(
                        isDutch ? 'FoodreaddutchrecipeNotesEL' : 'FoodreadmyrecipeNotesEL', 
                        { recipe }
                    )}
                    style={[foodcard.container, {width: 280, marginRight: 16}]}
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
                                {isDutch
                                    ? recipe.preparation_time < 30 ? 'Easy'
                                        : (recipe.preparation_time > 30 && recipe.preparation_time < 60) ? 'Medium'
                                            : 'Hard'
                                                : recipe.difficulty_level}
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
            <Animated.Text style={[
                texts.label, 
                { 
                    fontSize: 21, 
                    marginBottom: 24,
                    transform: [{ translateY: slideUpAnim }] 
                }
            ]}>
                Home
            </Animated.Text>

            <ScrollView style={{ width: '100%' }}>
                {/* My Recipes Section */}
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <View style={[cmnstyle.row, { width: '100%', justifyContent: 'space-between', marginBottom: 12 }]}>
                        <Text style={texts.label}>My recipes</Text>
                        {myRecipesStorage.length > 0 && (
                            <TouchableOpacity onPress={() => navigation.navigate('FoodmyrecipesNotesEL')}>
                                <Text style={[texts.label, {color: '#FF00F0'}]}>See All</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {myRecipesStorage.length > 0 ? (
                        <View style={{height: 230}}>
                            <ScrollView 
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 16 }}
                            >
                                {myRecipesStorage.slice(0, 2).map((recipe, idx) => (
                                    <AnimatedRecipeCard key={idx} recipe={recipe} index={idx} />
                                ))}
                            </ScrollView>
                        </View>
                    ) : (
                        <Animated.View 
                            style={{ 
                                width: '100%', 
                                alignItems: 'center',
                                opacity: fadeAnim,
                                transform: [{ translateY: slideUpAnim }]
                            }}
                        >
                            <Text style={[texts.bigTitle, {marginBottom: 20, textAlign: 'center'}]}>You don't have any recipes yet</Text>
                            <Image
                                source={nothingeggInfo}
                                style={[cmnstyle.noImage, {marginBottom: 20}]}
                            />
                        </Animated.View>
                    )}
                </Animated.View>

                {/* Add Recipe Button */}
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <TouchableOpacity
                        style={cmnstyle.bigButton}
                        onPress={() => navigation.navigate('FoodcreaterecipeNotesEL')}
                        activeOpacity={0.7}
                    >
                        <Text style={cmnstyle.bigButtonText}>Add</Text>
                        <View style={{position: 'absolute', top: 5, right: 5}}>
                            <Image source={plusButton} style={cmnstyle.arrowButton} />
                        </View>
                    </TouchableOpacity>
                </Animated.View>

                {/* Dutch Recipes Section */}
                <Animated.View style={{ 
                    marginTop: 30,
                    opacity: fadeAnim,
                    transform: [{ translateY: slideUpAnim }]
                }}>
                    <View style={[cmnstyle.row, { width: '100%', justifyContent: 'space-between', marginBottom: 12 }]}>
                        <Text style={texts.label}>Dutch recipes</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('FooddutchrecipesNotesEL')}>
                            <Text style={[texts.label, {color: '#FF00F0'}]}>See All</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{height: 230}}>
                        <ScrollView 
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 16 }}
                        >
                            {dutchrecipes.slice(0, 2).map((recipe, idx) => (
                                <AnimatedRecipeCard key={idx} recipe={recipe} index={idx} isDutch />
                            ))}
                        </ScrollView>
                    </View>
                </Animated.View>

                {/* News Section */}
                <Animated.View style={{ 
                    marginTop: 30,
                    opacity: fadeAnim,
                    transform: [{ translateY: slideUpAnim }]
                }}>
                    <View style={[cmnstyle.row, { width: '100%', justifyContent: 'space-between', marginBottom: 12 }]}>
                        <Text style={texts.label}>News</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('FoodnewsNotesEL')}>
                            <Text style={[texts.label, {color: '#FF00F0'}]}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    {foodnews.slice(0, 2).map((item, idx) => (
                        <Animated.View 
                            key={idx} 
                            style={{
                                width: '100%',
                                opacity: fadeAnim,
                                transform: [{
                                    translateY: slideUpAnim.interpolate({
                                        inputRange: [0, 30],
                                        outputRange: [0, 30 - (idx * 10)]
                                    })
                                }]
                            }}
                        >
                            <TouchableOpacity
                                style={[foodcard.container, {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}]}
                                onPress={() => navigation.navigate('FoodreadnewsNotesEL', { item })}
                                activeOpacity={0.8}
                            >
                                <Image
                                    source={item.image_name}
                                    style={[foodcard.image, {width: '40%'}]}
                                />
                                <View style={{width: '60%', paddingVertical: 13, paddingHorizontal: 10}}>
                                    <Text style={foodcard.title}>{item.title}</Text>
                                    <Text
                                        style={foodcard.description}
                                        numberOfLines={2}
                                        ellipsizeMode="tail"
                                    >
                                        {item.description}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </Animated.View>

                <View style={{height: 200}} />
            </ScrollView>            
        </Animated.View>
    )
};

export default FoodhomeNotes;