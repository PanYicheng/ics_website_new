const Job = require('../../models/job.js');
const debug = require('debug')('ics:admin-edit-job');

exports.url = ['/admin/create-job', '/admin/jobs/:id/edit'];

var title = '添加岗位';

exports.get = function(req, done, fail) {
    var id = req.params.id;

    if (id) {
        Job
            .findById(id)
            .execAsync()
            .then(job => done({ job, title }))
            .catch(fail);
    } 
    else done({ title });
};

exports.post = function(req, done, fail, res) {
    var job = new Job(req.body);
    job.creator = req.user.id;

    job.save()
        .then(x => res.redirect('/admin/jobs'))
        .catch(fail);
};

exports.put = function(req, done, fail, res) {
    var id = req.params.id;

    Job
        .findByIdAndUpdate(id, req.body)
        .execAsync()
        .then(x => res.redirect(`/admin/jobs/${id}/edit`))
        .catch(fail);
};
