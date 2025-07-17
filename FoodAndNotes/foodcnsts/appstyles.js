import { StyleSheet, Dimensions, Platform } from "react-native";

const { height } = Dimensions.get('window');

const jost = Platform.OS === 'ios' ? 'Jost' : 'Jost-VariableFont';
const jost_italic = Platform.OS === 'ios' ? 'Jost-Italic' : 'Jost-Italic-VariableFont';
const mulish = Platform.OS === 'ios' ? 'Mulish' : 'Mulish-VariableFont';
const mulish_italic = Platform.OS === 'ios' ? 'Mulish-Italic' : 'Mulish-Italic-VariableFont';


export const cmnstyle = StyleSheet.create({

    container: {
        width: '100%',
        height: '100%',
        paddingHorizontal: 20,
        paddingTop: height * 0.08
    },

    arrowButton: {
        width: 50,
        height: 50,
        resizeMode: 'contain'
    },

    bigButton: {
        width: '100%',
        padding: 17,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        backgroundColor: '#FF00F0',
        zIndex: 10
    },

    bigButtonText: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: jost,
        color: '#fff'
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    noImage: {
        width: 200,
        height: height * 0.17,
        resizeMode: 'contain'
    },

    backIcon: {
        width: 32,
        height: 20,
        resizeMode: 'contain',
        marginRight: 20
    }

});


export const splash = StyleSheet.create({

    title: {
        fontSize: 50,
        fontWeight: '800',
        color: '#fff',
        lineHeight: 60,
        fontFamily: jost
    },

    decoration: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        top: -50,
        zIndex: -1,
    },

    decoration2: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 2,
        borderColor: 'rgba(84, 42, 84, 0.37)',
        bottom: -30,
        right: -30,
        zIndex: -1,
    },

    loaderContainer: {
        position: 'absolute',
        bottom: 120,
        width: 100,
        height: 100,
        alignSelf: 'center'
    },

    webview: {
        backgroundColor: 'transparent',
    }

});


export const texts = StyleSheet.create({

    label: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: jost,
        color: '#fff'
    },

    infoTitle: {
        fontSize: 24,
        fontWeight: '600',
        fontFamily: jost,
        color: '#FF00F0',
        marginBottom: 10,
        textAlign: 'center'
    },

    infoText: {
        fontSize: 14,
        fontWeight: '700',
        fontFamily: mulish,
        color: '#AAAAAA',
        textAlign: 'center'
    },

    bigTitle: {
        fontSize: 25,
        fontWeight: '600',
        fontFamily: jost,
        color: '#fff'
    }

});


export const foodcard = StyleSheet.create({

    container: {
        width: '100%',
        backgroundColor: '#303030',
        borderRadius: 20,
        overflow: 'hidden'
    },

    title: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: jost,
        color: '#fff',
        marginBottom: 8
    },

    types: {
        fontSize: 12,
        fontWeight: '800',
        fontFamily: mulish,
        color: '#AAAAAA'
    },

    description: {
        fontSize: 13,
        fontWeight: '400',
        fontFamily: mulish,
        color: '#A0A4AB'
    },

    image: {
        width: '100%',
        height: 134,
        resizeMode: 'cover'
    }


});


export const createForm = StyleSheet.create({

    uploadButton: {
        width: 156,
        height: 156,
        borderRadius: 300,
        backgroundColor: '#303030',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        marginBottom: 10
    },

    dishImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },

    dishImageHolder: {
        width: 77,
        height: 60,
        resizeMode: 'contain'
    },

    dishInput: {
        width: '100%',
        paddingVertical: 21,
        paddingHorizontal: 20,
        borderRadius: 54,
        backgroundColor: '#303030',
        marginBottom: 10,
        fontSize: 14,
        fontWeight: '700',
        fontFamily: mulish,
        color: '#fff'
    },

    categoryButton: {
        width: '100%',
        paddingVertical: 21,
        paddingHorizontal: 20,
        borderRadius: 54,
        backgroundColor: '#303030',
        marginBottom: 10,
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    categoryButtonText: {
        fontSize: 14,
        fontWeight: '700',
        fontFamily: mulish,
        color: '#fff'
    },

    inputArrow: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    },

    noteLabel: {
        fontSize: 16,
        fontWeight: '700',
        fontFamily: mulish,
        color: '#fff',
        marginBottom: 10
    },

    noteInput: {
        width: '100%',
        borderBottomColor: '#fff',
        borderBottomWidth: 1,
        paddingBottom: 5,
        fontSize: 14,
        fontWeight: '700',
        fontFamily: mulish,
        color: '#fff'
    }

});


export const readfood = StyleSheet.create({

    ingredientTitle: {
        fontSize: 16,
        fontWeight: '900',
        fontFamily: mulish,
        color: '#fff'
    },

    ingredientText: {
        fontSize: 15,
        fontWeight: '700',
        fontFamily: mulish,
        color: '#aaa'
    },

    description: {
        fontSize: 14,
        fontWeight: '700',
        fontFamily: mulish,
        color: '#fff'
    },

    upperpanel: {
        width: '100%',
        paddingTop: height * 0.08,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        position: 'absolute',
        top: 0,
        zIndex: 10
    },

    image: {
        width: '100%',
        height: 400,
        resizeMode: 'cover'
    },

    region: {
        fontSize: 12,
        fontWeight: '700',
        fontFamily: mulish,
        color: '#FF00F0',
        marginBottom: 8
    },

    title: {
        fontSize: 21,
        fontWeight: '600',
        fontFamily: jost,
        color: '#fff',
        marginBottom: 5
    },

    infoButton: {
        width: '100%',
        padding: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#AAAAAA'
    },

    infoButtonText: {
        fontSize: 15,
        fontWeight: '600',
        fontFamily: jost
    }

});


export const navig = StyleSheet.create({

    container: {
        width: '100%',
        height: 95,
        paddingBottom: 30,
        paddingHorizontal: 55,
        backgroundColor: '#303030',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },

    box: {
        width: 64,
        height: 64,
        backgroundColor: '#303030',
        borderRadius: 100,
        borderWidth: 6,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 13
    },

    icon: {
        width: 24,
        height: 24,
        resizeMode: 'contain'
    },

    name: {
        fontSize: 12,
        fontWeight: '400',
        fontFamily: mulish,
        color: '#303030',
        marginTop: 11
    }

});