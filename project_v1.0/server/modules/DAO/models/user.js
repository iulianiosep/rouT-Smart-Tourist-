var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    gender: { type: String },
    age: { type: String }
});

module.exports = mongoose.model('user', UserSchema);