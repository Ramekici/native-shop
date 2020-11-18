import React, {useState, useEffect, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {View, Text, StyleSheet, FlatList, Button, 
    Platform, ActivityIndicator} from 'react-native';

import Colors from '../../constants/Colors';
import CartItem from '../../components/shop/CartItem';
import Card from '../../components/UI/Card';

import * as cartActions from '../../store/actions/carts';
import * as orderActions from '../../store/actions/orders';

const CartsScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const cartTotalAmaunt =  useSelector(state => state.cart.totalAmount);
    const dispatch =  useDispatch();
    const cartItems =  useSelector(state => state.cart.items)
    console.log(cartItems);


    //const cartItems = useSelector(state => {
    //    const transformedCartItems = [];
    //    for (const key in state.cart.items) {
    //        transformedCartItems.push({
    //            productId: key,
    //            productTitle: state.cart.items[key].productTitle,
    //            productPrice: state.cart.items[key].productPrice,
    //            quantity: state.cart.items[key].quantity,
    //            sum: state.cart.items[key].sum
    //        })
    //    }
    //    return transformedCartItems.sort((a,b) => a.productId > b.productId ? 1 : -1);
    //})

    const loadCart = useCallback(async () => {
        setError(null);
        try{
            await dispatch(cartActions.fetchCart());
        }catch(err){
            setError(err.message)
        }
    },[dispatch, setIsLoading, setError]);

    useEffect(()=> {
        setIsLoading(true);
        loadCart().then(()=>{
            setIsLoading(false)
        });
    },[dispatch, loadCart])

    const sendOrderHandler = async () =>{
        setIsLoading(true)
        await dispatch(orderActions.addOrder(cartItems, cartTotalAmaunt));
        setIsLoading(false)
    }

    if(error){
        return (
            <View style={styles.centered}>
                <Text> Hata Oluştu... </Text>
                <Button 
                title='Yeniden dene' 
                onPress={loadCart}/>
            </View>
        )
    }


    if(isLoading){
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        )
    }

    if(!isLoading && cartItems.length === 0){
        return (
            <View style={styles.centered}>
                <Text>Herhangi Bir Ürün Yok </Text>
            </View>
        )
    }

    //Math.round(cartTotalAmaunt.toFixed(2)*100)/100
    return (
        <View style={styles.screen}>
            <Card style={styles.summary}>
                <Text style={styles.summaryText}> Toplam :  
                    <Text style={styles.amount}> 
                    { Math.round(cartTotalAmaunt.toFixed(2)*100)/100} ₺
                    </Text> 
                </Text>
                {isLoading ? <ActivityIndicator size="large" color={Colors.primary} />  : 
                <Button
                    color={Colors.accent}
                    title='Ödeme'
                    disabled={cartItems.length === 0}
                    onPress={sendOrderHandler}/>
                }
            </Card>
            <FlatList 
                data={cartItems}
                keyExtractor={item => item.id}
                renderItem={itemData =>{
                    <CartItem
                        quantity={itemData.item.imageUrl}
                        price={itemData.item.price} 
                        title= {itemData.item.title}
                        amount={itemData.item.description}
                        deleteable
                        onRemove= {()=> { 
                            dispatch(cartActions.deleteProduct(itemData.item.productId))}}>

                        <Button color= {Colors.primary} title='İncele'
                         onPress = {()=> {}} />
                    </CartItem>
                    

                }} />
        </View>
        
    )
}



styles = StyleSheet.create({
    screen:{
        margin:20,
    },
    centered: {
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    summary:{
        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding:10,
    },
    summaryText:{
        fontFamily:'open-sans-bold',
        fontSize:18
    },
    amount:{
        color: Colors.accent,
        marginLeft:12
    }
})

export default CartsScreen;


export const screenOptions = navData =>  {
    return {
        headerTitle: 'Sepet'
    }
    
}