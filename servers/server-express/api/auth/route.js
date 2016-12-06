const express = require('express')
const router = express.Router()
const passport = require('passport')

const auth = require('./controller')

// -----------------------------------------------------------------------------
// AUTHENTICATION
// -----------------------------------------------------------------------------

// SIGN UP
// Require email, name, username, passsword
router.post('/signup', auth.isAccountExist, auth.signup)

// SIGN IN
// Require username and passsword
router.post('/signin', auth.signin)

// SIGN OUT
// Not necessary if using different host/port
router.get('/signout', auth.isAuthenticated, auth.signout)
router.post('/signout', auth.isAuthenticated, auth.signout)

// IS ACCOUNT EXIST?
// Require 'username'
router.post('/is-account-exist', auth.isAccountExist, (req, res) => { res.json({m: `Account with username '${req.body.username}' is available.`}) })

// IS AUTHENTICATED?
// Require 'Authorization: Bearer JWT'
router.post('/is-authenticated', auth.isAuthenticated, (req, res) => { res.json({m: `Account with that token is authenticated.`}) })

// IS ADMIN?
// Require 'Authorization: Bearer JWT' with Admin role
router.post('/is-admin', auth.isAdmin, (req, res) => { res.json({m: `Account with that token is an admin.`}) })

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
