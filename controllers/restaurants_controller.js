const Restaurant = require('../models/restaurant');
const axios = require('axios');
const keys = require('../config/keys');

module.exports = {
    searchYelpRestaurantsNearMe(req, res, next) {
        const lat = req.body.lat;
        const lon = req.body.lon;
        
        const YELP_API_URL = 'https://api.yelp.com/v3/businesses/search?term=restaurant&limit=10&sort_by=rating&latitude='+ lat +'&longitude=' + lon;

        axios.get(YELP_API_URL, {
            headers: {
                Authorization: 'Bearer ' + keys.yelp_key
            }
        })
        .then(data => res.send(data.data.businesses))
        .catch(next)
    },

    createRestaurant(req, res, next) {
        const restaurantProps = req.body;
        Restaurant.create(restaurantProps)
            .then(restaurant => res.send(restaurant))
            .catch(next);
    },

    readRestaurantById(req, res, next) {
        const restaurantId = req.params.restaurantId;
        Restaurant.find({ _id: restaurantId})
        .populate({
            path: 'foods',
            model: 'food',
            populate: {
                path: 'comments',
                model: 'comment'
            }
        })
        .then(restaurant=> res.send(restaurant))
        .catch(next);
    },

    readRestaurants(req, res, next) {
        Restaurant.find({})
            .then(restaurants => res.send(restaurants))
            .catch(next);
    }
};