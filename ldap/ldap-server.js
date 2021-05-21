const ldap = require('ldapjs');
const fs = require('fs')
const config = require('../config.json');
const User = require('../models/user');
const Group = require('../models/group');
const mongoose = require("mongoose")
const _ = require("lodash");
const debug = require('debug')('ics:ldap-server');

///--- Shared handlers
function authorize(req, res, next) {
    /* Any user may search after bind, only cn=root has full power */
    const isSearch = (req instanceof ldap.SearchRequest);
    if (!req.connection.ldap.bindDN.equals('cn=root') && !isSearch)
        return next(new ldap.InsufficientAccessRightsError());

    return next();
}

function log(req, type) {
    debug(type+': '+req.dn.toString());
    debug(req.toString());
}
///--- Globals

//const SUFFIX = 'ou=users, o=ics';
const SUFFIX = 'o=ics';
const server = ldap.createServer({
    key: fs.readFileSync(config.ldap.path + 'server-key.pem'),
    certificate: fs.readFileSync(config.ldap.path + 'server-cert.pem'),
});
mongoose.connect(config.mongodb, { useNewUrlParser: true, useUnifiedTopology: true });

server.bind(config.ldap.readerdn, (req, res, next) => {
    log(req, "BBBIND");
    if (req.dn.toString() !== config.ldap.readerdn || 
        req.credentials   !== config.ldap.password)
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
    log(req, "BIND");

    user = await User.findOne({dn: dn})
    if (!user)
        return next(new ldap.NoSuchObjectError(dn));

    debug(user)
    return User.authenticate()(user.username, req.credentials, (err, user, info) => {
        if (err || !user)
            return next(info)
        res.end();
        return next();
    })

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
    const dn = req.dn.toString();
    log(req, "SEARCH");

    let scopeCheck;
    let db = null;
    let entries;

    if (req.dn.equals('ou=users, o=ics'))
        db = User;
    if (req.dn.equals('ou=groups, o=ics'))
        db = Group;

    switch (req.scope) {
        case 'base':
            scopeCheck = (k) => {
                return req.dn.equals(k);
            };
            break;

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

    if (req.scope == "base")
        entries = await db.find({dn: dn}).lean();
    else
        entries = await db.find({dn: RegExp(dn)}).lean();
   
    for (const entry of entries) {
        if (!scopeCheck(entry.dn))
            continue;
      
        // 打补丁，去掉空格
        if (entry.member)
            entry.member = entry.member.map(dn => dn.replace(/ /g, ""));

        if (req.filter.matches(entry)) {
            res.send({
                dn: entry.dn,
                attributes: entry
            });
        }
    }
    res.end();

    return next();
});

server.listen(config.ldap.port, () => {
    console.log('LDAP server up at: %s', server.url);
});
