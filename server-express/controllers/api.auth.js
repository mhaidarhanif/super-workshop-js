const passport = require('passport')
const jwt = require('jsonwebtoken')

const Account = require('../models/account')

const Auth = module.exports = {

  /**
   * Create a new account
   */
  signup: (req, res, next) => {
    req.checkBody('name', 'Full Name is required').notEmpty()
    req.checkBody('username', 'Username is required').notEmpty()
    req.checkBody('email', 'Email is required').notEmpty()
    req.checkBody('password', 'Password is required').notEmpty()

    // passport-local-mongoose
    Account.register(new Account({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email
    }), req.body.password,
    (err, account) => {
      if (err) res.json({ error: err.message })
      if (!account) res.json({ success: false, message: 'Sign up failed.' })

      // Automatically sign in after successful sign up
      Auth.signin(req, res, next)
    })
  },

  /**
   * Sign in a signed up account
   */
  signin: (req, res, next) => {
    req.checkBody('username', 'Username is required').notEmpty()
    req.checkBody('password', 'Password is required').notEmpty()

    passport.authenticate('local', {
      successRedirect: '/',
      successFlash: true,
      failureRedirect: '/', // Depends on client
      failureFlash: true
    }, (err, user, info) => {
      if (err) return next(err)
      if (!user) return res.status(401).json({ status: 'error', code: 'Sign in failed because user is not found.' })

      const content = {
        payload: { // or claims
          iss: process.env.URL,    // ISSUER: URL of the service
          sub: user._id,           // SUBJECT: OID/UID of the user in system
          id: user.accountId,      // ACCOUNTID: Sequential ID of the user
          scope: 'self, profile',  // SCOPE: Choose specific payload/claims
          username: user.username, // USERNAME: Lowercased username of the user
          name: user.name          // NAME: Full name of the user
        },
        secret: process.env.SECRET,
        options: {
          issuer: process.env.HOST,
          expiresIn: '1d'
        }
      }

      return res.status(200).json({
        token: jwt.sign(content.payload, content.secret, content.options)
      })
    })(req, res, next)
  },

  /**
   * Sign out
   */
  signout: (req, res) => {
    req.logout()
    res.status(200).json({ message: 'Sign out succeded' })
  },

  /**
   * Check whether the username is already signed up
   */
  isAccountExist: (req, res, next) => {
    Account.count({
      username: req.body.username
    }, (err, count) => {
      if (err) return res.json({ success: false, message: 'Failed to check Account existency.' })
      else if (count === 0) next()
      else return res.json({ 'message': `Account with username ${req.body.username} is already exist.` })
    })
  },

  /**
   * Check whether the user is authenticated
   */
  isAuthenticated: (req, res, next) => {
    // Check for token from various ways
    let token = req.body.token || req.query.token || req.headers.authorization.split(' ')[1] || 0

    // There's a token coming in...
    // console.log('token:', token)

    // Decode token if available
    if (token !== 0) {
      // Verifies secret and checks expiration
      jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
          return res.json({
            success: false,
            message: 'Failed to authenticate token.'
          })
        } else {
          // If everything is good, save to request for use in other routes
          // req.decoded = decoded
          next()
        }
      })
    } else {
      // if there is no token, return an error
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      })
    }
    // Finish token checker for authentication
  }

  // api.auth.js
}
