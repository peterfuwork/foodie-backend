const User = require('../models/user');
const Food = require('../models/food');
const Restaurant = require('../models/restaurant');

module.exports = {
    createFood(req, res) {
        const userId = req.params.id;
        const restaurantId = req.params.restaurantId;
        const foodProps = req.body;

        food = new Food(foodProps);

        Food.create(foodProps)
            .then(food => {
                Food.findById(food._id)
                .populate('restaurants')
                .then(food => {
                    Restaurant.findOne({ _id: restaurantId})
                    .then((restaurant) => {
                        restaurant.foods.push(food);
                        food.restaurants.push(restaurant);
                        User.findOne({ _id: userId})
                        .then((user) => {
                            user.foods.push(food);
                            Promise.all([user.save(), food.save(), restaurant.save()])
                            .then(() => {
                                res.send(food);
                            });
                        });
                    });
                });
            })
            .catch((err) => {
                res.status(422).send({
                    message: err.errors
                });
            });
    },

    readFoods(req, res) {
        Food.find({})
            .populate({
                path: 'comments',
                model: 'comment',
                populate: {
                    path: 'user',
                    model: 'user'
                }
            })
            .populate('restaurants')
            .then(foods => res.send(foods))
            .catch((err) => {
                res.status(422).send({
                    message: err.errors
                });
            });
    },

    readFoodById(req, res) {
        const foodId = req.params.foodId;

        Food.find({ _id: foodId})
        .populate({
            path: 'comments',
            model: 'comment',
            populate: {
                path: 'user',
                model: 'user'
            }
        })
        .populate('restaurants')
        .then(food => res.send(food))
        // .catch((err) => {
        //     res.status(422).send({
        //         message: err.errors
        //     });
        // });
    },

    editFood(req, res) {
        const userId = req.params.id;
        const foodId = req.params.foodId;
        const foodProps = req.body;

        food = new Food(foodProps);

        Food.findByIdAndUpdate({ _id: foodId}, foodProps)
        .then(() => Food.findById({ _id: foodId}))
        .then(food => res.send(food))
        .catch((err) => {
            res.status(422).send({
                message: err.errors
            });
        });
    },

    deleteFood(req, res) {
        const userId = req.params.id;
        const foodId = req.params.foodId;

        Food.findByIdAndRemove({ _id: foodId})
            .then(food => {
                User.findOne({ _id: userId})
                    .then(user => {
                        const i = user.foods.indexOf(foodId);
                        if (i > -1) {
                            user.foods.splice(i, 1);
                        }
                        Promise.all([user.save(), food.save()])
                            .then(() => {
                                res.send(food).status(204);
                            });
                    });
            })
            .catch((err) => {
                res.status(422).send({
                    message: err.errors
                });
            });
    }
};