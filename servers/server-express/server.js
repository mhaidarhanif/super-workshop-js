'use strict'

// -----------------------------------------------------------------------------
// REQUIRE NODE MODULES
// -----------------------------------------------------------------------------

// EXPRESS
const express = require('express')
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const expressValidator = require('express-validator')
const cors = require('cors')

// INITIALIZE EXPRESS APP
const app = express()

// DATA
const mongoose = require('mongoose')
const passport = require('passport')

// -----------------------------------------------------------------------------
// REQUIRE INTERNAL MODULES
// -----------------------------------------------------------------------------

// MODELS
// const Account = require('./api/accounts/model')
// const Book = require('./api/books/model')

// ROUTES
const auth = require('./auth/route')
const api = require('./api/route')
const apiAccounts = require('./api/accounts/route')
const apiBooks = require('./api/books/route')

// -----------------------------------------------------------------------------
// CONFIGURE APP + DATA
// -----------------------------------------------------------------------------

// EXPRESS
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressValidator())
app.use(cors())

/*
 * MONGODB + MONGOOSE
 * Prevent this DeprecationWarning
 * Mongoose: mpromise (mongoose's default promise library) is deprecated,
 * plug in your own promise library instead:
 * http://mongoosejs.com/docs/promises.html
 */
mongoose.Promise = global.Promise // native Node.js promise
mongoose.connect(process.env.MONGODB_URI)

// EXPRESS SESSION
app.use(expressSession({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

// -----------------------------------------------------------------------------
// CONFIGURE ROUTES
// -----------------------------------------------------------------------------

// PASSPORT
app.use(passport.initialize())
app.use(passport.session())

// PUBLIC ROUTES
app.use('/', api)
app.use('/auth', auth)
app.use('/api/accounts', apiAccounts)
app.use('/api/books', apiBooks)

// -----------------------------------------------------------------------------
// EXPORT THE APP
// -----------------------------------------------------------------------------

module.exports = app
