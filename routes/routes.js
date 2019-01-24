const UsersController = require('../controllers/users_controller');
const FoodsController = require('../controllers/foods_controller');


module.exports = (app) => {
    app.get('/api/users', UsersController.readUsers);

    app.post('/api/users', UsersController.createUser);

    app.put('/api/users/:id', UsersController.editUser);

    app.delete('/api/users/:id', UsersController.deleteUser);

    app.post('/api/foods/:id', FoodsController.createFood);

    app.put('/api/foods/:id/:foodId', FoodsController.editFood);
};