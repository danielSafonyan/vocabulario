const express = require('express')
const mongoose = require('mongoose');
const session = require('express-session');
var passport = require('passport');
var crypto = require('crypto');
const MongoStore = require('connect-mongo');
require('dotenv').config()
const router = require('./routes')


/**
 * -------------- GENERAL SETUP ----------------
 */

// Create the Express application
const app = express()

// Set EJS as the view engine
app.set('view engine', 'ejs');
// Buil-in middleware, parses incoming requests with JSON payloads.
app.use(express.json())
// Buil-in middleware, parses incoming requests with URL-encoded payloads.
app.use(express.urlencoded({extended: true}));
// Buil-in middleware, serves static files from the public directory,
app.use(express.static('public'))

app.use(session({
    // Key is used to create a unique and secure signature for each session.
    secret: process.env.SECRET,
    // False prevents session saving on every request when nothing changed.
    resave: false,
    // False prevents the session from being saved to the store if it hasn't been modified.
    saveUninitialized: false,
    // Use MongoDB to store session data.
    store: MongoStore.create({
        mongoUrl: process.env.DB_STRING,
        collectionName: 'sessions'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
    }
}))

require('./config/passport')
app.use(passport.initialize())
app.use(passport.session())

// Imports all of the routes from ./routes/index.js
app.use(router)

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});