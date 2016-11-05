const passport = require('passport')
const Account = require('../models/account')

module.exports = {

  /*
    Create a new account
  */
  signup: (req, res, next) => {
    // express-validator
    req.checkBody('name', 'Full Name is required').notEmpty()
    req.checkBody('username', 'Username is required').notEmpty()
    req.checkBody('email', 'Email is required').notEmpty()

    // passport-local-mongoose
    Account.register(new Account({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email
      }), req.body.password,
      function (err, account) {
        if (err) return res.json({ error: err.message })
        passport.authenticate('local')(req, res, () => {
          req.session.save(function (err, next) {
            if (err) return next(err)
            res.json(user)
          })
        })
      })
  },

  /*
    Sign in a signed up account
  */
  signin: (req, res) => {
    res.json(user)
  },

  /*
    Sign out
  */
  signout: (req, res) => {
    req.logout()
    req.session.destroy()
  },

  /*
    Check whether the user is authenticated
  */
  isAuthenticated: (req, res, next) => {
    if (req.user) next()
    else res.send('You are no authenticated')
  },

  /*
    Check whether the user is signed in
  */
  isSignedIn: (req, res, next) => {
    if (req.isAuthenticated()) res.send('You are already signed in')
    else next()
  },

  /*
    Check whether the username is already signed up
  */
  isAccountExist: (req, res, next) => {
    Account.count({
      username: req.body.username
    }, (err, count) => {
      if (count === 0) next()
      else res.json({ 'message': `Account with username ${req.body.username} is already exist` })
    })
  }

}
