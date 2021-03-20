const ldap = require('ldapjs');
const fs = require('fs')
const config = require('../config.json');
const User = require('../models/user');
const mongoose = require("mongoose")
const _ = require("lodash")
///--- Shared handlers
function authorize(req, res, next) {
    /* Any user may search after bind, only cn=root has full power */
    const isSearch = (req instanceof ldap.SearchRequest);
    if (!req.connection.ldap.bindDN.equals('cn=root') && !isSearch)
        return next(new ldap.InsufficientAccessRightsError());

    return next();
}

///--- Globals

//const SUFFIX = 'ou=users, o=ics';
const SUFFIX = 'o=ics';
const server = ldap.createServer({
    key: fs.readFileSync(config.ldap.path + 'server-key.pem'),
    certificate: fs.readFileSync(config.ldap.path + 'server-cert.pem'),
});
    mongoose.connect(config.mongodb, { useNewUrlParser: true, useUnifiedTopology: true });

server.bind('cn=root', (req, res, next) => {
    console.log('BBBBIND:'+ req)
    console.log(req.dn.toString())
    if (req.dn.toString() !== 'cn=root' || req.credentials !== 'secret')
        return next(new ldap.InvalidCredentialsError());

    res.end();
    return next();
});
/*
server.add(SUFFIX, authorize, (req, res, next) => {
    const dn = req.dn.toString();
    console.log('ADD:'+ req)

  //  if (db[dn])
    //    return next(new ldap.EntryAlreadyExistsError(dn));

    user = req.toObject().attributes;
    // 补丁
    if (user.username instanceof Array)
        user.username = user.username[0];
    if (user.password instanceof Array)
        user.password = user.password[0];

    user.dn = dn
    console.log(user)

    User.create(
        user
    ).then(function() {
        console.log(`user registered`);
    }).catch(function(err) {
        console.log(`user register error: ${err}`);
    })
    res.end();
    return next();
});*/

server.bind(SUFFIX, async (req, res, next) => {
    const dn = req.dn.toString();
    console.log('BIND: '+dn)
    console.log('BIND: '+req)

    user = await User.findOne({dn: dn})
    if (!user)
        return next(new ldap.NoSuchObjectError(dn));

    console.log(user)
    return User.authenticate()(user.username, req.credentials, (err, user, info) => {
        if (err || !user)
            return next(info)
        res.end();
        return next();
    })

    /*

    if (!user.password)
        return next(new ldap.NoSuchAttributeError('Password'));

    if (user.password.indexOf(req.credentials) === -1)
        return next(new ldap.InvalidCredentialsError());
        */
    //   res.end();
    // return next();
});

server.compare(SUFFIX, authorize, (req, res, next) => {
    const dn = req.dn.toString();
    if (!db[dn])
        return next(new ldap.NoSuchObjectError(dn));

    if (!db[dn][req.attribute])
        return next(new ldap.NoSuchAttributeError(req.attribute));

    matches = false;
    const vals = db[dn][req.attribute];
    for (const value of vals) {
        if (value === req.value) {
            matches = true;
            break;
        }
    }

    res.end(matches);
    return next();
});

server.del(SUFFIX, authorize, (req, res, next) => {
    const dn = req.dn.toString();
    if (!db[dn])
        return next(new ldap.NoSuchObjectError(dn));

    delete db[dn];

    res.end();
    return next();
});

server.modify(SUFFIX, authorize, (req, res, next) => {
    const dn = req.dn.toString();
    if (!req.changes.length)
        return next(new ldap.ProtocolError('changes required'));
    if (!db[dn])
        return next(new ldap.NoSuchObjectError(dn));

    const entry = db[dn];

    for (const change of req.changes) {
        mod = change.modification;
        switch (change.operation) {
            case 'replace':
                if (!entry[mod.type])
                    return next(new ldap.NoSuchAttributeError(mod.type));

                if (!mod.vals || !mod.vals.length) {
                    delete entry[mod.type];
                } else {
                    entry[mod.type] = mod.vals;
                }

                break;

            case 'add':
                if (!entry[mod.type]) {
                    entry[mod.type] = mod.vals;
                } else {
                    for (const v of mod.vals) {
                        if (entry[mod.type].indexOf(v) === -1)
                            entry[mod.type].push(v);
                    }
                }

                break;

            case 'delete':
                if (!entry[mod.type])
                    return next(new ldap.NoSuchAttributeError(mod.type));

                delete entry[mod.type];

                break;
        }
    }

    res.end();
    return next();
});

server.search(SUFFIX, authorize, async (req, res, next) => {
    console.log('SEARCH:'+req)
    const dn = req.dn.toString();
    console.log('SEARCH:'+dn)

    let scopeCheck;
    switch (req.scope) {
        case 'base':
            entry = await User.findOne({dn: dn})
            tmp = _.pickBy(entry, _.isString)
            if (result && req.filter.matches(tmp)) {
                res.send({
                    dn: dn,
                    attributes: tmp
                });
            }          

            res.end();
            return next();

        case 'one':
            scopeCheck = (k) => {
                if (req.dn.equals(k))
                    return true;

                const parent = ldap.parseDN(k).parent();
                return (parent ? parent.equals(req.dn) : false);
            };
            break;

        case 'sub':
            scopeCheck = (k) => {
                return (req.dn.equals(k) || req.dn.parentOf(k));
            };

            break;
    }

    entries = await User.find({dn: RegExp(dn)})
   
    for (const entry of entries) {
        console.log("test: ", entry);
        if (!scopeCheck(entry.dn))
            continue;

        // mongoose返回的entry不能与ldapjs的filter完美适配
        // 这里打个补丁_.omit
        tmp = _.pickBy(entry, _.isString)

        if (req.filter.matches(tmp)) {
            res.send({
                dn: entry.dn,
                attributes: tmp
            });
        }
    }
    res.end();

    return next();
});

server.listen(config.ldap.port, () => {
    console.log('LDAP server up at: %s', server.url);
});


async function test() {
    const {addUser, findUser, validateUser} = require("./ldap-client");
    var name = "test";
    var pwd= "228";
   // addUser(name, pwd);
  //  var user = await findUser(name);
    //console.log("RRR:",user);
   // console.log(await validateUser(name, pwd));
}
//test()
