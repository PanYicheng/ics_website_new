const _ = require('lodash');
const debug = require('debug')('ics:downloads');
const File = require('../../models/file.js');

exports.url = '/downloads-mine';


exports.get = function(req, done, fail) {
    if(!req.user) return fail(401);
    // Filter
    File.find({creator: req.user.id})
        .populate('creator')
        .sort('-fileDate')
        .execAsync()
        .then(files => {
            // console.log(files);
            done({
                downloadsActive: 'active',
                // downloads_openActive:'active',
                title: '资源下载',
                files: files,
                req:req
            });
        })
        .catch(fail);
    
};