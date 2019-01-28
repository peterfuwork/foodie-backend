const UsersController = require('../controllers/users_controller');
const FoodsController = require('../controllers/foods_controller');
const CommentsController = require('../controllers/comments_controller');
const RestaurantsController = require('../controllers/restaurants_controller');

module.exports = (app) => {
    app.get('/api/users', UsersController.readUsers);

    app.post('/api/users', UsersController.createUser);

    app.put('/api/users/:id', UsersController.editUser);

    app.delete('/api/users/:id', UsersController.deleteUser);

    app.get('/api/foods', FoodsController.readFoods);

    app.post('/api/foods/:id/:restaurantId', FoodsController.createFood);

    app.put('/api/foods/:id/:foodId', FoodsController.editFood);

    app.delete('/api/foods/:id/:foodId', FoodsController.deleteFood);

    app.post('/api/comments/:id/:foodId', CommentsController.createComment);

    app.put('/api/comments/:foodId/:commentId', CommentsController.editComment);

    app.delete('/api/comments/:foodId/:commentId', CommentsController.deleteComment);

    app.post('/api/yelp_restaurants', RestaurantsController.searchYelpRestaurantsNearMe);

    app.post('/api/restaurants', RestaurantsController.createRestaurant);
};