const _ = require('lodash');
const Group = require('../../models/group.js');
const User = require('../../models/user.js');

exports.url = '/admin/groups/:id/edit';

exports.get = function(req, done, fail) {
    Group.findById(req.params.id)
     //   .select("-member")
        .execAsync()
        .then(group => done({
            group
        }))
        .catch(fail);
};

exports.post = async function(req, done, fail, res) {
    var user = await User.findOne({username: req.body.username})
    var group = await Group.findById(req.params.id)
    if (!user)
        return done({
            group, 
            message: "user not found"
        });

    group.updateOne(
        { $addToSet: { member: user.dn}},
    )
        .then(x => res.redirect(req.originalUrl))
        .catch(fail);
};
