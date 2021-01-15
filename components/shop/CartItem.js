import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform, TouchableNativeFeedback} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const CartItem = (props) => {

    let TouchableCmp = TouchableOpacity;

    if(Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    return (
        <View style={styles.cartItem}>
            <View style={styles.itemData}>
                <Text style={styles.quantity}> {props.quantity} </Text>
                <Text style={styles.mainText}> {props.title} </Text>
            </View>
            <View style={styles.itemData}>
                <Text style={styles.mainText}> {props.price} ₺ </Text>
                {props.deleteable && 
                <TouchableCmp onPress= {props.onRemove} style={styles.deleteButton} >
                    <Ionicons 
                        name={Platform.OS === 'android' ?  'md-trash': 'ios-trash'}
                        size={23}
                        color='red' />
                </TouchableCmp>}
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    cartItem:{
        flex:1,
        padding:10,
        backgroundColor:'white',
        flexDirection:'row',
        justifyContent:'space-between',
        marginHorizontal: 20
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
    mainText:{
        fontFamily: 'open-sans-bold',
        fontSize:16
    },
    deleteButton:{
        marginLeft:20
    },
})


export default CartItem;
