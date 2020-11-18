import { AsyncStorage } from 'react-native'

export const LOGOUT = 'LOGOUT';
export const AUTHENTICATE = 'AUTHENTICATE';
export const SET_DID_TRY_AL = 'SET_DID_TRY_AL';

let timer;

export const authenticate = (userId, token, expiryTime) => {
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({
            type: AUTHENTICATE,
            userId: userId,
            token: token
        })
    }   
}

export const setDidTryAl= () => {
    return  {
        type: SET_DID_TRY_AL
    }   
}



export const signup = (email, password) => {
    return async dispatch => {
        const response =  await fetch(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDBtZqHxOCrFlKq-eNCz2qtglPktZGzZZs',
            {
                method:'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    email:email,
                    password:password,
                    returnSecureToken:true
                })
            }
        );
        if(!response.ok){
            const errorResponseData = await response.json();
            let message= 'Something is wrong';
            const errorId = errorResponseData.error.message;
            if( errorId === 'EMAIL IS INVALID'){
                message= 'Email Hatalı...'
            }
            throw new Error(message)
        }
        const resDat = await response.json()
        dispatch(authenticate(resDat.localId, resDat.idToken, parseInt(resDat.expiresIn)*1000));
        const expirationDate = new Date(
            new Date().getTime() + parseInt(resDat.expiresIn)*1000
        )
        saveDataToStorage(token, userId, expirationDate)
    }   
}

export const signin = (email, password) => {
    return async dispatch => {
        const response =  await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDBtZqHxOCrFlKq-eNCz2qtglPktZGzZZs',
            {
                method:'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    email:email,
                    password:password,
                    returnSecureToken:true
                })
            }
        );
        if(!response.ok){
            throw new Error('Something went wrong')
        }
        const resDat = await response.json();
        dispatch(authenticate(resDat.localId, resDat.idToken, parseInt(resDat.expiresIn)*1000));
        const expirationDate = new Date(
            new Date().getTime() + parseInt(resDat.expiresIn)*1000
        )
        saveDataToStorage(token, userId, expirationDate)
    }
}

export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('userData');
    return {
        type: LOGOUT
    }   
}

const clearLogoutTimer = () => {
    if(timer){
        clearTimeout(timer);
    }
}

const setLogoutTimer = expirationTime => {
    return dispatch => {
      timer = setTimeout(()=>{
        dispatch(logout());
    }, expirationTime)  
    }
    
}


const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem('userData', JSON.stringify(
        {token: token,
        userId: userId,
        expiryDate: expirationDate.toISOString()}
    ));

}