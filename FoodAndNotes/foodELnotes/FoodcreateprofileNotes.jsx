import { useNavigation } from "@react-navigation/native"
import { useState, useEffect } from "react";
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    Image, 
    Animated,
    Alert 
} from "react-native";
import { cmnstyle, createForm, foodcard, texts } from "../foodcnsts/appstyles";
import { calendarSettings, emailSettings, smallPlusButton, backButton } from "../foodcnsts/appassts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchImageLibrary } from "react-native-image-picker";

const FoodcreateprofileNotes = ({ user }) => {
    const navigation = useNavigation();
    const [image, setImage] = useState(user?.image || null);
    const [name, setName] = useState(user?.name || '');
    const [surname, setSurname] = useState(user?.surname || '');
    const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || '');
    const [email, setEmail] = useState(user?.email || '');
    
    const [slideAnim] = useState(new Animated.Value(50));
    const [buttonScale] = useState(new Animated.Value(1));
    const [inputAnimations] = useState([
        new Animated.Value(50),
        new Animated.Value(50),
        new Animated.Value(50),
        new Animated.Value(50)
    ]);

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
        }).start();

        inputAnimations.forEach((anim, index) => {
            Animated.timing(anim, {
                toValue: 0,
                duration: 300,
                delay: 100 + (index * 100),
                useNativeDriver: true
            }).start();
        });
    }, []);

    const animateButton = () => {
        Animated.sequence([
            Animated.timing(buttonScale, {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true
            }),
            Animated.timing(buttonScale, {
                toValue: 1.1,
                duration: 100,
                useNativeDriver: true
            }),
            Animated.timing(buttonScale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true
            })
        ]).start();
    };

    const uploadUserImage = () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                quality: 0.8,
            },
            (response) => {
                if (response.didCancel) return;
                if (response.errorCode) {
                    Alert.alert('Image Picker Error', response.errorMessage);
                    return;
                }
                const uri = response.assets?.[0]?.uri;
                if (uri) setImage(uri);
            }
        );
    };

    const formatDate = (text) => {
        let cleaned = text.replace(/\D/g, '');
        
        let formatted = '';
        if (cleaned.length > 0) {
            formatted += cleaned.substring(0, 2);
            if (cleaned.length > 2) {
                formatted += '.' + cleaned.substring(2, 4);
                if (cleaned.length > 4) {
                    formatted += '.' + cleaned.substring(4, 8);
                }
            }
        }
        
        if (formatted.length > 10) {
            formatted = formatted.substring(0, 10);
        }
        
        setDateOfBirth(formatted);
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validateDate = (date) => {
        if (!date) return false;
        const parts = date.split('.');
        if (parts.length !== 3) return false;
        
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        
        if (isNaN(day)) return false;
        if (isNaN(month)) return false;
        if (isNaN(year)) return false;
        
        if (day < 1 || day > 31) return false;
        if (month < 1 || month > 12) return false;
        if (year < 1900 || year > new Date().getFullYear()) return false;
        
        return true;
    };

    const saveUserProfile = async () => {
        animateButton();

        if (!name.trim()) {
            Alert.alert("Validation Error", "Please enter your name");
            return;
        }

        if (!surname.trim()) {
            Alert.alert("Validation Error", "Please enter your surname");
            return;
        }

        if (!validateDate(dateOfBirth)) {
            Alert.alert("Validation Error", "Please enter a valid date of birth (dd.mm.yyyy)");
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert("Validation Error", "Please enter a valid email address");
            return;
        }

        const profileData = {
            image,
            name,
            surname,
            dateOfBirth,
            email
        };

        try {
            await AsyncStorage.setItem('USER_PROFILE_HOLLAND', JSON.stringify(profileData));
            Alert.alert("Success", "Profile saved locally!");
            navigation.goBack();
        } catch (error) {
            console.error("Storage Error:", error);
            Alert.alert("Error", "Failed to save profile");
        }
    };

    return (
        <View style={cmnstyle.container}>
            {/* Header */}
            <View style={[cmnstyle.row, { marginBottom: 20, width: '100%', justifyContent: 'space-between' }]}>
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
                            marginLeft: 10,
                            transform: [{ translateX: slideAnim }]
                        }
                    ]}>
                        {user ? 'Edit Profile' : 'Create Profile'}
                    </Animated.Text>
                </View>
                
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <TouchableOpacity onPress={saveUserProfile}>
                        <Text style={[texts.label, { color: '#FF00F0', marginBottom: 0, fontSize: 16 }]}>
                            Done
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>

            {/* Profile Image Upload */}
            <Animated.View style={{ transform: [{ translateX: inputAnimations[0] }] }}>
                <TouchableOpacity
                    style={[
                        createForm.uploadButton,
                        { alignSelf: 'center', borderWidth: 5, borderColor: '#FF00F0', marginBottom: 24, overflow: 'visible' }
                    ]}
                    onPress={uploadUserImage}
                >
                    {image ? (
                        <Image source={{ uri: image }} style={[createForm.dishImage, {borderRadius: 300}]} />
                    ) : (
                        <View style={createForm.dishImage} />
                    )}
                    <View style={{position: 'absolute', bottom: 0, right: 0}}>
                        <Image source={smallPlusButton} style={{ width: 32, height: 32, resizeMode: 'contain' }} />
                    </View>
                </TouchableOpacity>
            </Animated.View>

            {/* Form Inputs */}
            <View style={[foodcard.container, {paddingVertical: 28, paddingHorizontal: 12}]}>
                <Animated.View style={{ width: '100%', transform: [{ translateX: inputAnimations[0] }] }}>
                    <TextInput
                        style={[createForm.dishInput, { marginBottom: 8, backgroundColor: '#696969' }]}
                        value={name}
                        onChangeText={setName}
                        placeholder='Name'
                        placeholderTextColor='#303030'
                    />
                </Animated.View>

                <Animated.View style={{ width: '100%', transform: [{ translateX: inputAnimations[1] }] }}>
                    <TextInput
                        style={[createForm.dishInput, { marginBottom: 8, backgroundColor: '#696969' }]}
                        value={surname}
                        onChangeText={setSurname}
                        placeholder='Surname'
                        placeholderTextColor='#303030'
                    />
                </Animated.View>

                <Animated.View style={{width: '100%', transform: [{ translateX: inputAnimations[2] }]}}>
                    <View style={{position: 'absolute', top: 20, left: 20, zIndex: 1}}>
                        <Image source={calendarSettings} style={{width: 18, height: 20, resizeMode: 'contain'}} />
                    </View>
                    <TextInput
                        style={[createForm.dishInput, { marginBottom: 8, backgroundColor: '#696969', paddingLeft: 50 }]}
                        value={dateOfBirth}
                        onChangeText={formatDate}
                        placeholder='Date of Birth (dd.mm.yyyy)'
                        placeholderTextColor='#303030'
                        keyboardType="numeric"
                        maxLength={10}
                    />
                </Animated.View>

                <Animated.View style={{width: '100%', transform: [{ translateX: inputAnimations[3] }]}}>
                    <View style={{position: 'absolute', top: 20, left: 20, zIndex: 1}}>
                        <Image source={emailSettings} style={{width: 18, height: 20, resizeMode: 'contain'}} />
                    </View>
                    <TextInput
                        style={[createForm.dishInput, { marginBottom: 8, backgroundColor: '#696969', paddingLeft: 50 }]}
                        value={email}
                        onChangeText={setEmail}
                        placeholder='Email'
                        placeholderTextColor='#303030'
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </Animated.View>
            </View>
        </View>
    )
};

export default FoodcreateprofileNotes;