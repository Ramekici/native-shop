import React, {useState} from 'react';
import AppNavigator from './navigation/AppNavigator';

import {createStore, combineReducers, applyMiddleware} from 'redux';
import { Provider } from 'react-redux';
import productReducer from './store/reducers/products';
import cartReducer from './store/reducers/carts';
import orderReducer from './store/reducers/orders';
import authReducer from './store/reducers/auth';
import {composeWithDevTools} from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk';
import * as Notifications from 'expo-notifications';

import { AppLoading } from 'expo';
import * as Font from 'expo-font';

Notifications.setNotificationHandler({
  handleNotification : async () => {
    return {shouldShowAlert: true}
  }
});

const rootReducer = combineReducers({
  products: productReducer,
  cart: cartReducer,
  orders: orderReducer,
  auth: authReducer
})

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  })
}





const store =  createStore(rootReducer, applyMiddleware(ReduxThunk), composeWithDevTools());


export default function App() {
  
  const [fetchFontLoad, setFetchFontLoad ] = useState(false);

  if(!fetchFontLoad) {
    return <AppLoading 
            startAsync={fetchFonts}
            onFinish={()=> setFetchFontLoad(true)} />
  }

  return (
    <Provider store={store} >
      <AppNavigator/>
    </Provider>
    
  );
}


