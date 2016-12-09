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

// PASSPORT
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GitHubStrategy = require('passport-github').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const TwitterStrategy = require('passport-twitter').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

// JSON WEB TOKENS
// const jwt = require('jsonwebtoken')
// const ejwt = require('express-jwt')
// const guard = require('express-jwt-permissions')()
// const JwtStrategy = require('passport-jwt').Strategy
// const ExtractJwt = require('passport-jwt').ExtractJwt

// -----------------------------------------------------------------------------
// REQUIRE INTERNAL MODULES
// -----------------------------------------------------------------------------

// MODELS
const Account = require('./api/accounts/model')
// const Book = require('./api/books/model')

// ROUTES
const api = require('./api/route')
const apiAuth = require('./api/auth/route')
const apiAuthProviders = require('./api/auth/providers')
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

// PASSPORT AUTHENTICATION
app.use(passport.initialize())
app.use(passport.session())

// PUBLIC ROUTES
app.use('/', api)
app.use('/auth', apiAuth)
app.use('/api/accounts', apiAccounts)
app.use('/api/books', apiBooks)

// -----------------------------------------------------------------------------
// CONFIGURE PASSPORT
// -----------------------------------------------------------------------------

// LOCAL
passport.use(new LocalStrategy(Account.authenticate()))

// GITHUB
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK,
  passReqToCallback: true
},
apiAuthProviders.github))

// FACEBOOK
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK,
  profileFields: ['id', 'displayName', 'photos', 'email'],
  passReqToCallback: true
},
apiAuthProviders.facebook))

// TWITTER
passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_API_KEY,
  consumerSecret: process.env.TWITTER_API_SECRET,
  callbackURL: process.env.TWITTER_CALLBACK,
  passReqToCallback: true
},
apiAuthProviders.twitter))

// GOOGLE
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK,
  passReqToCallback: true
},
apiAuthProviders.google))

// ACCOUNT SERIALIZATION
passport.serializeUser(Account.serializeUser())
passport.deserializeUser(Account.deserializeUser())

// -----------------------------------------------------------------------------
// EXPORT THE APP
// -----------------------------------------------------------------------------

module.exports = app
