const _ = require('lodash');
const debug = require('debug')('ics:admin-user');
const Group = require('../../models/group.js');

exports.url = '/admin/groups';

exports.get = function(req, done, fail) {
    if(!req.user) return fail(401);
    Group.find()
        .select("-member")
        .execAsync()
        .then(items => {
            done({
                groupActive: 'active',
                groups: items
            });
        })
        .catch(fail);
};






