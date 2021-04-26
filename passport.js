var cookieParser = require("cookie-parser");
var session = require("express-session");
const debug = require("debug")("ics:passport");
var User = require("./models/user");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var ldapClient = require("./ldap/ldap-client");

//passport.use(User.createStrategy()); // change this
// Set a timeout for the promise.
const timeout = (prom, time, exception) => {
	let timer;
	return Promise.race([
		prom,
		new Promise((_r, rej) => timer = setTimeout(rej, time, exception))
	]);
}


passport.use(
  new LocalStrategy(async function (username, password, done) {
    debug(`passport is authenticating user '${username}' with password '${password}'.`);
    
    let timeoutError = Symbol()

    try {
      const valid = await timeout(ldapClient.validateUser(username, password), 1000, timeoutError);
      if (!valid) {
        debug("authenticate failed.")
        done(null, false);
      }
      // TODO: replace the template user model with content retrieved from the LDAP server.
      debug("authenticate succeed.")
      done(
        null,
        {
          name: username,
          username: username,
          admin: true
        }
      );
    }catch(e) {
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
    // ldapClient.validateUser(username, password)
    //   .then(valid => {
    //     if (!valid) {
    //       debug("authenticate failed.")
    //       done(null, false);
    //     }
    //     // TODO: replace the template user model with content retrieved from the LDAP server.
    //     debug("authenticate succeed.")
    //     done(
    //       null,
    //       new User({
    //         name: username,
    //         username: username,
    //         dn: `cn=${username}`,
    //       })
    //     );
    //   })
    //   .catch((e) => {
    //     if (e === timeoutError) {
    //       // handle timeout
    //       debug("authenticate failed. Timeout after 1000 ms.");
    //       done(null, false);
    //     } else {
    //       // other error
    //       debug("authenticate failed.", e);
    //       done(null, false);
    //     }
    //   });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.username);
});

passport.deserializeUser(function (username, done) {
  done(null, {username: username, name: username});
});

module.exports = passport;
