const User = require('../models/user');

module.exports = {
    greeting(req, res) {
        res.send({ hi: 'there' });
    },

    readUsers(req, res) {
        User.find({})
            .then(users => res.send(users))
    },

    createUser(req, res) {
        const userProps = req.body;
        User.create(userProps)
            .then(user => res.send(user))
    },

    editUser(req, res) {
        const userId = req.params.id;
        const userProps = req.body;
        User.findByIdAndUpdate({ _id: userId}, userProps)
            .then(() => User.findById({ _id: userId}))
            .then(user => res.send(user))
    },
    
    deleteUser(req, res) {
        const userId = req.params.id;
        User.findByIdAndRemove({ _id: userId})
            .then(user => res.send(user).status(204))
    }

};