exports.url = '/summercourse2018';
exports.get = function(req, done, fail) {
    done({
        cooperationActive:'active',
        cooperation_trainingActive:'active'
    });
};