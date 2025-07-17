import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, Image, Animated, Easing, Dimensions } from "react-native";
import { useState, useEffect, useRef } from "react";
import { cmnstyle, foodcard, readfood, texts } from "../foodcnsts/appstyles";
import { backButton } from "../foodcnsts/appassts";

const { height } = Dimensions.get('window');

const FoodreaddutchrecipeNotes = ({ recipe }) => {
    const navigation = useNavigation();
    const [currentInfo, setCurrentInfo] = useState('');
    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideUpAnim = useRef(new Animated.Value(30)).current;
    const imageScale = useRef(new Animated.Value(0.9)).current;
    const contentSlide = useRef(new Animated.Value(50)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;

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
                duration: 500,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.spring(imageScale, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true,
            }),
            Animated.timing(contentSlide, {
                toValue: 0,
                duration: 700,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const handleInfoChange = (infoType) => {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 0.5,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.spring(buttonScale, {
                toValue: infoType === currentInfo ? 1 : 1.05,
                friction: 5,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start(() => {
            setCurrentInfo(infoType === currentInfo ? '' : infoType);
            buttonScale.setValue(1);
        });
    };

    const AnimatedListItem = ({ item, index, isStep = false }) => {
        const itemAnim = useRef(new Animated.Value(0)).current;
        
        useEffect(() => {
            Animated.spring(itemAnim, {
                toValue: 1,
                delay: index * 100,
                friction: 5,
                useNativeDriver: true,
            }).start();
        }, []);

        return (
            <Animated.View
                style={{
                    opacity: itemAnim,
                    transform: [{
                        translateX: itemAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [30, 0]
                        })
                    }],
                }}
            >
                <View style={[cmnstyle.row, { marginBottom: 8, alignItems: 'flex-start' }]}>
                    {isStep ? (
                        <>
                            <Text style={[readfood.ingredientTitle, {marginRight: 12}]}>{index + 1} step</Text>
                            {/* <Text style={readfood.ingredientText}>{item.description}</Text> */}
                            <Text style={[readfood.ingredientText, {width: '80%'}]}>{item}</Text>
                        </>
                    ) : (
                        <>
                            {/* <Text style={readfood.ingredientTitle}>{item.title}</Text>
                            <Text style={readfood.ingredientText}>{item.quantity}</Text> */}
                            <Text style={readfood.ingredientText}>{item}</Text>
                        </>
                    )}
                </View>
            </Animated.View>
        );
    };

    return (
        <Animated.View style={{ width: '100%', height: '100%', opacity: fadeAnim }}>
            
            <Animated.View 
                style={[
                    readfood.upperpanel,
                    { 
                        transform: [{ translateY: slideUpAnim }] 
                    }
                ]}
            >
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
                            transform: [{ translateY: slideUpAnim }],
                            marginLeft: 10,
                            color: '#000',
                            width: '80%'
                        }
                    ]}
                        numberOfLines={1}
                        ellipsizeMode='tail'
                    >
                        {recipe.title}
                    </Animated.Text>
                </View>
            </Animated.View>

            <Animated.Image
                source={recipe.image_name}
                style={[
                    readfood.image,
                    { 
                        transform: [{ scale: imageScale }] 
                    }
                ]}
            />

            <Animated.ScrollView 
                style={[
                    { 
                        position: 'absolute',
                        top: 125,
                        paddingTop: height * 0.2,
                        alignSelf: 'center',
                        width: '90%',
                        height: '100%',
                        transform: [{ translateY: contentSlide }],
                    }
                ]}
                contentContainerStyle={{ paddingBottom: 30 }}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View 
                    style={[
                        foodcard.container, 
                        { 
                            paddingVertical: 20,
                            opacity: fadeAnim,
                        }
                    ]}
                >
                    <Animated.View style={{ paddingHorizontal: 20, opacity: fadeAnim }}>
                        <Text style={readfood.region}>Dutch recipe</Text>
                        <Text style={readfood.title}>{recipe.title}</Text>
                        <View style={cmnstyle.row}>
                            <Text style={foodcard.types}>
                                {
                                    recipe.preparation_time < 30 ? 'Easy'
                                        : (recipe.preparation_time > 30 && recipe.preparation_time < 60) ? 'Medium'
                                            : 'Hard'
                                }
                            </Text>
                            <Text style={[foodcard.types, {marginHorizontal: 10}]}>|</Text>
                            <Text style={foodcard.types}>{recipe.preparation_time} min</Text>
                            <Text style={[foodcard.types, {marginHorizontal: 10}]}>|</Text>
                            <Text style={foodcard.types}>{recipe.dish_type}</Text>
                        </View>
                    </Animated.View>

                    <View style={[cmnstyle.row, {justifyContent: 'space-between', marginVertical: 15}]}>
                        <Animated.View style={{ transform: [{ scale: buttonScale }], width: '50%' }}>
                            <TouchableOpacity
                                style={[readfood.infoButton, currentInfo === 'ingredients' && { backgroundColor: '#FF00F0' }]}
                                onPress={() => handleInfoChange('ingredients')}
                            >
                                <Text style={[readfood.infoButtonText, { color: currentInfo === 'ingredients' ? '#000' : currentInfo === 'cooking steps' ?  '#fff' : '#000' }]}>Ingredients</Text>
                            </TouchableOpacity>
                        </Animated.View>
                        
                        <Animated.View style={{ transform: [{ scale: buttonScale }], width: '50%' }}>
                            <TouchableOpacity
                                style={[readfood.infoButton, currentInfo === 'cooking steps' && { backgroundColor: '#FF00F0' }]}
                                onPress={() => handleInfoChange('cooking steps')}
                            >
                                <Text style={[readfood.infoButtonText, currentInfo === 'cooking steps' && { color: currentInfo === 'cooking steps' ? '#000' : currentInfo === 'ingredients' ?  '#fff' : '#000' }]}>Cooking steps</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>

                    <Animated.View style={{ width: '100%', opacity: fadeAnim, paddingHorizontal: 20 }}>
                        {currentInfo === 'ingredients' ? (
                            <View style={{ width: '100%' }}>
                                {recipe.ingredients.map((item, idx) => (
                                    <AnimatedListItem key={idx} item={item} index={idx} />
                                ))}
                            </View>
                        ) : currentInfo === 'cooking steps' ? (
                            <View style={{ width: '100%' }}>
                                {recipe.preparation_method.map((item, idx) => (
                                    <AnimatedListItem key={idx} item={item} index={idx} isStep />
                                ))}
                            </View>
                        ) : (
                            <Text style={readfood.description}>
                                {recipe.description}
                            </Text>
                        )}
                    </Animated.View>
                </Animated.View>

                <View style={{height: 150}} />
            </Animated.ScrollView>
        </Animated.View>
    );
};

export default FoodreaddutchrecipeNotes;