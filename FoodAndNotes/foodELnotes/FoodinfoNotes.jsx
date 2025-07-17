import { View, Text, TouchableOpacity, Image, Animated, Easing, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect, useRef } from "react";
import foodinfo from "../foodcnsts/foodinfo";
import { cmnstyle, texts } from "../foodcnsts/appstyles";
import { arrowButton } from "../foodcnsts/appassts";

const { height, width } = Dimensions.get('window');

const FoodinfoNotes = () => {
    const navigation = useNavigation();
    const [currentSlideId, setCurrentSlideId] = useState(0);
    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(width)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;
    const dotScale = useRef(new Animated.Value(0)).current;
    
    const handleSlideNavigation = () => {
        Animated.sequence([
            Animated.timing(buttonScale, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(buttonScale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            })
        ]).start(() => {
            if (currentSlideId < 2) {
                fadeAnim.setValue(0);
                slideAnim.setValue(width);
                dotScale.setValue(0);
                
                setCurrentSlideId((prev) => prev + 1);
            } else {
                navigation.navigate('FoodhomeNotesEL');
            }
        });
    };

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.spring(dotScale, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            })
        ]).start();
    }, [currentSlideId]);

    const AnimatedDot = ({ active }) => (
        <Animated.View 
            style={{
                height: 10,
                width: active ? 20 : 10,
                borderRadius: 10,
                marginHorizontal: 7,
                backgroundColor: active ? '#FF00F0' : '#696969',
                transform: [{ scale: dotScale }]
            }}
        />
    );

    return (
        <View style={[cmnstyle.container, {paddingTop: height * 0.11}]}>
            <TouchableOpacity
                style={{position: 'absolute', top: 70, right: 20, zIndex: 10 }}
                onPress={() => navigation.navigate('FoodhomeNotesEL')}
            >
                <Animated.Text 
                    style={[
                        texts.label, 
                        { 
                            opacity: fadeAnim,
                            transform: [{ translateX: Animated.multiply(slideAnim, 0.5) }] 
                        }
                    ]}
                >
                    Skip
                </Animated.Text>
            </TouchableOpacity>

            <Animated.View
                style={{
                    transform: [{ translateX: slideAnim }],
                    opacity: fadeAnim
                }}
            >
                <Image
                    source={foodinfo[currentSlideId].show}
                    style={[
                        {resizeMode: 'contain'},
                        currentSlideId === 0 ? { 
                            width: '100%', 
                            alignSelf: 'flex-end', 
                            marginRight: -20, 
                            height: height * 0.5 
                        } : { 
                            width: '100%', 
                            alignSelf: 'center', 
                            height: height * 0.5 
                        }
                    ]}
                />
            </Animated.View>

            <Animated.View style={{
                width: '100%',
                position: 'absolute',
                alignSelf: 'center',
                alignItems: 'center',
                top: '70%',
                zIndex: 10,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim.interpolate({
                    inputRange: [0, width],
                    outputRange: [0, 50]
                }) }]
            }}>
                <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                    {foodinfo.map((_, index) => (
                        <AnimatedDot 
                            key={index} 
                            active={index <= currentSlideId} 
                        />
                    ))}
                </View>

                <Animated.Text 
                    style={[
                        texts.infoTitle, 
                        { 
                            transform: [{ 
                                translateX: slideAnim.interpolate({
                                    inputRange: [0, width],
                                    outputRange: [0, -20]
                                }) 
                            }] 
                        }
                    ]}
                >
                    {foodinfo[currentSlideId].title}
                </Animated.Text>
                
                <Animated.Text 
                    style={[
                        texts.infoText, 
                        { 
                            transform: [{ 
                                translateX: slideAnim.interpolate({
                                    inputRange: [0, width],
                                    outputRange: [0, 20]
                                }) 
                            }] 
                        }
                    ]}
                >
                    {foodinfo[currentSlideId].about}
                </Animated.Text>
            </Animated.View>

            <Animated.View
                style={{
                    position: 'absolute',
                    alignSelf: 'center',
                    bottom: height * 0.08,
                    transform: [{ scale: buttonScale }],
                    width: '100%'
                }}
            >
                <TouchableOpacity
                    style={cmnstyle.bigButton}
                    onPress={handleSlideNavigation}
                    activeOpacity={0.7}
                >
                    <Text style={cmnstyle.bigButtonText}>
                        {currentSlideId < 2 ? 'Continue' : 'Get Started'}
                    </Text>
                    <View style={{position: 'absolute', top: 5, right: 5}}>
                        <Image source={arrowButton} style={cmnstyle.arrowButton} />
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </View>
    )
};

export default FoodinfoNotes;