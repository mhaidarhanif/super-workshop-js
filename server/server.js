'use strict'

// -----------------------------------------------------------------------------
// NODE MODULES
// -----------------------------------------------------------------------------

// CONFIG
require('dotenv').config()

// Express dependencies
const express = require('express')
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const expressValidator = require('express-validator')
const cors = require('cors')

// JSON Web Tokens
const jwt = require('jsonwebtoken')
const ejwt = require('express-jwt')
const guard = require('express-jwt-permissions')()
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

// Initiate Express
const app = express()
const router = express.Router()

// Data and modeling
const mongoose = require('mongoose')

// Authentication
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GitHubStrategy = require('passport-github').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const TwitterStrategy = require('passport-twitter').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

// -----------------------------------------------------------------------------
// APP MODULES
// -----------------------------------------------------------------------------

// Models
const Account = require('./models/account')
const Book = require('./models/books')

// Routes
const api = require('./routes/api')
const apiAuth = require('./routes/api.auth')
const apiAccounts = require('./routes/api.accounts')
const apiBooks = require('./routes/api.books')

// Helpers
const providers = require('./helpers/providers')

// -----------------------------------------------------------------------------
// APP CONFIGURATION
// -----------------------------------------------------------------------------

// EXPRESS
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressValidator())
app.use(cors())

// MONGODB
mongoose.Promise = global.Promise // native Node.js promise
mongoose.connect(process.env.MONGODB_URI)

// SESSION
app.use(expressSession({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}))

// -----------------------------------------------------------------------------
// REGISTER ROUTES
// -----------------------------------------------------------------------------

// Authentication
app.use(passport.initialize())
app.use(passport.session())

// Normal routes
app.use('/', api)
app.use('/auth', apiAuth)
app.use('/api/accounts', apiAccounts)
app.use('/api/books', apiBooks)

// -----------------------------------------------------------------------------
// PASSPORT
// -----------------------------------------------------------------------------

// Local
passport.use(new LocalStrategy(Account.authenticate()))

// GitHub
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK,
    passReqToCallback: true
  },
  providers.github))

// Facebook
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['id', 'displayName', 'photos', 'email'],
    passReqToCallback: true
  },
  providers.facebook))

// Twitter
passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_API_KEY,
    consumerSecret: process.env.TWITTER_API_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK,
    passReqToCallback: true
  },
  providers.twitter))

// Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK,
    passReqToCallback: true
  },
  providers.google))

// Serialization
passport.serializeUser(Account.serializeUser())
passport.deserializeUser(Account.deserializeUser())

// -----------------------------------------------------------------------------
// RUN THE APP
// -----------------------------------------------------------------------------

const host = process.env.HOST || "localhost"
const port = process.env.PORT || "3000"

app.listen(port, host, (err) => {
  if (err) console.log(err)
  console.log(`Server is running on ${host}:${port}`)
})
