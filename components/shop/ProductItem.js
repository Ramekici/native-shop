import React from 'react';
import {View, Text, Image, StyleSheet, 
    TouchableOpacity, Platform, TouchableNativeFeedback} from 'react-native';

import Card from '../UI/Card';

const ProductItem = (props) => {

    let TouchableCmp = TouchableOpacity;

    if(Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    return (
        <Card style={styles.product}>
            <View style={styles.touchable}>
                <TouchableCmp onPress= {props.onSelect} useForeground >
                    <View>
                        <View style={styles.imageContainer}>
                            <Image source={{uri: props.image}} style={styles.image}/>
                        </View>
                        <View style={styles.details}>
                            <Text  style={styles.title}> {props.title} </Text>
                            <Text style={styles.price}> {props.price} ₺</Text>
                        </View>
                        <View style={styles.actions} >
                            {props.children}         
                        </View>
                    </View>
                </TouchableCmp>
            </View>
        </Card>
    )
}


const styles = StyleSheet.create({
    product:{
        padding:10,
        margin: 20,
        height:300,
    },
    touchable: {
        borderRadius: 10,
        overflow:'hidden'
    },
    imageContainer: {
        width:"100%",
        height:'60%',
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        overflow:'hidden'
    },
    image: {
        width:"100%",
        height:'100%'
    },
    details: {
        alignItems: 'center',
        height:'18%',
        padding:10
    },
    title: {
        fontSize:18,
        marginVertical:2,
        fontFamily: 'open-sans-bold'
    },
    price:{
        fontFamily: 'open-sans',
        fontSize:14,
        color: '#888'
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
        height:'22%',
        paddingHorizontal:20
    }
})


export default ProductItem;
