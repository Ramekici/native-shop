import React from 'react';
import { Platform, View, Button, SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';


import ProductOverviewScreen, {screenOptions as PrdOverviewOpt} from '../screens/shop/ProductsOverviewScreen';
import CartsScreen, {screenOptions as CartOpt} from '../screens/shop/CartsScreen';
import OrdersScreen, {screenOptions as OrderOpt}  from '../screens/shop/OrdersScreen';
import AuthScreen, {screenOptions as AuthOpt} from '../screens/user/AuthScreen';
import ProductDetail, {screenOptions as PrdDetailOpt} from '../screens/shop/ProductDetailScreen';

import * as authActions from '../store/actions/auth';
import UserProductScreen, {screenOptions as UserPrdOpt} from '../screens/user/UserProducts';
import EditProductScreen, {screenOptions as EditPrdOpt} from '../screens/user/EditProducts';


import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';



const defaultNavOptions = {
    headerStyle : {
        backgroundColor: Platform.OS=== 'android' ? Colors.primary :''
    },
    headerTitleStyle: {
        fontFamily: 'open-sans-bold'
    },
    headerBackTitleStyle: {
        fontFamily: 'open-sans'
    },
    headerTintColor: Platform.OS=== 'android' ? 'white' : Colors.primary
}
 
///// stack 
const ProductsStack = createStackNavigator();

export const ProductsNavigator = () => {
  return (
    <ProductsStack.Navigator
      screenOptions={defaultNavOptions}
    >
      <ProductsStack.Screen  
        name="ProductOverviewScreen"
        component={ProductOverviewScreen}
        options={PrdOverviewOpt}
      />
      <ProductsStack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={PrdDetailOpt}
      />
      <ProductsStack.Screen
        name="Cart"
        component={CartsScreen}
        options={CartOpt}
      />
    </ProductsStack.Navigator>
  );
}

//////////
const OrdersStack = createStackNavigator();

export const OrdersNavigator = () => {
    return (
      <OrdersStack.Navigator 
      screenOptions={defaultNavOptions}>
        <OrdersStack.Screen
          name="Orders"
          component={OrdersScreen}
          options={OrderOpt}
        />
      </OrdersStack.Navigator>
    );
}



///// stack

const AdminStack = createStackNavigator();

export const AdminNavigator = () => {
    return (
      <AdminStack.Navigator 
      screenOptions={defaultNavOptions}>
        <AdminStack.Screen
          name="User"
          component={UserProductScreen}
          options={UserPrdOpt}
        />
        <AdminStack.Screen
          name="Edit"
          component={EditProductScreen}
          options={EditPrdOpt}
        />
      </AdminStack.Navigator>
    );
}


////// stack
const AuthStack = createStackNavigator();

export const AuthNavigator = () => {
    return (
      <AuthStack.Navigator 
        screenOptions={defaultNavOptions}>
        <AuthStack.Screen
          name="Auth"
          component={AuthScreen}
          options={AuthOpt}
        />
      </AuthStack.Navigator>
    );
}

const ShopDrawerNavigator = createDrawerNavigator();

export const ShopNavigator = () => {

  const dispatch = useDispatch();
  return (
    <ShopDrawerNavigator.Navigator
      initialRouteName="Products"
      drawerContent={ props => {
        return(
          <View style={{flex:1, paddingTop: 20}}>
            <SafeAreaView forceInset = {{ top: 'always', horizontal:'never'}}>
            <DrawerItemList {...props}/>
              <Button 
                title='Çıkış'
                color={Colors.primary}
                onPress={()=>{ 
                  dispatch(authActions.logout());
                  props.navigation.navigate('Auth');
                }}/>
            </SafeAreaView>
          </View>
        )
      }} 
      drawerContentOptions={{
        activeTintColor: Colors.primary
      }}
      >
      <ShopDrawerNavigator.Screen
        name="Products"
        component={ProductsNavigator}
        options={{
          headerShown:false,
          drawerIcon: props => (
            <Ionicons
              name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
              size={23}
              color={props.color}
            />)
        }}
      />
      <ShopDrawerNavigator.Screen
        name="Orders"
        component={OrdersNavigator}
        options={{
          headerShown:false,
          drawerIcon: props => (
            <Ionicons
              name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
              size={23}
              color={props.color}
            />)
        }}
      />
      <ShopDrawerNavigator.Screen
        name="Admin"
        component={AdminNavigator}
        options={{
          headerShown:false,
          drawerIcon: props => (
            <Ionicons
              name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
              size={23}
              color={props.color}
            />)
        }}
      />
    </ShopDrawerNavigator.Navigator>
  );
}

