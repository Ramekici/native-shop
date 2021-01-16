import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { StyleSheet, ScrollView, Image, Text, View, Button, Platform} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import HeaderButton from '../../components/UI/HeaderButton';

import Colors from '../../constants/Colors';
import { addCart} from '../../store/actions/carts';

export default ProductsDetailScreen = props => {

    const {productId} = props.route.params;
    const selectedProduct = useSelector(state => 
            state.products.availableProducts.find(item => item.id === productId))


    const dispatch = useDispatch();

    return (
       <ScrollView>
            <Image style={styles.image} source={{uri: selectedProduct.imageUrl}} />
            <View style={styles.actions}>
                <Button 
                    color={Colors.primary} 
                    onPress= {()=>
                        dispatch(addCart(selectedProduct))}
                    title='Sepete Ekle'/>
            </View>
            <Text style={styles.price}> {selectedProduct.price} ₺ </Text>
            <Text style={styles.description}> {selectedProduct.description} </Text>
       </ScrollView>
        
    )
}

export const screenOptions = navData => {
    return {
        headerTitle: navData.route.params.productTitle,
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title='Sepet'
                    iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                    onPress={() => { navData.navigation.navigate('Cart') }} />
            </HeaderButtons>)  
    }
}

const styles = StyleSheet.create({
    image: {
        width:"100%",
        height:300
    },
    actions: {
        alignItems:'center',
        marginVertical:10
    },
    price:{
        fontSize:20,
        color: '#888',
        textAlign:'center',
        marginVertical:20,
        fontFamily: 'open-sans'
    },
    description: {
        fontSize:14,
        textAlign:'center',
        marginHorizontal:20,
        fontFamily: 'open-sans-bold'
    },
})



