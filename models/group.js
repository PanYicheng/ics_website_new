const _ = require('lodash');
const mongoose = require('mongoose');
const BPromise = require('bluebird');

var GroupSchema = mongoose.Schema({
    member: [String],
    cn: {
        type: String,
        unique: true
    },
    dn: {
        type: String,
        unique: true
    }
});

module.exports = mongoose.model('Group', GroupSchema);
