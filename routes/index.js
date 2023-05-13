const router = require('express').Router();
const createError = require('http-errors')
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose')
require('../config/database')
const User = mongoose.models.User;
const genPassword = require('../lib/passwordUtils').genPassword;
const { 
    getTranslationLanguage, 
    getSuggestionLanguage, 
    patchTranslationLanguage, 
    patchSuggestionLanguage 
} = require('./translationLanguage')

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
            .get(getSuggestionLanguage)
            .patch(patchSuggestionLanguage)

router.route('/translation-language')
            .get(getTranslationLanguage)
            .patch(patchTranslationLanguage)

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

module.exports = router