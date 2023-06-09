const mongoose = require('mongoose')
// require('../config/database')
const User = mongoose.models.User;
const shuffleArray = require('../lib/getPracticeWordsArray')

async function getPracticeWords(req, res, next) {
    try {
        const { wordList } = await User.findById(req.user.id)
        if (wordList.length < 5) {
            return res.status(428).json({
                msg: "You should have at least five words to start practicing!"
            })
        }
        
        shuffleArray(wordList)
        const practiceWordlist = JSON.stringify(wordList.slice(0, 5))
        res.status(200).render('practiceWords', { practiceWordlist })
    } catch (err) {
        console.error("Error deleting word:", err);
        res.status(500).json({ status: 500, message: "Internal Server Error", err });
    }              
}

module.exports = {
    getPracticeWords
}