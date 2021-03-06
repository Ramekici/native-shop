import { ADD_TO_CART, DELETE_FROM_CART, SET_CART } from '../actions/carts';
import { ADD_ORDER } from '../actions/orders';
import { DELETE_PRODUCT } from '../actions/products'
import CartItem from '../../models/cart-item';

const initialState = {
    items:{},
    totalAmount: 0
}

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const addedProduct = action.payload;
            const productPrice = parseInt(addedProduct.price);
            const productTitle = addedProduct.title;
            const productImage = addedProduct.imageUrl;
            const pushToken = addedProduct.pushToken;
            

            let updateOrNewCartItem;
            if (state.items[addedProduct.id]) {
                updateOrNewCartItem = new CartItem(
                    state.items[addedProduct.id].quantity + 1,
                    productPrice,
                    productTitle,
                    pushToken,
                    state.items[addedProduct.id].sum + productPrice,
                    productImage
                );
            } else {
                updateOrNewCartItem = new CartItem(1,
                    productPrice,
                    productTitle,
                    pushToken,
                    productPrice,
                    productImage);
            }
            return {
                items: { ...state.items, [addedProduct.id]: updateOrNewCartItem },
                totalAmount: state.totalAmount + productPrice
            }
        case DELETE_FROM_CART:
            const selectedCartItem = state.items[action.payload];
            const currentQty = selectedCartItem.quantity;
            let updatedCartItems;
            if (currentQty > 1) {
                const updatedCartItem = new CartItem(
                    selectedCartItem.quantity - 1,
                    selectedCartItem.productPrice,
                    selectedCartItem.productTitle,
                    selectedCartItem.pushToken,
                    selectedCartItem.sum - selectedCartItem.productPrice,
                    selectedCartItem.imageUrl
                )
                updatedCartItems = { ...state.items, [action.payload]: updatedCartItem }

            } else {
                updatedCartItems = { ...state.items };
                delete updatedCartItems[action.payload]
            }
            return {
                items: { ...updatedCartItems },
                totalAmount: state.totalAmount - selectedCartItem.productPrice
            }
        case ADD_ORDER:
            return initialState;

        case DELETE_PRODUCT:
            if (!state.items[action.payload]) {
                return state;
            }
            const updatedItems = { ...state.items };
            const itemTotal = state.items[action.payload].sum;
            delete updatedItems[action.payload]
            return {
                ...state,
                items: updatedItems,
                totalAmount: state.totalAmount - itemTotal
            }
        case SET_CART:
            return {
                ...state,
                items: action.items,
                totalAmount: action.totalAmount
            }

    }
    return state
}