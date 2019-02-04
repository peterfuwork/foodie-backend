const Restaurant = require('../models/restaurant');
const axios = require('axios');
const keys = require('../config/keys');

module.exports = {
    searchYelpRestaurantsNearMe(req, res) {
        const lat = req.body.lat;
        const lon = req.body.lon;
        
        const YELP_API_URL = 'https://api.yelp.com/v3/businesses/search?term=restaurant&limit=10&sort_by=rating&latitude='+ lat +'&longitude=' + lon;

        axios.get(YELP_API_URL, {
            headers: {
                Authorization: 'Bearer ' + keys.yelp_key
            }
        })
        .then(data => res.send(data.data.businesses))
        .catch((err) => {
            res.status(422).send({
                message: err.errors
            });
        });
    },

    createRestaurant(req, res) {
        const restaurantProps = req.body;
        Restaurant.create(restaurantProps)
            .then(restaurant => res.send(restaurant))
            .catch((err) => {
                res.status(422).send({
                    message: err.errors
                });
            });
    },

    readRestaurantById(req, res) {
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
        .catch((err) => {
            res.status(422).send({
                message: err.errors
            });
        });
    },

    readRestaurants(req, res) {
        Restaurant.find({})
            .then(restaurants => res.send(restaurants))
            .catch((err) => {
                res.status(422).send({
                    message: err.errors
                });
            });
    }
};