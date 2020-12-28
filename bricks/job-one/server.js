var Job = require('../../models/job.js');
var debug = require('debug')('ics:job-list');

exports.url = ['/job/:id'];//新闻和公告的内容都会所引到这里来

exports.get = function(req, done, fail) {
    Job
        .findById(req.params.id)
        .execAsync()
        .then(job => {
            done({
                title: job.title,
                job: job
            });
        });
};
