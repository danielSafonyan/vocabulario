const router = require('express').Router();
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose')
const User = mongoose.models.User;
const genPassword = require('../lib/passwordUtils').genPassword;


require('../config/database')

router.route('/register')
            .get(getRegister)
            .post(postRegister)

router.route('/login')
            .get(getLogin)
            .post(passport.authenticate('local', {
                successRedirect: '/success',
                failureRedirect: '/fail',
            }), postLogin)

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
        userExists = await User.findOne({ email: req.body.email })
    } catch (err) {
        console.error(err);
        res.status(500).send(`Internal server error: ${err}.`)
    }

    console.log(userExists)

    if (userExists) {
        return res.status(409).send(`User ${req.body.email} already exists.`)
    }

    const newUser = new User({
        username: req.body.email,
        // username: req.body.username, TODO: function generating random usernames.
        email: req.body.email,
        hash: hash,
        salt: salt,
    });

    try {
        const user = await newUser.save()
        console.log(user)
        res.redirect('/login');
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


module.exports = router