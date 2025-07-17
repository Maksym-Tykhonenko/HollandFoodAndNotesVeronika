import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Image, Animated, Easing, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { cmnstyle, foodcard, readfood, texts } from "../foodcnsts/appstyles";
import { backButton } from "../foodcnsts/appassts";

const { height } = Dimensions.get('window');

const FoodreadnewsNotes = ({ item }) => {
    const navigation = useNavigation();
    
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideUpAnim = useRef(new Animated.Value(30)).current;
    const imageScale = useRef(new Animated.Value(0.9)).current;
    const contentSlide = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        const animations = Animated.parallel([
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
        ]);

        animations.start();

        return () => animations.stop();
    }, []);

    return (
        <Animated.View style={{ width: '100%', height: '100%', opacity: fadeAnim }}>
            <Animated.View style={[readfood.upperpanel, { transform: [{ translateY: slideUpAnim }] }]}>
                <View style={cmnstyle.row}>
                    <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={20}>
                        <Image source={backButton} style={cmnstyle.backIcon} />
                    </TouchableOpacity>
                    <Animated.Text 
                        style={[texts.bigTitle, { transform: [{ translateY: slideUpAnim }], marginLeft: 10, color: '#000', width: '80%' }]}
                        numberOfLines={1}
                        ellipsizeMode='tail'
                    >
                        {item.title}
                    </Animated.Text>
                </View>
            </Animated.View>

            <Animated.Image
                source={item.image_name}
                style={[readfood.image, { transform: [{ scale: imageScale }] }]}
                resizeMode="cover"
            />

            <Animated.ScrollView 
                style={{
                    position: 'absolute',
                    top: 125,
                    paddingTop: height * 0.2,
                    width: '90%',
                    alignSelf: 'center',
                    transform: [{ translateY: contentSlide }],
                }}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <Animated.View style={[foodcard.container, { padding: 20, opacity: fadeAnim }]}>
                    <Text style={readfood.title}>{item.title}</Text>
                    <Text style={readfood.description}>{item.description}</Text>
                </Animated.View>
            </Animated.ScrollView>
        </Animated.View>
    );
};

export default FoodreadnewsNotes;