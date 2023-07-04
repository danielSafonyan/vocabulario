const router = require('express').Router();
const createError = require('http-errors')
const path = require('path');
const passport = require('passport');

const mongoose = require('mongoose')
require('../config/database')
const User = mongoose.models.User;

const { postRegister, getRegister } = require('./register')
const { getWordList, deleteWordList, patchWordList } = require('./wordList')
const { getPracticeWords } = require('./practiceWords')

router.route('/register')
            .get(getRegister)
            .post(postRegister)
            
router.route('/login')
            .get((req, res, next) => {
                    res.status(200).render('login')
                })
                // .post(passport.authenticate('local'))
            .post(passport.authenticate('local', {
                successRedirect: '/',
                // failureRedirect: '/login',
            }))

router.route('/addWord')
            .post(async (req, res, next) => {
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
                    .delete(deleteWordList)
                    .patch(patchWordList)

router.route('/practiceWords')
                    .get(getPracticeWords)

router.get('/', (req, res) => {
    res.render('main', { nickname: req.user.nickname })
})

router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

module.exports = router