'use strict'

// -----------------------------------------------------------------------------
// ENVIRONMENT VARIABLES
// -----------------------------------------------------------------------------

// Load .env if not using pm2
// pm2 will load env via ecosystem.config.js
if (!process.env.PM2_USAGE) {
  require('dotenv-extended').load()
}

// -----------------------------------------------------------------------------
// REQUIRE NODE MODULES
// -----------------------------------------------------------------------------

// NODE
const fs = require('fs')
const path = require('path')
const http = require('http')

// EXPRESS
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const expressValidator = require('express-validator')

// INITIALIZE EXPRESS APP
const app = express()

// DATA
const mongoose = require('mongoose')
const passport = require('passport')

// LOGGER
const morgan = require('morgan')
const winston = require('winston')
const expressWinston = require('express-winston')

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
const apiPosts = require('./api/posts/route')

// -----------------------------------------------------------------------------
// USE PLUGINS
// -----------------------------------------------------------------------------

// EXPRESS
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(expressValidator())
app.use(express.static(path.join(__dirname, 'public')))

// -----------------------------------------------------------------------------
// USE DATABASE
// -----------------------------------------------------------------------------

// MONGODB + MONGOOSE
mongoose.Promise = global.Promise // native Node.js promise
mongoose.connect(process.env.MONGODB_URI)

// -----------------------------------------------------------------------------
// USE SESSION
// -----------------------------------------------------------------------------

// EXPRESS SESSION
app.use(expressSession({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

// -----------------------------------------------------------------------------
// USE LOGGER
// -----------------------------------------------------------------------------

if (app.get('env') === 'dev') {
  // Log into file
  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'), {flags: 'a'})
  app.use(morgan('combined', {stream: accessLogStream}))

  // Log request
  app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console({
        json: false,
        colorize: true
      })
    ],
    meta: true, // log the meta data about the request
    msg: 'HTTP {{req.method}} {{req.url}}', // logging message formatting
    expressFormat: false, // default Express/morgan request formatting
    colorize: true, // Color the text and status code
    ignoreRoute: function (req, res) { return false } // skip some log messages
  }))

  // development error handler, will print stacktrace
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.send({
      message: err.message,
      error: err
    })
  })
}

// production error handler, no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.send({
    message: err.message,
    error: {}
  })
})

// -----------------------------------------------------------------------------
// CONFIGURE ROUTERS
// -----------------------------------------------------------------------------

// PASSPORT
app.use(passport.initialize())
app.use(passport.session())

// PUBLIC ROUTES
app.use('/', api)
app.use('/auth', auth)
app.use('/api/accounts', apiAccounts)
app.use('/api/books', apiBooks)
app.use('/api/posts', apiPosts)

// -----------------------------------------------------------------------------
// EXPORT THE APP
// -----------------------------------------------------------------------------

module.exports = app
