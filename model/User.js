const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max:112
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 112
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max:112
    },
    date: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('User', userSchema)