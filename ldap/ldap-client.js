const ldap = require('ldapjs');
const assert = require('assert')
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
        client.bind(userDN, password, async (err) => {
            if (!err) {
                try {
                    const entry = await findUser(username)
                    resolve(entry)
                }
                catch(e){
                    reject(e)
                }
            }
            else
                reject(err);
        })
    });
}

function bindServer() {
    client.bind(config.readerdn, config.password, (err) => {
        assert.ifError(err);
    });
    debug("ldap bind success.")
}

function findUser(username) {
    bindServer();
    const opts = {
        filter: format('{}={}', config.usernamekey, username),
        // filter: '(objectclass=*)',
        scope: 'sub',
        attributes: ['dn', 'uid', 'displayName', 'memberOf']
    };
    return new Promise(resolve => {
        var entries = [];
        client.search(config.userdn, opts, (err, res) => {
            assert.ifError(err);

            res.on('searchEntry', (entry) => {
                debug('search entry: ' + JSON.stringify(entry.object));
                entries.push(entry.object);
            });
            res.on('searchReference', (referral) => {
                debug('search referral: ' + referral.uris.join());
            });
            res.on('error', (err) => {
                debug('search error: ' + err.message);
            });
            res.on('end', (result) => {
                debug('search status: ' + result.status);
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
if(require.main === module){
    // ---- validate 'root'
    // validateUser("root", "iCSL@PKU-1800")
    // .then(success => debug("success"))
    // .catch(err => debug(err))

    // ---- validate 'admin' same as 'root'
    validateUser("admin", "iCSL@PKU-1800")
    .then(entry => {debug("success. returning entry:");debug(entry);})
    .catch(err => debug(err))

    // ---- findUser 'admin'
    // findUser("admin")
    // .then(entry => debug(entry))
    // .catch(err => debug(err))
}

module.exports = {
    // addUser,
    // findUser,
    validateUser,
    // addGroup,
}
