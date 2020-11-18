import * as moment from 'moment';

class Order {
    constructor(id, items, totalAmaount, date){
        this.id = id;
        this.items = items;
        this.totalAmaount = totalAmaount;
        this.date =  date;
    }
    get readableDate() {
        // this.date.toLocaleDateString('en-EN', {
        //     year: 'numeric',
        //     month: 'long',
        //     day: 'numeric',
        //     hour: '2-digit',
        //     minute: '2-digit'
        // })
        return moment(this.date.format('Do MMMMM YYYY, hh:mm'))

    }
}

export default Order;