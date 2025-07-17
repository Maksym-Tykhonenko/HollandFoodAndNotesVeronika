import React, { useEffect } from 'react';
import { View, Animated, Easing } from 'react-native';
import WebView from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import splashhtml from '../foodcnsts/splashhtml';
import { cmnstyle, splash } from '../foodcnsts/appstyles';

const FoodsplashNotes = () => {
    const navigation = useNavigation();
    const fadeAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(0.8);
    const textSlideAnim = new Animated.Value(0);
    const infiniteRotateAnim = new Animated.Value(0);
    const textBounceAnim = new Animated.Value(0);

    useEffect(() => {
        Animated.loop(
            Animated.timing(infiniteRotateAnim, {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(textSlideAnim, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(textSlideAnim, {
                    toValue: 0,
                    duration: 1500,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                })
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(textBounceAnim, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(textBounceAnim, {
                    toValue: 0,
                    duration: 1000,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, []);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 1200,
                easing: Easing.elastic(1),
                useNativeDriver: true,
            })
        ]).start();

        //const timer = setTimeout(() => {
        //    navigation.navigate('FoodinfoNotesEL');
        //}, 4000);
//
        //return () => clearTimeout(timer);
    }, []);

    const infiniteRotateInterpolate = infiniteRotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    const textSlideInterpolate = textSlideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-10, 10]
    });

    const textBounceInterpolate = textBounceAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -5]
    });

    return (
        <View style={cmnstyle.container}>
            <Animated.View style={{
                opacity: fadeAnim,
                transform: [
                    { scale: scaleAnim },
                ],
                marginTop: 100
            }}>
                <Animated.Text style={[
                    splash.title,
                    { 
                        transform: [
                            { translateX: textSlideInterpolate },
                            { translateY: textBounceInterpolate }
                        ] 
                    }
                ]}>
                    Holland Food & Notes
                </Animated.Text>
                
                <Animated.View style={[
                    splash.decoration, 
                    { 
                        opacity: fadeAnim,
                        transform: [{ rotate: infiniteRotateInterpolate }] 
                    }
                ]} />
                <Animated.View style={[
                    splash.decoration2, 
                    { 
                        opacity: fadeAnim,
                        transform: [
                            { rotate: infiniteRotateInterpolate }
                        ] 
                    }
                ]} />
            </Animated.View>

            <View style={splash.loaderContainer}>
                <WebView
                    source={{ html: splashhtml }}
                    style={splash.webview}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    scalesPageToFit={true}
                    scrollEnabled={false}
                    originWhitelist={['*']}
                />
            </View>
        </View>
    );
};

export default FoodsplashNotes;