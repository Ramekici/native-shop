import moment from 'moment';

class Order {
    constructor(id, items, totalAmaount, date){
        this.id = id;
        this.items = items;
        this.totalAmaount = totalAmaount;
        this.date = date;
    }
    
    get readableDate() {
        return moment(this.date).format('DD-MM-YYYY');
    }
}

export default Order;