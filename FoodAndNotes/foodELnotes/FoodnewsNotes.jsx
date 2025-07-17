import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, TouchableOpacity, Animated, Easing, ScrollView, Dimensions } from "react-native";
import { cmnstyle, foodcard, texts } from "../foodcnsts/appstyles";
import foodnews from "../foodcnsts/foodnews";
import { useEffect, useRef } from "react";
import { backButton } from "../foodcnsts/appassts";

const { width } = Dimensions.get('window');

const FoodnewsNotes = () => {
    const navigation = useNavigation();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideUpAnim = useRef(new Animated.Value(20)).current;

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
            })
        ]).start();
    }, []);

    const AnimatedNewsCard = ({ item, index }) => {
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
                    opacity: cardAnim,
                    marginBottom: 16
                }}
            >
                <TouchableOpacity
                    style={[
                        foodcard.container, 
                        {
                            flexDirection: 'row', 
                            justifyContent: 'space-between',
                        }
                    ]}
                    onPress={() => navigation.navigate('FoodreadnewsNotesEL', { item })}
                    activeOpacity={0.7}
                >
                    <Image
                        source={item.image_name}
                        style={[
                            foodcard.image, 
                            {
                                width: '40%',
                                height: '100%'
                            }
                        ]}
                    />
                    <View style={{
                        width: '60%', 
                        paddingVertical: 13,
                        paddingHorizontal: 10
                    }}>
                        <Text style={foodcard.title}>
                            {item.title}
                        </Text>
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
        );
    };

    return (
        <Animated.View style={[cmnstyle.container, { opacity: fadeAnim }]}>

            {/* Header */}
            <View style={[cmnstyle.row, {marginBottom: 20, alignItems: 'center'}]}>
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
                    }
                ]}>
                    News
                </Animated.Text>
            </View>

            {/* News List */}
            <ScrollView 
                style={{ width: '100%' }}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View style={{ 
                    opacity: fadeAnim,
                    transform: [{ translateY: slideUpAnim }]
                }}>
                    {foodnews.map((item, idx) => (
                        <AnimatedNewsCard key={idx} item={item} index={idx} />
                    ))}
                </Animated.View>
                <View style={{height: 100}} />
            </ScrollView>            
        </Animated.View>
    )
};

export default FoodnewsNotes;