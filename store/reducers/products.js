import {DELETE_PRODUCT, CREATE_PRODUCT, UPDATE_PRODUCT, SET_PRODUCTS} from '../actions/products';
import Product from '../../models/product';

const initialState = {
    availableProducts: [],
    userProducts: []
}

export default (state = initialState, action) => {
    switch(action.type) {
        case SET_PRODUCTS:
            return {
                availableProducts: action.products,
                userProducts: action.userProducts
            }
        case CREATE_PRODUCT:
            const newProduct = new Product(
                action.productData.id,
                action.productData.ownerId,
                action.productData.title,
                action.productData.imageUrl,
                action.productData.description,
                action.productData.price
            )
            return {
                ...state,
                userProducts : state.userProducts.concat(newProduct),
                availableProducts : state.availableProducts.concat(newProduct),
            }
        case UPDATE_PRODUCT:
            const productIndx = state.userProducts.findIndex(prd => 
                prd.id === action.pId)
            const updatedProduct = new Product(
                action.pId,
                state.userProducts[productIndx].ownerId,
                action.payload.title,
                action.payload.imageUrl,
                action.payload.description,
                action.payload.price
            )
            const updatedUserProducts =[...state.userProducts];
            updatedUserProducts[productIndx] = updatedProduct;

            const availableProductIndx = state.availableProducts.findIndex(prd => 
                prd.id === action.pId)
            const updatedAvailableProducts =[...state.availableProducts];
            updatedAvailableProducts[availableProductIndx] = updatedProduct;

            return {
                ...state,
                userProducts : updatedUserProducts,
                availableProducts : updatedAvailableProducts,
            }      
        case DELETE_PRODUCT:
            return {
                ...state,
                userProducts : state.userProducts.filter( product => {
                    product.id !== action.payload
                }),
                availableProducts : state.userProducts.filter( product => {
                    product.id !== action.payload
                }),
            }
    }
    return state;

}