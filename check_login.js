// 权限控制
module.exports = function() {
    return function(req, res, next) {
        if (req.path.indexOf('/admin') == 0) {
            if (!req.user) 
                return res.redirect(303, '/login?next=' + req.originalUrl);
            if (!req.user.admin) 
                return res.sendStatus(403);
        }
        next();
    }
}
