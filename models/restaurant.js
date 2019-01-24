const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
    restaurant_name: String,
    address: String,
    phone: String,
    type: String,
    restaurant_image: String,
    foods: [{
        type: Schema.Types.ObjectId,
        ref: 'food'
    }]
});

const Restaurant = mongoose.model('restaurant', RestaurantSchema);

module.exports = Restaurant;