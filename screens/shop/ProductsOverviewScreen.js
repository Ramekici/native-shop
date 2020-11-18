import React, {useEffect, useState, useCallback} from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { View, StyleSheet, FlatList, Text, Platform, Button, ActivityIndicator} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import HeaderButton from '../../components/UI/HeaderButton';

import { addCart } from '../../store/actions/carts';

import ProductItem from '../../components/shop/ProductItem';
import Colors from '../../constants/Colors';
import * as productActions from '../../store/actions/products';


export default ProductsOverviewScreen = props => {

    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();

    const onSelectHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', {
            productId: id,
            productTitle: title})
    }

    const loadProducts = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try{
            await dispatch(productActions.fetchProducts());
        }catch(err){
            setError(err.message)
        }
        setIsRefreshing(false);
    },[dispatch, setIsRefreshing, setError]);


    useEffect(() => {
        const unsubscribe = props.navigation.addListener(
            'focus',
            loadProducts
        );
        return () => {
            unsubscribe();
        }
    }, [loadProducts]);



    useEffect(()=> {
        setIsLoading(true);
        loadProducts().then(()=>{
            setIsLoading(false)
        });
    },[dispatch, loadProducts])


    if(error){
        return (
            <View style={styles.centered}>
                <Text> Hata Oluştu... </Text>
                <Button 
                title='Yeniden dene' 
                onPress={loadProducts}/>
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

    if(!isLoading && products.length === 0){
        return (
            <View style={styles.centered}>
                <Text>Herhangi Bir Ürün Yok </Text>
            </View>
        )
    }

    return (
        <FlatList
            onRefresh={loadProducts}
            refreshing = {isRefreshing}
            data= {products}
            keyExtractor={item => item.id}
            renderItem={ itemData => 
                <ProductItem 
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect = {()=> onSelectHandler(itemData.item.id,
                        itemData.item.title)}
                >
                    <Button color= {Colors.primary} title='İncele'
                         onPress = {()=> onSelectHandler(itemData.item.id,
                            itemData.item.title)} />
                    <Button color= {Colors.accent} title='Sepete Ekle' 
                        onPress = {() => 
                        dispatch(addCart(itemData.item.id, 
                            itemData.item.title, 
                            itemData.item.price,
                            itemData.item.imageUrl,
                            itemData.item.description
                         )) }/>
                </ProductItem>}
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


export const screenOptions = navData => {
    return {
        headerTitle: 'All Products',
        headerLeft: () => ( 
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title='Menu' 
                    iconName={Platform.OS === 'android' ?  'md-menu': 'ios-menu'}
                    onPress={()=>{ navData.navigation.toggleDrawer()}} />
            </HeaderButtons>),
        headerRight: () => ( 
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                        <Item title='Sepet' 
                        iconName={Platform.OS === 'android' ?  'md-cart': 'ios-cart'}
                        onPress={()=>{ navData.navigation.navigate('Cart')}} />
                </HeaderButtons>)
    }
}