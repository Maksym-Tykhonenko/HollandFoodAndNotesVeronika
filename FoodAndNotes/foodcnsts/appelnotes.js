import FoodsharedlayoutNotes from "../foodcmn/FoodsharedlayoutNotes";

import FoodsplashNotes from "../foodELnotes/FoodsplashNotes";
import FoodinfoNotes from "../foodELnotes/FoodinfoNotes";
import FoodhomeNotes from "../foodELnotes/FoodhomeNotes";
import FooddutchrecipesNotes from "../foodELnotes/FooddutchrecipesNotes";
import FoodnewsNotes from "../foodELnotes/FoodnewsNotes";
import FoodmyrecipesNotes from "../foodELnotes/FoodmyrecipesNotes";
import FoodcreaterecipeNotes from "../foodELnotes/FoodcreaterecipeNotes";
import FoodreaddutchrecipeNotes from "../foodELnotes/FoodreaddutchrecipeNotes";
import FoodreadmyrecipeNotes from "../foodELnotes/FoodreadmyrecipeNotes";
import FoodreadnewsNotes from "../foodELnotes/FoodreadnewsNotes";
import FoodcaloriesNotes from "../foodELnotes/FoodcaloriesNotes";
import FoodreadcaloriesNotes from "../foodELnotes/FoodreadcaloriesNotes";
import FoodcreatecaloriesNotes from "../foodELnotes/FoodcreatecaloriesNotes";
import FoodnotesNotes from "../foodELnotes/FoodnotesNotes";
import FoodcreatenoteNotes from "../foodELnotes/FoodcreatenoteNotes";
import FoodprofileNotes from "../foodELnotes/FoodprofileNotes";
import FoodcreateprofileNotes from "../foodELnotes/FoodcreateprofileNotes";

export const FoodsplashNotesEL = () => {
    return (
        <FoodsharedlayoutNotes el={<FoodsplashNotes />} />
    )
};

export const FoodinfoNotesEL = () => {
    return (
        <FoodsharedlayoutNotes el={<FoodinfoNotes />} />
    )
};

export const FoodhomeNotesEL = () => {
    return (
        <FoodsharedlayoutNotes
            el={<FoodhomeNotes />}
            navig
        />
    )
};

export const FooddutchrecipesNotesEL = () => {
    return (
        <FoodsharedlayoutNotes el={<FooddutchrecipesNotes />} />
    )
};

export const FoodnewsNotesEL = () => {
    return (
        <FoodsharedlayoutNotes el={<FoodnewsNotes />} />
    )
};

export const FoodmyrecipesNotesEL = () => {
    return (
        <FoodsharedlayoutNotes el={<FoodmyrecipesNotes />} />
    )
};

export const FoodcreaterecipeNotesEL = ({ route }) => {
    const { recipe } = route.params || {};

    return (
        <FoodsharedlayoutNotes el={<FoodcreaterecipeNotes recipe={recipe} />} />
    )
};

export const FoodreaddutchrecipeNotesEL = ({ route }) => {
    const { recipe } = route.params;

    return (
        <FoodsharedlayoutNotes el={<FoodreaddutchrecipeNotes recipe={recipe} />} />
    )
};

export const FoodreadmyrecipeNotesEL = ({ route }) => {
    const { recipe } = route.params;

    return (
        <FoodsharedlayoutNotes el={<FoodreadmyrecipeNotes recipe={recipe} />} />
    )
};

export const FoodreadnewsNotesEL = ({ route }) => {
    const { item } = route.params;

    return (
        <FoodsharedlayoutNotes el={<FoodreadnewsNotes item={item} />} />
    )
};


export const FoodcaloriesNotesEL = () => {
    return (
        <FoodsharedlayoutNotes
            el={<FoodcaloriesNotes />}
            navig
        />
    )
};

export const FoodreadcaloriesNotesEL = ({ route }) => {
    const { entry } = route.params;

    return (
        <FoodsharedlayoutNotes el={<FoodreadcaloriesNotes entry={entry} />} />
    )
};

export const FoodcreatecaloriesNotesEL = ({ route }) => {
    const { entry } = route.params || {};

    return (
        <FoodsharedlayoutNotes el={<FoodcreatecaloriesNotes entry={entry} />} />
    )
};


export const FoodnotesNotesEL = () => {
    return (
        <FoodsharedlayoutNotes
            el={<FoodnotesNotes />}
            navig
        />
    )
};


export const FoodcreatenoteNotesEL = ({ route }) => {
    const { note } = route.params || {};

    return (
        <FoodsharedlayoutNotes el={<FoodcreatenoteNotes note={note} />} />
    )
};


export const FoodprofileNotesEL = () => {
    return (
        <FoodsharedlayoutNotes
            el={<FoodprofileNotes />}
            navig
        />
    )
};


export const FoodcreateprofileNotesEL = ({ route }) => {
    const { user } = route.params || {};

    return (
        <FoodsharedlayoutNotes el={<FoodcreateprofileNotes user={user} />} />
    )
};