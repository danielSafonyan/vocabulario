const router = require('express').Router();
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose')
require('../config/database')
const User = mongoose.models.User;
const genPassword = require('../lib/passwordUtils').genPassword;

router.route('/register')
            .get(getRegister)
            .post(postRegister)

router.route('/login')
            .get(getLogin)
            .post(passport.authenticate('local', {
                successRedirect: '/success',
                failureRedirect: '/fail',
            }), postLogin)

router.route('/suggested-language')
            .get(getLanguageSuggestions)

router.get('/protected-route', (req, res) => {
    const isAuth = req.isAuthenticated()

    if (isAuth) {
        res.send("You are authenticated!")
    } else {
        res.send("You are NOT authenticated!")
    }
})

router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

async function postRegister(req, res, next) {
    const saltHash = genPassword(req.body.password);
    
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    let userExists;

    try {
        userExists = await User.findOne({ username: req.body.username })
    } catch (err) {
        console.error(err);
        res.status(500).send(`Internal server error: ${err}.`)
    }

    console.log('userExists:', userExists)

    if (userExists) {
        return res.status(409).send(`User ${req.body.username} already exists.`)
    }

    const newUser = new User({
        username: req.body.username,
        // username: req.body.username, TODO: function generating random usernames.
        email: req.body.username,
        hash: hash,
        salt: salt,
    });

    try {
        const user = await newUser.save()
        req.login(user, function(err) {
            if (err) { return next(err); }
            return res.redirect('/suggested-language');
            });
    } catch (err) {
        res.status(500).send(`Internal server error: ${err}.`)
    }
}

function getRegister(req, res, next) {
    const registerHtml = path.join(__dirname, '..', 'pages', 'register.html')
    res.status(200).sendFile(registerHtml)
}

function getLogin(req, res, next) {
    const loginHtml = path.join(__dirname, '..', 'pages', 'login.html')
    res.status(200).sendFile(loginHtml)
}

function postLogin(req, res, next) {
    const body = req.body
    res.status(200).json(body)
}

function getLanguageSuggestions(req, res, next) {
    const languages = {
        'en': 'inglés',
        'ru': 'ruso',
        'de': 'alemán',
        'it': 'italiano',
        'fr': 'francés'
    }
    const defaultLanguage = 'en'
    const acceptLanguageHeader = req.headers['accept-language'] || defaultLanguage;
    const languageRegex = /(en|ru|de|it|fr|es)/i;
    const suggestedLanguage = acceptLanguageHeader.match(languageRegex).pop()
    
    res.send(`suggestedLanguage ${languages[suggestedLanguage]}`)
}


module.exports = router