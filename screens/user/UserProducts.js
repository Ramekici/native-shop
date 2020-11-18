import React, {useCallback, useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {View, Text, FlatList, Button, Alert, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import { deleteProduct } from '../../store/actions/products';
import * as productActions from '../../store/actions/products';

const UserProductsScreen = props => {

    const userProducts = useSelector(state => state.products.userProducts)
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const editHandler = (id) => {
        props.navigation.navigate('Edit', {productId: id})
    }

    const loadProducts = useCallback(async () => {
        setError(null);
        try{
            await dispatch(productActions.fetchProducts());
        }catch(err){
            setError(err.message)
        }
    },[dispatch, setIsLoading, setError]);

    useEffect(()=> {
        setIsLoading(true);
        loadProducts().then(()=>{
            setIsLoading(false)
        });
    },[dispatch, loadProducts])

    

    const onDeleteHandler = (id) => {
        Alert.alert('Emin misiniz?', 'Ürünü gerçekten silmek istiyor musunuz', [
            {text:'Hayır', style:'default'},
            {text:'Evet', style:'destructive', onPress:()=> dispatch(deleteProduct(id)) }
        ])
    }
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

    if(!isLoading && userProducts.length === 0){
        return (
            <View style={styles.centered}>
                <Text>Herhangi Bir Ürün Yok </Text>
            </View>
        )
    }

    

    return (
        <FlatList
            data ={userProducts}
            keyExtractor={item => item.id}
            renderItem={itemData => 
                <ProductItem 
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect= {()=> editHandler(itemData.item.id)}       
                >
                    <Button color= {Colors.primary} title='Düzenle'
                        onPress = {()=> editHandler(itemData.item.id)}/>
                    <Button color= {Colors.accent} title='Sil' 
                        onPress = {onDeleteHandler.bind(this, itemData.item.id)}/>
                </ProductItem>
            }
        
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

export default UserProductsScreen;

export const screenOptions = navData => {
    return {
        headerTitle: 'Ürünlerim',
        headerLeft: () => ( 
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title='Menu' 
                    iconName={Platform.OS === 'android' ?  'md-menu': 'ios-menu'}
                    onPress={()=>{ navData.navigation.toggleDrawer()}} />
            </HeaderButtons>),
        headerRight: () => ( 
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title='Add' 
                    iconName={Platform.OS === 'android' ?  'md-create': 'ios-create'}
                    onPress={()=>{ navData.navigation.navigate('Edit')}} />
            </HeaderButtons>)
    }
}