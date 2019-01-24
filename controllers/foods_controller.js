const User = require('../models/user');
const Food = require('../models/food');

module.exports = {
    createFood(req, res) {
        const userId = req.params.id;
        const foodProps = req.body;

        food = new Food(foodProps);

        User.findOne({ _id: userId})
        .populate('foods')
        .then((user) => {
            user.foods.push(food);
            Promise.all([user.save(), food.save()])
            .then(() => {
                res.send(user);
            });
        })
        .catch((err) => {
            res.status(422).send({
                message: err.errors
            });
        });
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