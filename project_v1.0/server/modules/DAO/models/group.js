var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema({
    groupname: { type: String, required: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model('group', GroupSchema);