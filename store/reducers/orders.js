import Order from '../../models/order';
import { ADD_ORDER, SET_ORDER } from '../actions/orders';


const initialState = {
    orders:[]
}


export default (state = initialState, action) => {
    switch(action.type) {
        case ADD_ORDER: 
            const newOrder = new Order(
                action.payload.id,
                action.payload.items,
                action.payload.amount,
                action.payload.date,
            )
            return{
                ...state, 
                orders: state.orders.concat(newOrder)
            }
        case SET_ORDER: 
            return{
                ...state, 
                orders: action.payload
            }
    }
    return state;
}