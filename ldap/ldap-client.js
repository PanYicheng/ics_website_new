const ldap = require('ldapjs');
// const assert = require('assert')
// const fs = require('fs')
const debug = require("debug")("ics:ldap-client");
const config = require('../config.json').ldap;
const format = require('string-format')
// const _ = require('lodash')
// const User = require('../models/user')
// const Group = require('../models/group')
// const BPromise = require('bluebird');

// BPromise.promisifyAll(User);
// BPromise.promisifyAll(Group);

const client = ldap.createClient({
    url: format('ldaps://{host}', config),
    // tlsOptions: {
    // //    key: fs.readFileSync('client-key.pem'),
    //   //  cert: fs.readFileSync('client-cert.pem'),
    //     ca: [fs.readFileSync(config.path + 'server-cert.pem')],
    //     rejectUnauthorized: true
    // }
});

client.on('error', (err) => {
    // handle connection error
    debug("LDAP client error.")
})

function validateUser(username, password) {
    const userDN = config.usernamekey+'='+username+','+config.userdn
    debug("User DN: ", userDN)
    debug("User PW: ", password)
    
    return new Promise((resolve, reject) => {
        client.bind(userDN, password, (err) => {
            if (!err)
                resolve(true);
            else
                reject(err);
        })
    });
}


function findUser(username) {
    bindServer();
    const opts = {
        filter: format('(username={})', username),
        scope: 'sub',
        attributes: ['dn', 'username']
    };
    return new Promise(resolve => {
        var entries = [];
        client.search(dn, opts, (err, res) => {
            assert.ifError(err);

            res.on('searchEntry', (entry) => {
                console.log('entry: ' + JSON.stringify(entry.object));
                entries.push(entry.object);
            });
            res.on('searchReference', (referral) => {
                console.log('referral: ' + referral.uris.join());
            });
            res.on('error', (err) => {
                console.error('error: ' + err.message);
            });
            res.on('end', (result) => {
                console.log('status: ' + result.status);
                if (result.status == 0 && entries.length == 1)
                    resolve(entries[0]);
                else
                    resolve();
            });
        })
    });
}

// TODO: Rewrite to use ldap on Synology.
// const dn = 'ou=users, o=ics'
// function bindServer() {
//     client.bind(config.readerdn, config.password, (err) => {
//         assert.ifError(err);
//     });
// }
// function addUser(user) {
//     user.dn = `cn=${user.username}, ou=users, o=ics`
//     const password = user.password
//     user = _.omit(user, 'password')
//     return User.registerAsync(user, password, function(err) {
//         if (err) {
//           debug(`error while user ${user} register! ${err}`)
//           return err;
//         }
//         debug(`user ${user} registered!`)
//     })
// }

// function addGroup(group) {
//     group.dn = `cn=${group.name}, ou=groups, o=ics`
//     return Group.createAsync(group)
// }





/*
client.compare('cn=foo, o=example', 'sn', 'bar', (err, matched) => {
    assert.ifError(err);
    console.log('matched: ' + matched);
});

const change = new ldap.Change({
    operation: 'add',
    modification: {
        pets: ['cat', 'dog']
    }
});


client.modify('cn=foo, o=example', change, (err) => {
    assert.ifError(err);
});


client.del('cn=foo, o=example', (err) => {
    assert.ifError(err);
});
*/

// ---- Test code for using ldap on Synology. -----
// validateUser("root", "iCSL@PKU-1800")
// .then(success => debug("success"))
// .catch(err => debug(err))

module.exports = {
    // addUser,
    // findUser,
    validateUser,
    // addGroup,
}
