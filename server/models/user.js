const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    subscribed: {
        type: []
    },
    limits: {
        type: []
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);