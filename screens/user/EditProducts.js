import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, StyleSheet, ScrollView,  Alert,
     KeyboardAvoidingView, Platform, ActivityIndicator} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';

import * as productActions from '../../store/actions/products';
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';

const FORM_INPUT_UPDATE =  'FORM_INPUT_UPDATE';

const formReducer = (state, action ) => {
    if(action.type === FORM_INPUT_UPDATE){
        const updatedValues = {
            ...state.inputVal,
            [action.input]: action.value
        }
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        }
        let updatedFormIsValid = true;
        for(const key in updatedValidities){
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key]
        }
        return {
            inputVal: updatedValues,
            inputValidities: updatedValidities,
            formIsValid: updatedFormIsValid
        }
    } 
    return state;

}

const EditProducts = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError]= useState();

    const dispatch = useDispatch()
    const productId = props.route.params ? props.route.params.productId : null;
    
    const editProduct = useSelector(state => 
        state.products.userProducts.find(prod => prod.id === productId));

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputVal : {
            title:editProduct ? editProduct.title : '', 
            imageUrl:editProduct? editProduct.imageUrl : '', 
            price:editProduct ? editProduct.price : '', 
            description:editProduct ? editProduct.description : ''
        },
        inputValidities: {
            title:editProduct ? true: false, 
            imageUrl:editProduct? true: false, 
            price:editProduct ? true: false, 
            description:editProduct ? true: false
        },
        formIsValid: editProduct ? true: false
    })
    
    const onChangeInputHandler = useCallback((inputIdentifier, inputValue, inputValidty) => {
        dispatchFormState({
            type:FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidty,
            input: inputIdentifier
        }) 
    },[dispatchFormState])

    useEffect(()=>{
        if(error) {
            Alert.alert('Bir hata oluştu', error, [{text:'Okay'},])
        }
    }, [error])

    const submitHandler = useCallback(async () => {
        if(!formState.formIsValid){
            Alert.alert('Hatalı Giriş', 'Hatalı değer girdiniz', [{text:'Okay', style:'default'},])
            return;
        }
        setError(null);
        setIsLoading(true)
        try{
            if(editProduct){
                await dispatch(productActions.updateProduct(
                    productId, 
                    formState.inputVal.title,
                    formState.inputVal.description,
                    formState.inputVal.imageUrl,
                    ))
            } else {
                await dispatch(productActions.createProduct(
                    formState.inputVal.title,
                    formState.inputVal.description,
                    formState.inputVal.imageUrl,
                    formState.inputVal.price,
                ))  
            }
            props.navigation.goBack();
        }catch(err){
            setError(err.message)
        }
        setIsLoading(false);
        
    },[dispatch, productId, formState])

    useEffect(()=> 
        props.navigation.setOptions({
            headerRight: () => ( 
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item title='Kaydet' 
                        iconName={Platform.OS === 'android' ?  'md-checkmark': 'ios-checkmark'}
                        onPress={submitHandler} />
                </HeaderButtons>)
        })
    ,[submitHandler]);

    if(isLoading){
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        )
    }

    return (
        <KeyboardAvoidingView  style={{flex:1}} 
        behavior='padding' 
        keyboardVerticalOffset={100}>
        <ScrollView>
            <View style={styles.form}>
                <Input
                    name='title'
                    label= 'Marka'
                    errorText= 'Markayı doğru giriniz'
                    onChangeInput = {onChangeInputHandler}
                    keyboardType='default'
                    autoCapitilize='sentences'
                    returnKeyType='next'
                    initialValue= {editProduct ? editProduct.title : ''}
                    initialValid= {!!editProduct}
                    required
                />
                <Input
                    name='price'
                    label= 'Fiyat'
                    errorText= 'Fiyatı doğru giriniz'
                    onChangeInput = {onChangeInputHandler}
                    keyboardType='decimal-pad'
                    required
                    min={0.1}       
                />
                <Input
                    name='imageUrl'
                    label= 'İmage'
                    initialValue= {editProduct ? editProduct.imageUrl : ''}
                    errorText= 'Fotoğrafı doğru giriniz'
                    onChangeInput = {onChangeInputHandler}
                    keyboardType='default'
                    required
                />
                <Input
                    name='description'
                    label= 'Açıklama'
                    errorText= 'Açıklamayı doğru giriniz'
                    initialValue= {editProduct ? editProduct.description : ''}
                    onChangeInput = {onChangeInputHandler}
                    keyboardType='default'
                    numberOfLines={3}
                    multiline
                    required
                />
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
        
    )
}

const styles = StyleSheet.create({
    form:{
        margin:20,
    },
    centered: {
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    }
})



export const screenOptions = navData => {
    const routeParams = navData.route.params ? navData.route.params : {};
    return {
        headerTitle: routeParams.productId ? 'Düzenle': 'Ürün Ekle'
    }
}

export default EditProducts;