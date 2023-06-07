const mongoose = require('mongoose')
// require('../config/database')
const User = mongoose.models.User;

async function getWordList(req, res, next) {
    if (!req.isAuthenticated()) {
                            return res.status(401).json({ err: 'Not Authenticated' });
                        }

    const { wordList } = await User.findById(req.user.id)

    res.status(200).render('wordList', { wordList })
}


async function deleteWordList(req, res, next) {
    try {
        const user = await User.findById(req.user.id)
        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }
        
        const wordIndex = user.wordList.findIndex(el => el.id === req.body.wordId)
        if (wordIndex === -1) {
            return res.status(404).json({ status: 404, message: "Word not found" });
        }

        user.wordList.splice(wordIndex, 1)
        await user.save()
    
        res.status(200).json({
            status: 200,
            msg: "Successfully deleted a word!"
        })
    } catch (err) {
        console.error("Error deleting word:", err);
        res.status(500).json({ status: 500, message: "Internal Server Error", err });
    }
}



module.exports = {
    getWordList,
    deleteWordList
}