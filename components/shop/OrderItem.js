import React, { useState } from 'react';
import {View, Text, StyleSheet, Button } from 'react-native';

import Colors from '../../constants/Colors';
import CartItem from './CartItem';
import Card from '../UI/Card';

const OrderItem = props => {

    const [showDetail, setShowDetail] = useState(false);

    return (
        <Card style={styles.orderItem}>
            <View style={styles.summary}>
                <Text style={styles.totalAmount}> {props.amount.toFixed(2)} </Text>
                <Text style={styles.date}> {props.date} </Text>
            </View>
            <Button 
                color={Colors.primary} 
                title={showDetail ? 'Detayları Kapat':'Detayları Göster'}
                onPress={() => setShowDetail(prevState => !prevState)}
                />
            {showDetail &&
            <View style={styles.detailOrders}>
                {props.items.map(cartItem => {
                    <CartItem 
                        key={cartItem.productId}
                        quantity={cartItem.quantity}
                        amount={cartItem.sum}
                        title={cartItem.productTitle}
                    />
                })}
            </View>}
        </Card>
    )
}


const styles = StyleSheet.create({
    orderItem:{
        padding:10,
        margin: 20,
        alignItems:'center'
    },
    summary:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        width:'100%',
        marginBottom: 2
    },
    totalAmount:{
        fontFamily:'open-sans-bold',
        fontSize:16,
    },
    date:{
        fontFamily:'open-sans',
        fontSize:16,
        color: '#888'
    },
    detailOrders: {
        width:'100%'
    }
})


export default OrderItem;
