export const ADD_TO_CART = 'ADD_TO_CART';
export const DELETE_FROM_CART = 'DELETE_FROM_CART';
export const SET_CART = 'SET_CART';

export const fetchCart = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try{
            const response = await fetch(
                `https://react-native-a3ee9.firebaseio.com/carts/${userId}.json`
            );
            if(!response.ok){
                throw new Error('Something went wrong');
            }
            const resData = await response.json();
            let cartArr=[];
            let total = 0;
            for(const key in resData){
                total = total + parseInt(resData[key].price);
                cartArr.push({
                    key,
                    title: resData[key].title,
                    price: resData[key].price,
                    imageUrl: resData[key].imageUrl,
                    description: resData[key].description
                })
            }

            dispatch({
                type:SET_CART,
                items:cartArr,
                totalAmount:total
            })

        }catch(err){
            throw err;
        }
    }  
}


export const addCart = (id, title, price, imageUrl, description) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        const token = getState().auth.token;
        try{
            const response = await fetch(
                `https://react-native-a3ee9.firebaseio.com/carts/${userId}.json?auth=${token}`,
                {
                    method:'POST',
                    headers: {
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({
                        title,
                        description,
                        imageUrl,
                        price,
                        id
                    })
                }
            );
            if(!response.ok){
                throw new Error('Something went wrong');
            }
            const resData = await response.json();
            console.log(resData);
            dispatch(fetchCart())

        }catch(err){
            throw err;
        }
    }   
}

export const deleteFromCart = (id) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try{
            const response = await fetch(
                `https://react-native-a3ee9.firebaseio.com/cart/${userId}`,
                {
                    method:'POST',
                    headers: {
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({
                        title,
                        description,
                        imageUrl,
                        price,
                        ownerId: userId
                    })
                }
            );
            if(!response.ok){
                throw new Error('Something went wrong');
            }
            const resData = await response.json();
            dispatch({
                type:DELETE_FROM_CART,
                items:resData.items,
                totalAmount:resData.totalAmount
            })

        }catch(err){
            throw err;
        }
    }      
}