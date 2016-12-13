const express = require('express')
const router = express.Router()
const passport = require('passport')

const auth = require('./controller')

// -----------------------------------------------------------------------------
// AUTHENTICATION
// -----------------------------------------------------------------------------

// Get all accounts
router.get('/', auth.isWithToken, auth.getInfo)

// SIGN UP
// Require email, name, username, passsword
router.post('/signup', auth.isAccountExist, auth.signup)
// router.post('/signup', auth.signup)

// SIGN IN
// Require username and passsword
router.post('/signin', auth.signin)

// SIGN OUT
// Not necessary if using different host/port
router.get('/signout', auth.isAuthenticated, auth.signout)
router.post('/signout', auth.isAuthenticated, auth.signout)

// IS WITH TOKEN?
// Require 'Authorization: Bearer JWT' (Optional)
router.get('/is-with-token', auth.isWithToken, (req, res) => { res.json(req.info) })
router.post('/is-with-token', auth.isWithToken, (req, res) => { res.json(req.info) })

// IS ACCOUNT EXIST?
// Require 'username'
router.post('/is-account-exist', auth.isAccountExist, (req, res) => { res.json({m: `Account with username '${req.body.username}' is available.`}) })

// IS AUTHENTICATED?
// Require 'Authorization: Bearer JWT'
router.post('/is-authenticated', auth.isAuthenticated, (req, res) => { res.json({m: `Account with that token is authenticated.`}) })

// IS ADMIN?
// Require 'Authorization: Bearer JWT' with Admin role
router.post('/is-admin', auth.isAdmin, (req, res) => { res.json({m: `Account with that token is an admin.`}) })

// IS WITH API KEY?
// Require 'X-API-Key: String'
router.post('/is-with-api-key', auth.isWithAPIKey, (req, res) => { res.json({m: `Accepted API Key: ${req.apikey}`}) })

// IS TEST?
// Require 'X-API-Key: String' with test environment
router.post('/is-test', [auth.isWithAPIKey, auth.isTest], (req, res) => { res.json({m: `Accepted as a test environment.`}) })

// -----------------------------------------------------------------------------
// OAUTH THIRD PARTY
//
// There's no actual controller here since for each API endpoint,
// they're only calling authentication through Passport.
//
// Primarily:
// 1. Auth with OAuth provider
// 2. Get access token from that
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// GITHUB
// -----------------------------------------------------------------------------

router.get('/github',
  passport.authenticate('github')
)

router.get('/github/callback',
  passport.authenticate('github', {
    successRedirect: '/profile',
    failureRedirect: '/'
  })
)

// -----------------------------------------------------------------------------
// FACEBOOK
// -----------------------------------------------------------------------------

router.get('/facebook',
  passport.authenticate('facebook', {
    scope: ['email']
  }))

router.get('/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
  })
)

// -----------------------------------------------------------------------------
// TWITTER
// -----------------------------------------------------------------------------

router.get('/twitter',
  passport.authenticate('twitter')
)

router.get('/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect: '/profile',
    failureRedirect: '/'
  })
)

// -----------------------------------------------------------------------------
// GOOGLE
// -----------------------------------------------------------------------------

router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  }))

router.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }))

// -----------------------------------------------------------------------------

module.exports = router
