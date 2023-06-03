const mongoose = require('mongoose')
require('../config/database')
const User = mongoose.models.User;
const genPassword = require('../lib/passwordUtils').genPassword;

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
            return res.redirect('/');
            });
    } catch (err) {
        res.status(500).send(`Internal server error: ${err}.`)
    }
}

function getRegister(req, res, next) {
    res.status(200).render('register')
}

module.exports = { postRegister, getRegister }