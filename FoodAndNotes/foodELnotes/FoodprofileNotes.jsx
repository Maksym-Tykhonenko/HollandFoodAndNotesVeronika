import { View, Text, Image, TouchableOpacity, ScrollView, Animated, Easing, Switch, Linking } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { cmnstyle, createForm, foodcard, texts } from "../foodcnsts/appstyles";
import { arrowSettings, noprofileInfo, notifySettings, plusButton, profileSettings, termsSettings } from "../foodcnsts/appassts";

const FoodprofileNotes = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [appUserProfile, setAppUserProfile] = useState(null);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideUpAnim = useRef(new Animated.Value(30)).current;
    const addButtonAnim = useRef(new Animated.Value(0)).current;
    const rowAnimations = useRef([]);

    const loadProfile = async () => {
        try {
            const profile = await AsyncStorage.getItem('USER_PROFILE_HOLLAND');
            const notifications = await AsyncStorage.getItem('NOTIFICATIONS_ENABLED');
            
            if (profile) {
                setAppUserProfile(JSON.parse(profile));
                rowAnimations.current = [0, 1, 2].map(() => new Animated.Value(0));
            }
            if (notifications) {
                setNotificationsEnabled(JSON.parse(notifications));
            }
        } catch (error) {
            console.error('Failed to load profile', error);
        }
    };

    useEffect(() => {
        if (isFocused) {
            loadProfile();
            
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(slideUpAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                })
            ]).start();

            Animated.loop(
                Animated.sequence([
                    Animated.timing(addButtonAnim, {
                        toValue: 1,
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(addButtonAnim, {
                        toValue: 0,
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    })
                ])
            ).start();
        } else {
            fadeAnim.setValue(0);
            slideUpAnim.setValue(30);
            addButtonAnim.setValue(0);
        }
    }, [isFocused]);

    useEffect(() => {
        if (appUserProfile && rowAnimations.current.length > 0) {
            Animated.stagger(150, 
                rowAnimations.current.map(anim => 
                    Animated.spring(anim, {
                        toValue: 1,
                        friction: 6,
                        useNativeDriver: true,
                    })
                )
            ).start();
        }
    }, [appUserProfile]);

    const toggleNotifications = async (value) => {
        try {
            setNotificationsEnabled(value);
            await AsyncStorage.setItem('NOTIFICATIONS_ENABLED', JSON.stringify(value));
        } catch (error) {
            console.error('Failed to save notification preference', error);
        }
    };

    const handleTermsPress = () => {
        const url = 'https://www.termsfeed.com/live/aebc902c-47fa-449a-811d-7021026fd199';
        Linking.openURL(url).catch(err => {
            console.error('Failed to open URL:', err);
        });
    };

    return (
        <View style={cmnstyle.container}>
            <Animated.Text style={[
                texts.label,
                {
                    fontSize: 21,
                    marginBottom: 24,
                    transform: [{ translateY: slideUpAnim }],
                    opacity: fadeAnim
                }
            ]}>
                {appUserProfile ? 'Settings' : 'Profile'}
            </Animated.Text>

            {appUserProfile ? (
                <ScrollView style={{ width: '100%' }}>
                    <View style={[foodcard.container, {paddingVertical: 20, paddingHorizontal: 15}]}>
                        <View style={{ alignItems: 'center', marginBottom: 20 }}>
                            {appUserProfile.image && (
                                <Image 
                                    source={{uri: appUserProfile.image}} 
                                    style={{width: 100, height: 100, borderRadius: 50, marginBottom: 10}}
                                />
                            )}
                            <Text style={[texts.bigTitle, {marginBottom: 5}]}>
                                {appUserProfile.name} {appUserProfile.surname}
                            </Text>
                            <Text style={foodcard.description}>{appUserProfile.email}</Text>
                        </View>

                        {[0, 1, 2].map((index) => (
                            <Animated.View
                                key={index}
                                style={{
                                    opacity: rowAnimations.current[index] || 1,
                                    transform: [{
                                        translateY: (rowAnimations.current[index] || new Animated.Value(0)).interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [20, 0],
                                        })
                                    }]
                                }}
                            >
                                {index === 0 && (
                                    <TouchableOpacity
                                        style={[
                                            cmnstyle.row,
                                            { width: '100%', justifyContent: 'space-between', marginBottom: 10, paddingVertical: 5 }
                                        ]}
                                        onPress={() => navigation.navigate('FoodcreateprofileNotesEL', {user: appUserProfile})}
                                    >
                                        <View style={cmnstyle.row}>
                                            <Image source={profileSettings} style={{width: 36, height: 40, marginRight: 10}} />
                                            <Text style={[createForm.noteLabel, {fontSize: 15, marginBottom: 0}]}>Edit Profile</Text>
                                        </View>
                                        <Image source={arrowSettings} style={{width: 10, height: 24, resizeMode: 'contain'}} />
                                    </TouchableOpacity>
                                )}

                                {index === 1 && (
                                    <TouchableOpacity
                                        style={[
                                            cmnstyle.row,
                                            { width: '100%', justifyContent: 'space-between', marginBottom: 10, paddingVertical: 5 }
                                        ]}
                                        onPress={handleTermsPress}
                                    >
                                        <View style={cmnstyle.row}>
                                            <Image source={termsSettings} style={{width: 36, height: 40, marginRight: 10}} />
                                            <Text style={[createForm.noteLabel, {fontSize: 15, marginBottom: 0}]}>Terms of Use</Text>
                                        </View>
                                        <Image source={arrowSettings} style={{width: 10, height: 24, resizeMode: 'contain'}} />
                                    </TouchableOpacity>
                                )}

                                {index === 2 && (
                                    <View
                                        style={[
                                            cmnstyle.row,
                                            { width: '100%', justifyContent: 'space-between', marginBottom: 10, paddingVertical: 5 }
                                        ]}
                                    >
                                        <View style={cmnstyle.row}>
                                            <Image source={notifySettings} style={{width: 36, height: 40, marginRight: 10}} />
                                            <Text style={[createForm.noteLabel, {fontSize: 15, marginBottom: 0}]}>Notifications</Text>
                                        </View>
                                        <Switch 
                                            value={notificationsEnabled}
                                            onValueChange={toggleNotifications}
                                            trackColor={{ false: "#767577", true: "#FF00F0" }}
                                            thumbColor={notificationsEnabled ? "#FFFFFF" : "#f4f3f4"}
                                        />
                                    </View>
                                )}
                            </Animated.View>
                        ))}
                    </View>
                    <View style={{height: 200}} />
                </ScrollView>
            ) : (
                <Animated.View 
                    style={{ 
                        width: '100%', 
                        alignItems: 'center',
                        opacity: fadeAnim,
                        transform: [{
                            translateY: fadeAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [20, 0],
                            })
                        }],
                    }}
                >
                    <Animated.Image
                        source={noprofileInfo}
                        style={[
                            cmnstyle.noImage, 
                            { 
                                marginBottom: 40,
                                transform: [{
                                    rotate: addButtonAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['-5deg', '5deg']
                                    })
                                }]
                            }
                        ]}
                        />
                        
                    <Text style={[texts.bigTitle, { marginBottom: 30, textAlign: 'center' }]}>
                        You don't have a profile yet
                    </Text>
                    
                    <Animated.View
                        style={{
                            transform: [
                                { 
                                    translateY: addButtonAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, -8]
                                    }) 
                                }
                                ],
                            width: '100%'
                        }}
                    >
                        <TouchableOpacity
                            style={[
                                cmnstyle.bigButton,
                                {
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.23,
                                    shadowRadius: 2.62,
                                    elevation: 4,
                                }
                            ]}
                            onPress={() => navigation.navigate('FoodcreateprofileNotesEL')}
                            activeOpacity={0.7}
                        >
                            <Text style={cmnstyle.bigButtonText}>Add</Text>
                            <View style={{ position: 'absolute', top: 5, right: 5 }}>
                                <Image source={plusButton} style={cmnstyle.arrowButton} />
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>
            )}
        </View>
    )
};

export default FoodprofileNotes;