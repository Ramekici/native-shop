import Order from "../../models/order";
export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';


export const fetchOrders = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try {
            const response = await fetch(
                `https://react-native-a3ee9.firebaseio.com/orders/${userId}.json`
            );
            if (!response.ok) {
                throw new Error('Something went wrong');
            }
            const resData = await response.json();
            const loadedOrders = [];
            console.log(resData)
            for (const key in resData) {
                loadedOrders.push(
                    new Order(
                        key,
                        resData[key].cartItems,
                        resData[key].totalAmount,
                        new Date(resData[key].date)
                    ))
            }
            dispatch({
                type: SET_ORDERS,
                payload: loadedOrders
            })

        } catch (err) {
            throw err;
        }
    }
}


export const addOrder = (cartItems, totalAmount) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const date = new Date().toISOString();
        const response = await fetch(
            `https://react-native-a3ee9.firebaseio.com/orders/${userId}.json?auth=${token}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cartItems,
                    totalAmount,
                    date: date
                })
            }
        );

        if (!response.ok) {
            throw new Error('Something went wrong');
        }

        const respData = await response.json();

        dispatch({
            type: ADD_ORDER,
            orderData: {
                id: respData.name,
                items: cartItems,
                amount: totalAmount,
                date: date
            }
        })

        for (const cartItem of cartItems) {
            const pushToken = cartItem.productPushToken;
            await fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    'Accept': 'aplication/json',
                    'Accept-Encoding': 'gzip, deflate',
                    'Content-Type': 'aplication/json'
                },
                body: JSON.stringify({
                    to: pushToken,
                    title: 'Order was placed!',
                    body: cartItem.productTitle
                })
            })
        }
    }
}