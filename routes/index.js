const router = require('express').Router();
const createError = require('http-errors')
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose')
require('../config/database')
const User = mongoose.models.User;
const genPassword = require('../lib/passwordUtils').genPassword;
const { getTranslationLanguage } = require('./translationLanguage')

router.route('/register')
            .get(getRegister)
            .post(postRegister)
            
router.get('/', (req, res) => {
    res.send("Language saved!")
})

router.route('/login')
            .get(getLogin)
            .post(passport.authenticate('local', {
                successRedirect: '/success',
                failureRedirect: '/fail',
            }))

router.route('/suggested-language')
            .get(getLanguageSuggestion)
            .patch(patchLanguageSuggestion)

router.route('.translation-language')
            .get(getTranslationLanguage)

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
        transLang: ''
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
    res.status(200).render('register')
}

function getLogin(req, res, next) {
    res.status(200).render('login')
}

function getLanguageSuggestion(req, res, next) {
    const isReferred = req.headers.referer && req.headers.referer !== req.url;
    
    // if (!isReferred) {
    //     return next(createError(404, "Not Found"))
    // }

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
    const transLang = acceptLanguageHeader.match(languageRegex).pop()
    const dispLang = languages[transLang]
    res.status(200).render('suggestedLanguage', { dispLang, transLang })
}

async function patchLanguageSuggestion(req, res, next) {
    if (!req.user) {
        res.redirect('/');
    }

    // Get data from the request
    const userId = req.session.passport.user
    const { transLang } = req.body


    try {
        console.log(`Updating ${userId} in db. Setting transLang to ${transLang}.`)
        const updatedUser = await User.findByIdAndUpdate(userId, { transLang:  transLang}, { new: true })
        console.log('updatedUser', updatedUser)
    } catch (err) {
        next(err)
    }

    // redirect to the '/' if it's after registration
    res.redirect(303, '/');
    // redirect to 'settings if regferrer is settings'
    // TODO
    
}



module.exports = router