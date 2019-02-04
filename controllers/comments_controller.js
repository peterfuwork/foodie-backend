const User = require('../models/user');
const Food = require('../models/food');
const Comment = require('../models/comment');

module.exports = {
    createComment(req, res, next) {
        const commentProps = req.body;
        const userId = req.params.id;
        const foodId = req.params.foodId;

        comment = new Comment(commentProps);

        Food.findOne({ _id: foodId})
        .populate('comments')
        .then((food) => {
            User.findOne({ _id: userId})
                .then(user => {
                    food.comments.push(comment);
                    comment.user = user;
                    Promise.all([food.save(), comment.save()])
                    .then(() => {
                        res.send(comment);
                    });
                });
        })
        .catch(next);
    },

    editComment(req, res, next) {
        const foodId = req.params.FoodId;
        const commentId = req.params.commentId;
        const commentProps = req.body;

        comment = new Comment(commentProps);

        Comment.findByIdAndUpdate({ _id: commentId}, commentProps)
        .then(() => Comment.findById({ _id: commentId}))
        .then(comment => res.send(comment))
        .catch(next);
    },

    deleteComment(req, res, next) {
        const foodId = req.params.foodId;
        const commentId = req.params.commentId;

        Comment.findByIdAndRemove({ _id: commentId})
            .then(comment => {
                return Food.findOne({ _id: foodId})
                    .then(food => {
                        const i = food.comments.indexOf(commentId);
                        if (i > -1) {
                            food.comments.splice(i, 1);
                        }
                        return Promise.all([food.save(), comment.save()])
                            .then(() => {
                                res.send(comment).status(204);
                            });
                    });
            })
            .catch(next);
    }
};