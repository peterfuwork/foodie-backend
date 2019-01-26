const Restaurant = require('../models/restaurant');
const axios = require('axios');
const keys = require('../config/keys');

module.exports = {
    searchYelpRestaurantsNearMe(req, res) {
        const lat = req.body.lat;
        const lon = req.body.lon;
        
        const YELP_GRAPHQL_URL = 'https://api.yelp.com/v3/businesses/search?term=restaurant&latitude='+ lat +'&longitude=' + lon;

        axios.get(YELP_GRAPHQL_URL, {
            headers: {
                Authorization: 'Bearer ' + keys.yelp_key
            }
        })
        .then(data => res.send(data.data.businesses))
        // .catch((err) => {
        //     res.status(422).send({
        //         message: err.errors
        //     });
        // });
    },
};