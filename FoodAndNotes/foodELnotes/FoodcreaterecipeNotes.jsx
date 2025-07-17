import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, Animated, Easing, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchImageLibrary } from "react-native-image-picker";
import { useState, useEffect, useRef } from "react";
import { cmnstyle, createForm, texts } from "../foodcnsts/appstyles";
import { arrowInput, backButton, plusButton, profilecameraInfo, trashButton } from "../foodcnsts/appassts";

const categories = ['Soups', 'Snacks', 'Main dishes', 'Salads', 'Desserts', 'Drinks'];
const difficulties = ['Easy', 'Medium', 'Hard'];

const FoodcreaterecipeNotes = ({ recipe: existingRecipe }) => {
    const navigation = useNavigation();
    const [currentCase, setCurrentCase] = useState(0);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    const [image, setImage] = useState(existingRecipe?.image_name?.uri || null);
    const [name, setName] = useState(existingRecipe?.title || '');
    const [kitchenType, setKitchenType] = useState(existingRecipe?.kitchen_type || '');
    const [cookingTime, setCookingTime] = useState(existingRecipe?.preparation_time?.toString() || '');
    const [dishCategory, setDishCategory] = useState(existingRecipe?.dish_type || '');
    const [difficultyLevel, setDifficultyLevel] = useState(existingRecipe?.difficulty_level || '');
    const [description, setDescription] = useState(existingRecipe?.description || '');
    const [ingredients, setIngredients] = useState(
        existingRecipe?.ingredients?.length > 0 
            ? existingRecipe.ingredients 
            : [{ title: '', quantity: '' }]
    );
    const [cookingSteps, setCookingSteps] = useState(
        existingRecipe?.preparation_method?.length > 0 
            ? existingRecipe.preparation_method.map((step, idx) => ({ ...step, step: idx + 1 }))
            : [{ step: 1, description: '' }]
    );

    const [dishCategoryOpen, setDishCategoryOpen] = useState(false);
    const [difficultyLevelOpen, setDifficultyLevelOpen] = useState(false);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const uploadDishImage = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: 0.8,
            });
            if (!result.didCancel && result.assets?.[0]?.uri) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Image picker error:', error);
        }
    };

    const validateCurrentStep = () => {
        if (currentCase === 0) {
            if (!image) return 'Please upload a recipe image';
            if (!name.trim()) return 'Please enter recipe name';
            if (!kitchenType.trim()) return 'Please enter kitchen type';
            if (!cookingTime.trim()) return 'Please enter cooking time';
            if (!dishCategory) return 'Please select dish category';
            if (!difficultyLevel) return 'Please select difficulty level';
            if (!description.trim()) return 'Please enter description';
        } else if (currentCase === 1) {
            const hasValidIngredients = ingredients.some(ing => ing.title.trim() && ing.quantity.trim());
            if (!hasValidIngredients) return 'Please add at least one ingredient';
        } else if (currentCase === 2) {
            const hasValidSteps = cookingSteps.some(step => step.description.trim());
            if (!hasValidSteps) return 'Please add at least one cooking step';
        }
        return null;
    };

    const handlePreviousStep = () => {
        if (currentCase > 0) {
            setCurrentCase(prev => prev - 1);
        } else {
            navigation.goBack();
        }
    };

    const handleNextStep = () => {
        const validationError = validateCurrentStep();
        if (validationError) {
            Alert.alert('Missing Information', validationError);
            return;
        }

        if (currentCase < 2) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: -30,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start(() => {
                setCurrentCase(prev => prev + 1);
                fadeAnim.setValue(0);
                slideAnim.setValue(30);
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    })
                ]).start();
            });
        } else {
            handleSaveRecipe();
        }
    };

    const handleCreateNewIngredient = () => {
        setIngredients([...ingredients, { title: '', quantity: '' }]);
    };

    const handleCreateNewStep = () => {
        setCookingSteps([...cookingSteps, { step: cookingSteps.length + 1, description: '' }]);
    };

    const handleDeleteIngredient = (index) => {
        if (ingredients.length <= 1) return;
        
        Alert.alert(
            'Delete Ingredient',
            'Are you sure you want to delete this ingredient?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Delete', 
                    onPress: () => {
                        const newIngredients = [...ingredients];
                        newIngredients.splice(index, 1);
                        setIngredients(newIngredients);
                    } 
                }
            ]
        );
    };

    const handleDeleteStep = (index) => {
        if (cookingSteps.length <= 1) return;
        
        Alert.alert(
            'Delete Step',
            'Are you sure you want to delete this step?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Delete', 
                    onPress: () => {
                        const newSteps = [...cookingSteps];
                        newSteps.splice(index, 1);
                        setCookingSteps(newSteps.map((step, idx) => ({ ...step, step: idx + 1 })));
                    } 
                }
            ]
        );
    };

    const handleUpdateIngredient = (index, field, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index][field] = value;
        setIngredients(newIngredients);
    };

    const handleUpdateStep = (index, value) => {
        const newSteps = [...cookingSteps];
        newSteps[index].description = value;
        setCookingSteps(newSteps);
    };

    const handleSaveRecipe = async () => {
        const validationError = validateCurrentStep();
        if (validationError) {
            Alert.alert('Missing Information', validationError);
            return;
        }

        const filteredIngredients = ingredients.filter(ing => ing.title.trim() && ing.quantity.trim());
        const filteredSteps = cookingSteps.filter(step => step.description.trim());

        const recipeData = {
            id: existingRecipe?.id || Date.now(),
            image_name: { uri: image },
            title: name.trim(),
            kitchen_type: kitchenType.trim(),
            preparation_time: parseInt(cookingTime) || 0,
            dish_type: dishCategory,
            difficulty_level: difficultyLevel,
            description: description.trim(),
            ingredients: filteredIngredients,
            preparation_method: filteredSteps
        };

        try {
            const existingRecipes = await AsyncStorage.getItem('MY_RECIPES_DUTCH');
            let recipes = existingRecipes ? JSON.parse(existingRecipes) : [];
            
            if (existingRecipe) {
                recipes = recipes.map(recipe => 
                    recipe.id === existingRecipe.id ? recipeData : recipe
                );
            } else {
                recipes = [...recipes, recipeData];
            }

            await AsyncStorage.setItem('MY_RECIPES_DUTCH', JSON.stringify(recipes));
            navigation.navigate('FoodmyrecipesNotesEL');
        } catch (error) {
            console.error('Error saving recipe:', error);
            Alert.alert('Error', 'Failed to save recipe');
        }
    };

    const renderStepIndicator = () => (
        <View style={[cmnstyle.row, { justifyContent: 'center', marginVertical: 16 }]}>
            {[0, 1, 2].map((step) => (
                <View
                    key={step}
                    style={{
                        width:  currentCase === step ? 13 : 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: currentCase === step ? '#FF00F0' : '#696969',
                        marginHorizontal: 4
                    }}
                />
            ))}
        </View>
    );

    return (
        <Animated.View style={[cmnstyle.container, { opacity: fadeAnim }]}>

            <View style={[cmnstyle.row, { marginBottom: 20, width: '100%', justifyContent: 'space-between' }]}>
                <View style={cmnstyle.row}>
                    <TouchableOpacity
                        onPress={handlePreviousStep}
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
                        {existingRecipe ? 'Edit recipe' : 'Create recipe'}
                    </Animated.Text>
                </View>
                
                <TouchableOpacity onPress={handleNextStep}>
                    <Text style={[texts.label, { color: '#FF00F0', marginBottom: 0, fontSize: 16 }]}>
                        {currentCase < 2 ? 'Next' : 'Save'}
                    </Text>
                </TouchableOpacity>
            </View>

            {renderStepIndicator()}

            <Animated.View style={{ 
                flex: 1,
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }]
            }}>
                {currentCase === 0 && (
                    <ScrollView style={{ width: '100%' }}>
                        <TouchableOpacity
                            style={createForm.uploadButton}
                            onPress={uploadDishImage}
                        >
                            <Image
                                source={image ? { uri: image } : profilecameraInfo}
                                style={[image ? createForm.dishImage : createForm.dishImageHolder]}
                            />
                        </TouchableOpacity>

                        <TextInput
                            style={createForm.dishInput}
                            value={name}
                            onChangeText={setName}
                            placeholder='The name of the recipe'
                            placeholderTextColor='#696969'
                        />

                        <TextInput
                            style={createForm.dishInput}
                            value={kitchenType}
                            onChangeText={setKitchenType}
                            placeholder='Type of kitchen'
                            placeholderTextColor='#696969'
                        />

                        <TextInput
                            style={createForm.dishInput}
                            value={cookingTime}
                            onChangeText={setCookingTime}
                            placeholder='Cooking time (in minutes)'
                            placeholderTextColor='#696969'
                            keyboardType="numeric"
                        />

                        <TouchableOpacity
                            style={createForm.categoryButton}
                            onPress={() => setDishCategoryOpen(prev => !prev)}
                        >
                            <Text style={createForm.categoryButtonText}>
                                {dishCategory || 'Category of the dish'}
                            </Text>
                            <Image
                                source={arrowInput}
                                style={[createForm.inputArrow, dishCategoryOpen && { transform: [{ rotate: '180deg' }] }]}
                            />
                        </TouchableOpacity>

                        {dishCategoryOpen && categories.map((cat, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={[
                                    createForm.categoryButton,
                                    dishCategory === cat && { borderColor: '#FF00F0', borderWidth: 4 }
                                ]}
                                onPress={() => setDishCategory(cat)}
                            >
                                <Text style={createForm.categoryButtonText}>{cat}</Text>
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity
                            style={createForm.categoryButton}
                            onPress={() => setDifficultyLevelOpen(prev => !prev)}
                        >
                            <Text style={createForm.categoryButtonText}>
                                {difficultyLevel || 'Difficulty level'}
                            </Text>
                            <Image
                                source={arrowInput}
                                style={[createForm.inputArrow, difficultyLevelOpen && { transform: [{ rotate: '180deg' }] }]}
                            />
                        </TouchableOpacity>

                        {difficultyLevelOpen && difficulties.map((level, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={[
                                    createForm.categoryButton,
                                    difficultyLevel === level && { borderColor: '#FF00F0', borderWidth: 4 },
                                ]}
                                onPress={() => setDifficultyLevel(level)}
                            >
                                <Text style={createForm.categoryButtonText}>{level}</Text>
                            </TouchableOpacity>
                        ))}

                        <TextInput
                            style={[createForm.dishInput, { minHeight: 230, borderRadius: 35 }]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder='Description'
                            placeholderTextColor='#696969'
                            multiline
                        />

                        <View style={{ height: 150 }} />
                    </ScrollView>
                )}

                {currentCase === 1 && (
                    <ScrollView style={{ width: '100%' }}>
                        <Text style={[texts.label, { marginBottom: 12 }]}>Ingredients</Text>
                        
                        {ingredients.map((ingredient, index) => (
                            <Animated.View 
                                key={index}
                                style={[
                                    createForm.categoryButton, 
                                    { 
                                        marginBottom: 16,
                                        opacity: fadeAnim,
                                        transform: [{
                                            translateX: slideAnim.interpolate({
                                                inputRange: [0, 30],
                                                outputRange: [0, 30 - (index * 5)]
                                            })
                                        }],
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        borderRadius: 35
                                    },
                                    index > 0 && {paddingRight: 40}
                                ]}
                            >
                                <TextInput
                                    style={[createForm.dishInput, { marginBottom: 8, backgroundColor: '#696969' }]}
                                    value={ingredient.title}
                                    onChangeText={(text) => handleUpdateIngredient(index, 'title', text)}
                                    placeholder='Ingredient name'
                                    placeholderTextColor='#303030'
                                />
                                <TextInput
                                    style={[createForm.dishInput, {backgroundColor: '#696969'}]}
                                    value={ingredient.quantity}
                                    onChangeText={(text) => handleUpdateIngredient(index, 'quantity', text)}
                                    placeholder='Quantity'
                                    placeholderTextColor='#303030'
                                />
                                {index > 0 && (
                                    <TouchableOpacity
                                        style={{
                                            position: 'absolute',
                                            right: 10,
                                            top: '47%'
                                        }}
                                        onPress={() => handleDeleteIngredient(index)}
                                    >
                                        <Image source={trashButton} style={{width: 25, height: 32, resizeMode: 'contain'}} />
                                    </TouchableOpacity>
                                )}
                            </Animated.View>
                        ))}

                        <TouchableOpacity
                            style={[cmnstyle.bigButton, { marginTop: 16 }]}
                            onPress={handleCreateNewIngredient}
                        >
                            <Text style={cmnstyle.bigButtonText}>Add</Text>
                            <View style={{ position: 'absolute', top: 5, right: 5 }}>
                                <Image source={plusButton} style={cmnstyle.arrowButton} />
                            </View>
                        </TouchableOpacity>

                        <View style={{ height: 100 }} />
                    </ScrollView>
                )}

                {currentCase === 2 && (
                    <ScrollView style={{ width: '100%' }}>
                        <Text style={[texts.label, { marginBottom: 12 }]}>Cooking Steps</Text>
                        
                        {cookingSteps.map((step, index) => (
                            <Animated.View 
                                key={index}
                                style={[
                                    createForm.categoryButton, 
                                    { 
                                        marginBottom: 16,
                                        opacity: fadeAnim,
                                        transform: [{
                                            translateX: slideAnim.interpolate({
                                                inputRange: [0, 30],
                                                outputRange: [0, 30 - (index * 5)]
                                            })
                                        }],
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        borderRadius: 35
                                    },
                                    index > 0 && {paddingRight: 40}
                                ]}
                            >
                                <Text style={[texts.label, { marginBottom: 8 }]}>Step {step.step}</Text>
                                <TextInput
                                    style={[createForm.dishInput, { minHeight: 116, borderRadius: 23, backgroundColor: '#696969' }]}
                                    value={step.description}
                                    onChangeText={(text) => handleUpdateStep(index, text)}
                                    placeholder='Step description'
                                    placeholderTextColor='#303030'
                                    multiline
                                />
                                {index > 0 && (
                                    <TouchableOpacity
                                        style={{
                                            position: 'absolute',
                                            right: 15,
                                            top: 18
                                        }}
                                        onPress={() => handleDeleteStep(index)}
                                    >
                                        <Image source={trashButton} style={{width: 25, height: 32, resizeMode: 'contain'}} />
                                    </TouchableOpacity>
                                )}
                            </Animated.View>
                        ))}

                        <TouchableOpacity
                            style={[cmnstyle.bigButton, { marginTop: 16 }]}
                            onPress={handleCreateNewStep}
                        >
                            <Text style={cmnstyle.bigButtonText}>Add</Text>
                            <View style={{ position: 'absolute', top: 5, right: 5 }}>
                                <Image source={plusButton} style={cmnstyle.arrowButton} />
                            </View>
                        </TouchableOpacity>

                        <View style={{ height: 100 }} />
                    </ScrollView>
                )}
            </Animated.View>
        </Animated.View>
    )
};

export default FoodcreaterecipeNotes;