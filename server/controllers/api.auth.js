const passport = require('passport')
const jwt = require('jsonwebtoken')

const Account = require('../models/account')

module.exports = {

  /*
    Create a new account
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
      function (err, account) {
        if (err.name === 'MongoError' && err.code === 11000) {
          return res.status(500).send({ succes: false, message: 'Account already exist!' })
        }
        if (err) return res.json({ error: err.message })
        if (!account) return res.json({ success: false, message: 'Sign up failed.' });

        // passport.authenticate('local')(req, res, () => {
        //   req.session.save(function (err, next) {
        //     if (err) return next(err)
        //     res.json(user)
        //   })
        // })

        passport.authenticate('local', (err, user, info) => {
          if (err) return next(err)
          if (!user) return res.status(401).json({ status: 'error', code: 'Sign up then sign in failed.' })

          let profile = { id: user.id, username: user.username, name: user.name }
          res.status(200).json({ token: jwt.sign(profile, process.env.SECRET) })
        })(req, res, next)
      })
  },

  /*
    Sign in a signed up account
  */
  signin: (req, res, next) => {
    req.checkBody('username', 'Username is required').notEmpty()
    req.checkBody('password', 'Password is required').notEmpty()

    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err)
      if (!user) return res.status(401).json({ status: 'error', code: 'Sign in failed.' })

      let profile = { id: user.id, username: user.username, name: user.name }
      res.status(200).json({ token: jwt.sign(profile, process.env.SECRET) })
    })(req, res, next)
  },

  /*
    Sign out
  */
  signout: (req, res) => {
    req.logout()
    res.send(200);
    // req.session.destroy()
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
