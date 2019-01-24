const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: {
        type: String,
        validate: {
            validator: (first_name) => first_name.length > 1,
            message: 'First name must be longer than 1 character.'
        },
        required: [true, 'First name is required.']
    },
    last_name: {
        type: String,
        validate: {
            validator: (last_name) => last_name.length > 1,
            message: 'Last name must be longer than 1 character.'
        },
        required: [true, 'Last name is required.']
    },
    gender: {
        type: String,
        required: [true, 'Gender is required.']
    },
    ethnicity: {
        type: String,
        required: [true, 'Ethnicity is required.']
    },
    birth_year: {
        type: Number,
        validate: {
            validator: (birth_year) => parseInt(birth_year) > 1900,
            message: 'Birth year invalid.'
        },
        required: [true, 'Birth year is required.']
    },
    birth_place: String,
    user_image: String,
    email: {
        type: String,
        validate: {
            validator: (email) => {
                const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
                return emailRegex.test(email);
            },
            message: 'Provided email is invalid.'
        },
        required: [true, 'Valid Email is required.']
    },
    password: {
        type: String,
        validate: { 
            validator: (password) => {
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
                return passwordRegex.test(password);
            },
            message: 'Password must to contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number:'
        },
        required: [true, 'Password is required.']
    },
    date: { 
        type: Date,
        default: Date.now 
    },
    foods: [{
        type: Schema.Types.ObjectId,
        ref: 'food'
    }]
});

const User = mongoose.model('user', UserSchema);

module.exports = User;