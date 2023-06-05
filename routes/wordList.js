const mongoose = require('mongoose')
// require('../config/database')
const User = mongoose.models.User;

async function getWordList(req, res, next) {
    if (!req.isAuthenticated()) {
                            return res.status(401).json({ err: 'Not Authenticated' });
                        }

    const { wordList } = await User.findById(req.user.id)

    console.log(wordList.pop())

    res.status(200).render('wordList', { wordList })
}

module.exports = {
    getWordList
}