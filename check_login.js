var debug = require('debug')('ics:check_login');
// 权限控制
module.exports = function() {
    return function(req, res, next) {
        debug("check_login() is called.")
        if (req.path.indexOf('/admin') == 0) {
            debug("check_login() in /admin.")
            if (!req.user) 
                return res.redirect(303, '/login?next=' + req.originalUrl);
            if (!req.user.admin) 
                return res.sendStatus(403);
        }
        next();
    }
}
