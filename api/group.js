var router = require('express').Router();
var Group = require('../models/group.js');

router.delete('/:id', function(req, res, next) {
    Group
        .findByIdAndRemove(req.params.id)
        .execAsync()
        .then(x => res.json(x))
        .catch(next);
});

router.delete('/:id/:dn', function(req, res, next) {
    Group
        .findByIdAndUpdate(req.params.id, {
            $pull: {
                member: req.params.dn
            }})
        .execAsync()
        .then(x => res.json(x))
        .catch(next);
});

module.exports = router;

