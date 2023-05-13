const mongoose = require('mongoose')
const User = mongoose.models.User;

const languages = {
        'en': 'inglés',
        'ru': 'ruso',
        'de': 'alemán',
        'it': 'italiano',
        'fr': 'francés',
    }

function getTranslationLanguage(req, res, next) {
    res.status(200).render('translationLanguage', { languages })
}

function getSuggestionLanguage(req, res, next) {
    const isReferred = req.headers.referer && req.headers.referer !== req.url;
    
    // if (!isReferred) {
    //     return next(createError(404, "Not Found"))
    // }
    
    const defaultLanguage = 'en'
    const acceptLanguageHeader = req.headers['accept-language'] || defaultLanguage;
    const languageRegex = /(en|ru|de|it|fr|es)/i;
    const transLang = acceptLanguageHeader.match(languageRegex).pop()
    const dispLang = languages[transLang]
    res.status(200).render('suggestedLanguage', { dispLang, transLang })
}

function patchTranslationLanguage(req, res, next) {
    if (!req.user) { res.redirect('/') }
    
    updateTransLang(req, next)

    res.redirect(303, '/changedLang')
}

function patchSuggestionLanguage(req, res, next) {
    if (!req.user) { res.redirect('/') }

    updateTransLang(req, next)

    // redirect to the '/' if it's after registration
    res.redirect(303, '/');
    // redirect to 'settings if regferrer is settings'
    // TODO
}

async function updateTransLang(req, next) {
    const userId = req.session.passport.user
    const { transLang } = req.body

    try {
        console.log(`Updating ${userId} in db. Setting transLang to ${transLang}.`)
        const updatedUser = await User.findByIdAndUpdate(userId, { transLang:  transLang}, { new: true })
        console.log('updatedUser', updatedUser)
    } catch (err) {
        next(err)
    }
}

module.exports = {
    getTranslationLanguage,
    getSuggestionLanguage,
    patchTranslationLanguage,
    patchSuggestionLanguage
}