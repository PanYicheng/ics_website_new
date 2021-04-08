var config = require('../config.json');
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
var db = mongoose.connection;
var User = require('../models/user');
var BPromise = require('bluebird');
var process = require('process');
const ldapClient = require('../ldap/ldap-client')

BPromise.promisifyAll(mongoose);
BPromise.promisifyAll(User);

db.on('error', e => {
    console.log('connect error: ', e);
});
db.once('open', function() {
    console.log('connected');

    var admins = config.admin || [];

    BPromise
    .map(admins, function(user) {
        return User.findOne({username: user.username})
            .then(res => {
                if (!res) 
                    return ldapClient.addUser(user)
            })
    }).then(function() {
        console.log(`${admins.length} users registered`)
    }).catch(err => console.log(`user register error: ${err}`))
    .then(
        () => db.close()
    );
})
if (config.mongodb) {
    console.log(`connnecting ${config.mongodb}...`);
    mongoose.connect(config.mongodb, { useNewUrlParser: true, useUnifiedTopology: true });
} else {
    console.log('config:mongodb not set');
}
