var router = require('express').Router();
var Job = require('../models/job.js');

router.delete('/:id', function(req, res, next) {
    Job
        .findByIdAndRemove(req.params.id)
        .execAsync()
        .then(x => res.json(x))
        .catch(next);
});

module.exports = router;
