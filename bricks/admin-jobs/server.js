const _ = require('lodash');
const debug = require('debug')('ics:jobs');
const Job = require('../../models/job.js');

exports.url = ['/admin/jobs', '/admin'];

exports.get = function(req, done, fail) {
    if(!req.user) return fail(401);
    //debug(Article);

    Job.find()
        .populate('creator')
        .execAsync()    //执行上面的两步操作
        .then(jobs => {     //把上面的结果进行回调到jobs里面
            done({
                jobActive: 'active',
                title: '文章管理',
                jobs: jobs  //把上面jobs里面的值给左边的标识符
            });
        })
        .catch(fail);

};
