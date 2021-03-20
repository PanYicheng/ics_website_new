const User = require('../../models/user.js');
const debug = require('debug')('ics:admin-edit-article');
const ldapClient = require('../../ldap/ldap-client')
const _ = require("lodash")
exports.url = ['/admin/create-user', '/admin/users/:id/edit'];

exports.get = function(req, done, fail) {
    var id = req.params.id;

    if (id) {
        User
            .findById(id)
            .execAsync()
            .then(user => done({ user }))
            .catch(fail);
    } 
    else done();
};

exports.post = function(req, done, fail, res) {
    var user = req.body;

    ldapClient.addUser(user)
        .then(x => res.redirect('/admin/users'))
        .catch(err =>  done({message: err.message}));
};

exports.put = function(req, done, fail, res) {
    var id = req.params.id;

    User.findById(id, (err, user) => {
        if (err) 
            return err;
        password = req.body.password;
        Object.assign(user, _.omit(req.body, "password"))
            .setPassword(password, (err, user) => user.save())
    })
        .execAsync()
        .then(x => res.redirect(`/admin/users/${id}/edit`))
        .catch(err =>  done({message: err.message}));
};
