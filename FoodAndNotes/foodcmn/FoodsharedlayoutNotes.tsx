import React, { ReactNode } from 'react';
import { ImageBackground, View, ImageSourcePropType, Dimensions } from 'react-native';
import { foodBckgrnd } from '../foodcnsts/appassts';
import FoodnavigNotes from './FoodnavigNotes';

const { width } = Dimensions.get('window');

interface FoodsharedlayoutNotesProps {
    el: ReactNode;
    navig?: boolean;
    backgroundImage?: ImageSourcePropType;
}

const FoodsharedlayoutNotes: React.FC<FoodsharedlayoutNotesProps> = ({ 
    el, 
    navig = false,
    backgroundImage = foodBckgrnd
}) => {
    
    return (
        <ImageBackground 
            source={backgroundImage} 
            style={{ flex: 1 }}
            resizeMode="cover"
        >
            <View style={{flex: 1}}>
                {el}
            </View>

            {navig && (
                <View style={{width: width, position: 'absolute', bottom: 0, zIndex: 12}}>
                    <FoodnavigNotes />
                </View>
            )}
        </ImageBackground>
    );
};

export default FoodsharedlayoutNotes;