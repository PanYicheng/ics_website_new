const Job = require('../../models/job');
const _ = require('lodash');

exports.get = function(req, done, fail) {
    Job
        .find()
        .sort('-createdTime')
        .limit(12)
        .execAsync()
        .then(job => done({
            list1: _.slice(job, 0, 6),
            // list2: _.slice(news, 4, 8)
        }))
        .catch(fail);
};
