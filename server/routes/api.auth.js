const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')

const auth = require('../controllers/api.auth.js')

/*
--------------------------------------------------------------------------------
Account
--------------------------------------------------------------------------------
*/

// SIGN UP
router.post('/signup', [auth.isAccountExist, auth.isSignedIn], auth.signup)

// SIGN IN
router.post('/signin', auth.signin)

// SIGN OUT
router.get('/signout', auth.signout)

/*
--------------------------------------------------------------------------------
OAuth Third Party
There's no actual controller here since for each API endoint,
they're only call authentication through passport.
--------------------------------------------------------------------------------
*/

/*
GitHub
*/

router.get('/github',
  passport.authenticate('github')
)

router.get('/github/callback',
  passport.authenticate('github', {
    successRedirect: '/profile',
    failureRedirect: '/'
  })
)

/*
Facebook
*/

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

/*
Twitter
*/

router.get('/twitter',
  passport.authenticate('twitter')
)

router.get('/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect: '/profile',
    failureRedirect: '/'
  })
)

/*
Google
*/

router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  }))

router.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }))

module.exports = router
