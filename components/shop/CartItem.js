import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, 
    Platform, TouchableNativeFeedback, Button, Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const CartItem = (props) => {

    let TouchableCmp = TouchableOpacity;

    if(Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    return (
        <View style={styles.cartItem}>
            <View style={styles.itemData}>
                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={{uri: props.imageUrl}}/> 
                </View>
                <Text style={styles.mainText}> {props.title} </Text>
                <Text style={styles.quantity}> ({props.quantity}) </Text>
            </View>
            
            <View style={styles.itemData}>
                <Text style={styles.mainText}> {props.price} ₺ </Text>
                {props.deleteable && 
                <TouchableCmp onPress= {props.onRemove} style={styles.deleteButton} >
                    <Ionicons 
                        name={Platform.OS === 'android' ? 'md-trash': 'ios-trash'}
                        size={23}
                        color='red'/>
                </TouchableCmp>}
                <TouchableCmp onPress= {props.onDetail} style={styles.detailButton} >
                    <Ionicons 
                        name={Platform.OS === 'android' ? 'md-search': 'ios-search'}
                        size={23}
                        color='blue'/>
                </TouchableCmp>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    cartItem:{
        flex:1,
        padding:10,
        paddingBottom:20,
        backgroundColor:'white',
        flexDirection:'row',
        justifyContent:'space-between',
        marginHorizontal: 10
    },
    itemData:{
        flexDirection:'row',
        alignItems:'center'
    },
    quantity:{
        fontFamily:'open-sans',
        fontSize:16,
        color: '#888'
    },
    imageContainer:{
        width: 50,
        height: 50,
        borderRadius:5,
    },
    image: {
        width:"100%",
        height:"100%"
    },
    mainText:{
        fontFamily: 'open-sans-bold',
        fontSize:16,
        paddingLeft:5
    },
    deleteButton:{
        marginLeft:20
    },
    detailButton:{
        marginLeft:20
    },
})


export default CartItem;
