const User = require('../models/user');

module.exports = {
    greeting(req, res) {
        res.send({ hi: 'there' });
    },

    readUsers(req, res, next) {
        User.find({})
            .then(users => res.send(users))
            .catch(next);
    },

    createUser(req, res, next) {
        const userProps = req.body;
        User.create(userProps)
            .then(user => res.send(user))
            .catch(next);
    },

    editUser(req, res, next) {
        const userId = req.params.id;
        const userProps = req.body;
        User.findByIdAndUpdate({ _id: userId}, userProps)
            .then(() => User.findById({ _id: userId}))
            .then(user => res.send(user))
            .catch(next);
    },
    
    deleteUser(req, res, next) {
        const userId = req.params.id;
        User.findByIdAndRemove({ _id: userId})
            .then(user => res.send(user).status(204))
            .catch(next);
    }

};