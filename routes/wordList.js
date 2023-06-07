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


async function deleteWordList(req, res, next) {
    const { wordId } = req.body
    const user = await User.findById(req.user.id)
    
    console.log("listlengthBefore" , user.wordList.length)
    const wordIndex = user.wordList.findIndex(el => el.id === wordId)
    user.wordList.splice(wordIndex, 1)
    console.log("listlengthAfter" , user.wordList.length)
    await user.save()

    res.status(200).json({
        status: 200,
        msg: "Successfully deleted a word!"
    })
}



module.exports = {
    getWordList,
    deleteWordList
}