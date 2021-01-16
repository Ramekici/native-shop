class CartItem {
    constructor(quantity, productPrice, productTitle, pushToken, sum, productImage){
        this.quantity = quantity;
        this.productPrice = productPrice;
        this.productTitle = productTitle;
        this.pushToken= pushToken;
        this.sum = sum;
        this.imageUrl = productImage;
    }
}

export default CartItem;