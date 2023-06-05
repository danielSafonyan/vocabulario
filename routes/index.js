const router = require('express').Router();
const createError = require('http-errors')
const path = require('path');
const passport = require('passport');

const mongoose = require('mongoose')
require('../config/database')
const User = mongoose.models.User;

const { postRegister, getRegister } = require('./register')
const { getWordList } = require('./wordList')

router.route('/register')
            .get(getRegister)
            .post(postRegister)
            
router.route('/login')
            .get((req, res, next) => {
                    res.status(200).render('login')
                })
            .post(passport.authenticate('local', {
                successRedirect: '/',
                failureRedirect: '/fail',
            }))

router.route('/addWord')
            .post(async (req, res, next) => {
                if (!req.isAuthenticated()) {
                            return res.status(401).json({ err: 'Not Authenticated' });
                        }
                const { newWord } = req.body
                if (!newWord) {
                            return res.status(400).json({ err: 'No Word In Payload' });
                        }
                const userId = req.user.id

                try {
                    const user = await User.findById(userId)
                    user.wordList.push(newWord)
                    await user.save();
                    res.status(200).json({status: 200, msg: `Word ${newWord.baseWord} added successfully.`})
                } catch (err) {
                    return res.status(500).json({ err });
                }
                    })

router.route('/wordList')
                    .get(getWordList)

router.get('/', (req, res) => {
    if (!req.isAuthenticated()) {
                            return res.status(401).json({ err: 'Not Authenticated' });
                        }
    res.render('main')
})

router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.get('/protected-route', (req, res) => {
    const isAuth = req.isAuthenticated()

    if (isAuth) {
        res.send("You are authenticated!")
    } else {
        res.send("You are NOT authenticated!")
    }
})



module.exports = router