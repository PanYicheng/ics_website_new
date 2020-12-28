exports.url = ['/summercourse2019','/summercourse'];
exports.get = function(req, done, fail) {
    done({
        cooperationActive:'active',
        cooperation_trainingActive:'active'
    });
};