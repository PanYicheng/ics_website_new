var cookieParser = require("cookie-parser");
var session = require("express-session");
const debug = require("debug")("ics:passport");
var User = require("./models/user");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var ldapClient = require("./ldap/ldap-client");

//passport.use(User.createStrategy()); // change this
passport.use(
  new LocalStrategy(
    function (username, password, done) {
        debug(`passport is authenticating ${username} with ${password}.`);
        ldapClient.validateUser(username, password).then(
          valid => {
            if (!valid) {
              done(null, false);
            }
            User.findOne({ username: username }).then(
              user => done(null, user));
          }
        )
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = passport;
