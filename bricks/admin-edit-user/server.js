const User = require('../../models/user.js');
const debug = require('debug')('ics:admin-edit-article');

exports.url = ['/admin/create-user', '/admin/users/:id/edit'];

var title = '添加用户';

exports.get = function(req, done, fail) {
    var id = req.params.id;

    if (id) {
        User
            .findById(id)
            .execAsync()
            .then(user => done({ user, title }))
            .catch(fail);
    } 
    else done({ title });
};

exports.post = function(req, done, fail, res) {
    var user = req.body;

    //兼容ldap
    user.dn = 'cn='+user.username+', ou=users, o=ics'
    console.log(user)
    User.create(user)
        .then(x => res.redirect('/admin/users'))
        .catch(fail);
};

exports.put = function(req, done, fail, res) {
    var id = req.params.id;

    User
        .findByIdAndUpdate(id, req.body)
        .execAsync()
        .then(x => res.redirect(`/admin/users/${id}/edit`))
        .catch(fail);
};
