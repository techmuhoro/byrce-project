const mongoose = require('mongoose');

const userShcema = mongoose.Schema({
    'name': {
        type: String,
    },
    'email': {
        type: String,
    },
    'password': {
        type: String
    } 
});

module.exports = mongoose.model('User', userShcema);