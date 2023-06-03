const router = require('express').Router();
const createError = require('http-errors')
const path = require('path');
const passport = require('passport');

const { postRegister, getRegister } = require('./register')

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
            .post((req, res, next) => {
                if (!req.isAuthenticated()) { return res.json({status: 'error'})}
                
                res.json({status: 'ok'})
                    })

router.get('/', (req, res) => {
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