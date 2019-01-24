const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FoodSchema = new Schema({
    food_name: String,
    price: Number,
    food_image: String,
    category: String,
    is_Spicy: Boolean,
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comment'
    }],
    restaurants: [{
        type: Schema.Types.ObjectId,
        ref: 'restaurant'
    }]
});

const Food = mongoose.model('food', FoodSchema);

module.exports = Food;