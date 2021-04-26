const debug = require("debug")("ics:passport");
// var User = require("./models/user");
const LDAPUser = require("./models/ldap_user")
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var ldapClient = require("./ldap/ldap-client");
const { use } = require("./api");

//passport.use(User.createStrategy()); // change this
// Set a timeout for the promise.
// TODO: add a way to clear the timeout. See https://advancedweb.hu/how-to-add-timeout-to-a-promise-in-javascript/
//       Currently there is no finally method so we cannot use the previous method.
const timeout = (prom, time, exception) => {
  let timer;
  return Promise.race([
    prom,
    new Promise((_r, rej) => (timer = setTimeout(rej, time, exception))),
  ]);
};

passport.use(
  new LocalStrategy(async function (username, password, done) {
    debug(
      `passport is authenticating user '${username}' with password '${password}'.`
    );

    let timeoutError = Symbol();
    try {
      const entry = await timeout(
        ldapClient.validateUser(username, password),
        1000,
        timeoutError
      );
      if (!entry) {
        debug("authenticate failed.");
        done(null, false);
      }
      // TODO: replace the template user model with content retrieved from the LDAP server.
      debug("authenticate succeed.");
      done(null, entry);
    } catch (e) {
      // error or timeout?
      if (e === timeoutError) {
        // handle timeout
        debug("authenticate failed. Timeout after 1000 ms.");
        done(null, false);
      } else {
        // other error
        debug("authenticate failed.", e);
        done(null, false);
      }
    }
  })
);

passport.serializeUser(function (user, done) {
  (new LDAPUser(user)).save(err => {
    debug(err)
  })
  done(null, user.dn);
});

passport.deserializeUser(function (dn, done) {
  LDAPUser.findOne({dn: dn}).lean().exec((err, user) => {
    if(err || !user){
      done(null, {})
    }
    try{
      user.name = user.displayName
      user.admin = false
      // If the user belongs to the administrators groups.
      if(user.memberOf.indexOf('cn=administrators,cn=groups,dc=pkuicsl,dc=synology,dc=me') !== -1){
        user.admin = true
      }
      debug("deserializeUser %j", user)
      done(null, user);
    } catch(e) {
      debug(e)
      done(null, {})
    }
  })
});

module.exports = passport;
