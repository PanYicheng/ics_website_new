var _ = require('lodash');
var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var BPromise = require('bluebird');

var UserSchema = mongoose.Schema({
    name: String,
    username: {
        type: String,
        unique: true
    },
 //   password: String,
    createdTime: { type: Date, default: Date.now },
    level: {
        type: Number,
        default: 1
    },
    admin: {
        type: Boolean,
        default: false
    },
    dn: {
        type: String,
        unique: true
    }
});

// Creates username, salt, hash fields
// see: https://github.com/saintedlama/passport-local-mongoose#options
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
