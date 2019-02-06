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
                return Promise.all([Restaurant.findOne({_id: restaurantId}), food])
            })
            .then(data => {
                let obj = { restaurant: data[0], food: data[1] }
                obj.restaurant.foods.push(obj.food);
                obj.food.restaurants.push(obj.restaurant);
                return Promise.all([...obj, User.findOne({ _id: userId})])
            })
            .then(data => {
                console.log('data1',data);
                let obj = { restaurant: data[0], food: data[1], user: data[2] }
                console.log('obj',obj)
                obj.user.foods.push(obj.food);
                return Promise.all([obj.user.save(), obj.food.save(), obj.restaurant.save()]) 
            })
            .then((data) => {
                console.log('data2',data);
                res.send(data);
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