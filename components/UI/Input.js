import React, {useReducer, useEffect} from 'react'
import { View, StyleSheet, Text, TextInput} from 'react-native';


const INPUT_CHANGE = 'INPUT_CHANGE';
const INPUT_BLUR = 'INPUT_BLUR';


const inputReducer =(state, action) => {
    switch(action.type){
        case INPUT_CHANGE:
            return{
                ...state,
                value: action.value,
                isValid: action.isValid
            }
        case INPUT_BLUR:
            return{
                ...state,
                touched: true
            }
        default:
            return state;
        }
};

const Input = (props) => {

    const [inputState, dispatchInputState] = useReducer(inputReducer, {
        value: props.initialValue ? props.initialValue : '',
        isValid: props.initialValid ? props.initialValid : false,
        touched: false
    })

    const {onChangeInput, name } = props;
    
    useEffect(() => {
        if(inputState.touched){
          onChangeInput(name,inputState.value, inputState.isValid)
        }
    }, [onChangeInput, inputState, name])

    const onChangeHandler = text => {

        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        let isValid = true;
        if(props.required && text.trim().length === 0) {
            isValid = false;
        }
        if(props.email && !emailRegex.test(text.toLowerCase())) {
            isValid = false;
        }
        if(props.min != null && +text < props.min) {
            isValid = false;
        }
        if(props.max != null && +text > props.max) {
            isValid = false;
        }
        if(props.minLength != null && text.length < props.minLgth) {
            isValid = false;
        }

        dispatchInputState({
            type: INPUT_CHANGE,
            value: text,
            isValid: isValid
        })
    }

    const lostFocusHandler = () => {
        dispatchInputState({
            type: INPUT_BLUR
        })
    }

    return (
        <View style={styles.formControl}>
            <Text style={styles.label}> {props.label} </Text>
            <TextInput
                {...props}     
                style={styles.input}
                value={inputState.value}
                onChangeText={onChangeHandler}
                onFocus={lostFocusHandler} />
            {!inputState.isValid && inputState && <View style={styles.errorContainer}> 
                <Text style={styles.errorText}> {props.errorText} </Text></View>}
        </View>

    )
}

const styles = StyleSheet.create({
    formControl: {
        width:'100%'
    },
    label: {
        fontFamily:'open-sans-bold',
        marginVertical:8,
    },
    input:{
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1
    },
    errorContainer:{
        marginVertical:5
    },
    errorText:{
        fontFamily:'open-sans',
        color:'red',
        fontSize:12
    }
})

export default Input;