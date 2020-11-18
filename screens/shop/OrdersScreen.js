import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, FlatList, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import Colors from '../../constants/Colors';
import * as orderActions from '../../store/actions/orders';

const OrdersScreen = props => {
    
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const orders =  useSelector(state => state.orders.orders);
    
    useEffect(()=>{
        setIsLoading(true);
        dispatch(orderActions.fetchOrders()).then(
            ()=> {
                setIsLoading(false)
            }
        );
    }, [dispatch])

    if(isLoading){
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        )
    }

    if(orders.length === 0){
        return <View style={{flex:1, justifyContent: 'center', alignItems:'center'}}>
            <Text> Herhengi bir sipariş yok</Text>
        </View>
    }

    return (
        <FlatList 
            data={orders}
            keyExtractor={item => item.id}
            renderItem={itemData => 
            <OrderItem 
                amount={itemData.item.totalAmount}
                date={itemData.item.readableDate}
                items={itemData.item.items}/>} 
        />
        
    )
}

const styles = StyleSheet.create({
    centered: {
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    }
})

export default OrdersScreen;

export const screenOptions = navData =>  {
    return {
        headerTitle: 'Siparişlerim',
        headerLeft: () => ( 
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title='Menu' 
                    iconName={Platform.OS === 'android' ?  'md-menu': 'ios-menu'}
                    onPress={()=>{ navData.navigation.toggleDrawer()}} />
            </HeaderButtons>),
    }
    
}
