import Order from "../../models/order";
export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDER = 'SET_ORDER';


export const fetchOrders = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try{
            const response = await fetch(
                `https://react-native-a3ee9.firebaseio.com/orders/${userId}.json`
            );
            if(!response.ok){
                throw new Error('Something went wrong');
            }
            const resData = await response.json();
            const loadedOrders = [];
            for(const key in resData){
                loadedOrders.push(
                    new Order(
                        key,
                        resData[key].cartItems,
                        resData[key].totalAmaount,
                        new Date(resData[key].date)
                    ))
            }
            dispatch({
                type: SET_ORDERS,
                payload: loadedOrders
            })

        }catch(err){
            throw err;
        }
    }
}


export const addOrder = (cartItems, totalAmount) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        const response = await fetch(
                `https://react-native-a3ee9.firebaseio.com/orders/${userId}.json`,
                {
                    method:'POST',
                    headers: {
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({
                        orderItems: cartItems, 
                        total: totalAmount,
                        date: new Date().toISOString()
                    }) 
                }
            );
            if(!response.ok){
                throw new Error('Something went wrong');
            }
            const respData = await response.json();

            dispatch({
                type:ADD_ORDER,
                orderData:{
                    id: respData.name,
                    items: cartItems,
                    amount: totalAmount,
                    date: new Date().toISOString()
                }
            })


    }  
}