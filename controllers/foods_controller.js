const User = require('../models/user');
const Food = require('../models/food');
const Restaurant = require('../models/restaurant');

module.exports = {
    createFood(req, res, next) {
        const userId = req.params.id;
        const restaurantId = req.params.restaurantId;
        const foodProps = req.body;

        food = new Food(foodProps);

        Food.create(foodProps)
            .then(food => {
                return Food.findById(food._id)
                .populate('restaurants')
            })
            .then(food => {
                const restaurant = Restaurant.findOne({ _id: restaurantId});
                return { food, restaurant }
            })
            .then(data => {
                console.log(data)
                restaurant.foods.push(data.food);
                data.food.restaurants.push(restaurant);
                return { ...data, user: User.findOne({ _id: userId})}
            })
            .then(data => {
                console.log(data);
                user.foods.push(food);
                return Promise.all([user.save(), food.save(), restaurant.save()])
                        .then(() => {
                            res.send(food);
                        });
            })
            .catch(next);
            },

    readFoods(req, res, next) {
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
            .catch(next);
    },

    readFoodById(req, res, next) {
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
        .catch(next);
    },

    editFood(req, res, next) {
        const userId = req.params.id;
        const foodId = req.params.foodId;
        const foodProps = req.body;

        food = new Food(foodProps);

        Food.findByIdAndUpdate({ _id: foodId}, foodProps)
        .then(() => Food.findById({ _id: foodId}))
        .then(food => res.send(food))
        .catch(next)
    },

    deleteFood(req, res, next) {
        const userId = req.params.id;
        const foodId = req.params.foodId;

        Food.findByIdAndRemove({ _id: foodId})
            .then(food => {
                return User.findOne({ _id: userId})
                    .then(user => {
                        const i = user.foods.indexOf(foodId);
                        if (i > -1) {
                            user.foods.splice(i, 1);
                        }
                        return Promise.all([user.save(), food.save()])
                            .then(() => {
                                res.send(food).status(204);
                            });
                    });
            })
            .catch(next);
    }
};