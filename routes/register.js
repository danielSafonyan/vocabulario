const path = require('path');
const mongoose = require('mongoose')
const User = mongoose.models.User;
const genPassword = require('../lib/passwordUtils').genPassword;

function getRegister(req, res, next) {
    const registerHtml = path.join(__dirname, '..', 'pages', 'register.html')
    res.status(200).sendFile(registerHtml)
}

async function postRegister(req, res, next) {
    const saltHash = genPassword(req.body.password);
    
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    let userExists

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
    } catch (err) {
        
    }

    
        .then((user) => {
            console.log(user);
        });

    res.redirect('/login');
}

module.exports = {
    getRegister,
    postRegister
}
