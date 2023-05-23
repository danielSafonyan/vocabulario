const mongoose = require('mongoose')
const User = mongoose.models.User;

function getTranslation(req, res, next) {
    const word = req.query.word
    console.log(word)
    console.log("Cheking if the database has this word.")
        console.log("Cheking if the user has this word in list.")
            console.log("If the word in list - mark as doesn't know.")
    // if word not in DB - make API request. 
        // add word to db 
        // add word to user
    res.redirect(303, `/word/${word}`)
}

module.exports = {
    getTranslation
}