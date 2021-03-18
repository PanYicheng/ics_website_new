var cookieParser = require('cookie-parser');
var session = require('express-session');
var User = require('./models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var {validateUser} = require('./ldap/ldap-client')
//passport.use(User.createStrategy()); // change this
passport.use(new LocalStrategy(
    async function(username, password, done) {
     //   if (!user)
       //     return done(null, false);

        var valid = await validateUser(username, password)
        if (!valid)
            return done(null, false);

        var user = await User.findOne({username: username});
        return done(null, user);
    }
));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

module.exports = passport;

