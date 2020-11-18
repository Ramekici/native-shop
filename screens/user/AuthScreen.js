import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { useDispatch } from 'react-redux';
import { View, StyleSheet, ScrollView,  Alert, Platform,
    KeyboardAvoidingView, ActivityIndicator, Button} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { LinearGradient } from 'expo-linear-gradient'

import HeaderButton from '../../components/UI/HeaderButton';
import * as authActions from '../../store/actions/auth';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';


const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
   
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

const AuthScreen = props => {
    const dispatch = useDispatch()
    const [signUp, setsignUp] = useState(false);
    const [isLoading, setisLoading] = useState(false);
    const [error, setError] = useState();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputVal : {
            email : '', 
            password : '', 
        },
        inputValidities: {
            email: false, 
            password: false, 
        },
        formIsValid: false
    })
    
    useEffect(()=> {
        if(error) {
            Alert.alert('Hatalı Giriş', error, [
                {text:'Okay', style:'default'},
            ])
        }
    },[error])

    const onChangeInputHandler = useCallback((inputIdentifier, inputValue, inputValidty) => {
        dispatchFormState({
            type:FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidty,
            input: inputIdentifier
        })
        
    },[dispatchFormState])

    const signUpHandler = async() => {
        let action;
        if(signUp) {
            action = authActions.signup(formState.inputVal.email, formState.inputVal.password)
        } else {
            action= authActions.signin(formState.inputVal.email, formState.inputVal.password)
        }
        setError(null);
        setisLoading(true);
        try{
            await dispatch(action);
            //props.navigation.navigate('Shop');//// Kontrol et
        } catch (error) {
            setError(error.message);
            setisLoading(false);
        }
        
    }


    return (
        <KeyboardAvoidingView  
            style={styles.screen} 
            behavior='padding' 
            keyboardVerticalOffset={20}>
            <LinearGradient colors={['gray', 'orange']} style={styles.gradient}>
                <Card style={styles.authContainer}>  
                    <ScrollView>
                        <View style={styles.form}>
                            <Input
                                name='email'
                                label= 'Email Adresi'
                                errorText= 'Email Adresini doğru giriniz'
                                onChangeInput = {onChangeInputHandler}
                                keyboardType='email-adresss'
                                required
                                initialValue=''
                            />
                            <Input
                                name='password'
                                label= 'Parola'
                                errorText= 'Parolayı doğru giriniz'
                                onChangeInput = {onChangeInputHandler}
                                keyboardType='default'
                                required
                                secureTextEntry
                                initialValue=''
                                autoCapitalize
                                minLength={5}
                            />
                            <View style={styles.buttonContainer}>
                                {isLoading ? <ActivityIndicator size='small' color={Colors.accent} /> : 
                                <Button 
                                    title={ signUp ? 'Kayıt Ol' : 'Giriş' } 
                                    color={Colors.primary}
                                    onPress={signUpHandler}/> }
                            </View>
                            <View style={styles.buttonContainer}>
                                <Button
                                    title={`${signUp ? 'Girişi Seç': 'Kayıtı Seç' }`}
                                    color={Colors.accent}
                                    onPress={() => setsignUp(prevS => !prevS)}/>
                            </View>
                        </View>
                    </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
        
    )
}

const styles = StyleSheet.create({
    screen:{
        flex:1,
    },
    gradient: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    authContainer:{
        width:'80%',
        maxWidth: 400,
        maxHeight: 400,
        padding:20
    },
    buttonContainer:{
        marginBottom:10
    }
})



export const screenOptions = navData => {

    return {
        headerTitle:'Üyelik',
        headerRight: () => ( 
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item title='Kaydet' 
                        iconName={Platform.OS === 'android' ? 'md-checkmark': 'ios-checkmark'}
                        onPress={()=> {}} />
                </HeaderButtons>)
    }
}

export default AuthScreen;