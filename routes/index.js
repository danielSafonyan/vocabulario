const router = require('express').Router();
const path = require('path');
require('../config/database')

const { getRegister, postRegister } = require('./register')
const { getLogin, postLogin } = require('./login')

router.route('/register')
            .get(getRegister)
            .post(postRegister)

router.route('/login')
            .get(getLogin)
            .post(postLogin)


module.exports = router