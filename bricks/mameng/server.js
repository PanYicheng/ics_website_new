exports.url = '/mameng';
exports.get = function(req, done, fail) {
    done({
        members_teacherActive:'active',
        // membersActive:'active'
        mamengActive:'active'
    });
};  