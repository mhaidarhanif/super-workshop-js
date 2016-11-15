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
      (err, account) => {
        if (err) res.json({ error: err.message })
        if (!account) res.json({ success: false, message: 'Sign up failed.' })

        // passport.authenticate('local')(req, res, () => {
        //   req.session.save(function (err, next) {
        //     if (err) return next(err)
        //     res.json(user)
        //   })
        // })

        passport.authenticate('local', {
          successRedirect: '/',
          successFlash: true,
          // failureRedirect: '/auth/signup', // TODO for client
          failureFlash: true
        }, (err, user, info) => {
          if (err) return next(err)
          if (!user) return res.status(401).json({ status: 'error', code: 'Sign up succeded but sign in failed.' })

          return res.status(200).json({
            token: jwt.sign({
              sub: user._id,
              id: user.accountId,
              username: user.username,
              name: user.name
            }, process.env.SECRET)
          })
        })(req, res, next)
      })
  },

  /*
    Sign in a signed up account
  */
  signin: (req, res, next) => {
    req.checkBody('username', 'Username is required').notEmpty()
    req.checkBody('password', 'Password is required').notEmpty()

    passport.authenticate('local', {
      successRedirect: '/',
      successFlash: true,
      // failureRedirect: '/auth/signin', // TODO for client
      failureFlash: true
    }, (err, user, info) => {
      if (err) return next(err)
      if (!user) return res.status(401).json({ status: 'error', code: 'Sign in failed.' })

      return res.status(200).json({
        token: jwt.sign({
          sub: user._id,
          id: user.accountId,
          username: user.username,
          name: user.name
        }, process.env.SECRET)
      })
    })(req, res, next)
  },

  /*
    Sign out
  */
  signout: (req, res) => {
    req.logout()
      // req.session.destroy()
    res.status(200).json({ message: 'Sign out succeded' })
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
