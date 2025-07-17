import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, TouchableOpacity, Animated, Easing, ScrollView, Dimensions } from "react-native";
import { cmnstyle, foodcard, texts } from "../foodcnsts/appstyles";
import dutchrecipes from "../foodcnsts/dutchrecipes";
import { useEffect, useRef } from "react";
import { backButton } from "../foodcnsts/appassts";

const { width } = Dimensions.get('window');

const FooddutchrecipesNotes = () => {
    const navigation = useNavigation();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideUpAnim = useRef(new Animated.Value(30)).current;

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
                        'FoodreaddutchrecipeNotesEL',
                        { recipe }
                    )}
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
                                {recipe.preparation_time < 30 ? 'Easy'
                                    : (recipe.preparation_time > 30 && recipe.preparation_time < 60) ? 'Medium'
                                        : 'Hard'}
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
            {/* Header */}
            <View style={[cmnstyle.row, {marginBottom: 20}]}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
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
                    Dutch Recipes
                </Animated.Text>
            </View>

            {/* Recipe List */}
            <ScrollView
                style={{ width: '100%' }}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View style={{ 
                    opacity: fadeAnim,
                    transform: [{ translateY: slideUpAnim }],
                    paddingBottom: 20
                }}>
                    {dutchrecipes.map((recipe, idx) => (
                        <AnimatedRecipeCard key={idx} recipe={recipe} index={idx} />
                    ))}
                </Animated.View>

                <View style={{height: 100}} />
            </ScrollView>            
        </Animated.View>
    )
};

export default FooddutchrecipesNotes;