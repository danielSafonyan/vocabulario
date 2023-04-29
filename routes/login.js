const path = require('path');

function getLogin(req, res, next) {
    const loginHtml = path.join(__dirname, '..', 'pages', 'login.html')
    res.status(200).sendFile(loginHtml)
}

function postLogin(req, res, next) {
    const body = req.body
    res.status(200).json(body)
}

module.exports = {
    getLogin,
    postLogin
}
