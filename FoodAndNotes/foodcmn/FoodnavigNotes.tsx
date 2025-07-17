import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, TouchableOpacity, Animated } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { navig } from "../foodcnsts/appstyles";
import navigel from "../foodcnsts/navigel";


const FoodnavigNotes: React.FC = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [focusedFoodel, setFocusedFoodel] = useState<string>(route.name);
    const animationValues = useRef(navigel.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        setFocusedFoodel(route.name);
        
        Animated.stagger(100, 
        animationValues.map(value => 
            Animated.spring(value, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
            })
        )
        ).start();
    }, [route.name]);

    const handleFoonavigelchange = (screen: string) => {
        const index = navigel.findIndex(el => el.element === screen);
        
        Animated.sequence([
        Animated.timing(animationValues[index], {
            toValue: 0.8,
            duration: 100,
            useNativeDriver: true,
        }),
        Animated.spring(animationValues[index], {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
        })
        ]).start(() => {
        navigation.navigate(screen as never);
        });
    };

    return (
        <View style={navig.container}>
            {navigel.map((el, idx) => (
                <TouchableOpacity 
                    key={el.element} 
                    onPress={() => handleFoonavigelchange(el.element)}
                    activeOpacity={0.7}
                >

                    <View style={{paddingTop: 13, alignItems: 'center'}}>

                        <Animated.View 
                            style={[
                                focusedFoodel === el.element && navig.box,
                                { 
                                    transform: [{ 
                                    scale: animationValues[idx].interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.5, 1]
                                    }) 
                                    }] 
                                }
                            ]}
                        >
                            <Image 
                                source={el.icon} 
                                style={[
                                    navig.icon,
                                    { 
                                        tintColor: focusedFoodel === el.element ? '#FF00F0' : '#888' 
                                    }
                                ]} 
                            />
                        </Animated.View>

                        <Text style={[
                            navig.name, 
                            { 
                                color: focusedFoodel === el.element ? '#FF00F0' : '#888',
                                fontWeight: focusedFoodel === el.element ? '600' : '400'
                            }
                        ]}>
                            {el.name}
                        </Text>

                    </View>

                </TouchableOpacity>
            ))}
        </View>
    );
};

export default React.memo(FoodnavigNotes);