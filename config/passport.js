const passport = require('passport')
const mongoose = require('mongoose')
const LocalStrategy = require('passport-local').Strategy
const validPassword = require('../lib/passwordUtils').validPassword;
const User = mongoose.models.User;

// const customFields = {
//     usernameField: "email"
// }

// const strategy = new LocalStrategy(customFields, verifyFunction)
const strategy = new LocalStrategy(verifyFunction)

passport.use(strategy)

/**
 * This function is used in conjunction with the `passport.authenticate()` method.  See comments in
 * `passport.use()` above ^^ for explanation
 */
passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

/**
 * This function is used in conjunction with the `app.use(passport.session())` middleware defined below.
 * Scroll down and read the comments in the PASSPORT AUTHENTICATION section to learn how this works.
 * 
 * In summary, this method is "set" on the passport object and is passed the user ID stored in the `req.session.passport`
 * object later on.
 */

passport.deserializeUser(async function(id, cb) {
    try {
        const user = await User.findById(id)
        cb(null, user)
    } catch (err) {
        return cb(err)
    }
});

function verifyFunction(username, password, next) {
    User.findOne({ username })
        .then(user => {
            if (!user) {
                return next(null, false);
            }
            const isValid = validPassword(password, user.hash, user.salt);
            if (isValid) {
                return next(null, user);
            } else {
                return next(null, false);
            }
        })
        .catch(err => {
            next(err);
        });
}
