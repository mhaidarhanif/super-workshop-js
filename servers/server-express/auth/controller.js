// PASSPORT
const jwt = require('jsonwebtoken')
const passport = require('passport')
require('../config/auth.schema')(passport)

const Account = require('../api/accounts/model')

const auth = module.exports = {

  /**
   * Info about this route
   */
  getInfo: (req, res) => {
    res.json({
      id: 'auth',
      m: 'Check the endpoints',
      i: req.info,
      token: req.decoded,
      endpoints: {
        '/signup': 'Sign up a new account.',
        '/signin': 'Sign in an existing account.',
        '/signout': 'Sign out authenticated account.',
        '/is-with-token': 'Check if user pass a token.',
        '/is-account-exist': 'Check if account exist.',
        '/is-authenticated': 'Check if user is authenticated.',
        '/is-admin': 'Check if authenticated account is an admin.'
      }
    })
  },

  /**
   * Check if there is a passed token
   */
  isWithToken: (req, res, next) => {
    let token
    if (req.body.token) token = req.body.token
    else if (req.query.token) token = req.query.token
    else if (req.headers.authorization) token = req.headers.authorization.split(' ')[1]
    else token = 0

    if (token !== 0) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) req.info = { s: false, id: 'user_with_token_error', m: 'Failed to verify token.', e: err }
        else req.decoded = decoded
        Account.findById(decoded.sub, (err, account) => {
          if (err || !account) {
            req.info = { s: false, id: 'user_with_token_account_not_found', m: 'No account is associated with that token.', e: err }
          }
          req.info = { id: 'user_with_token', m: 'You have a valid token.' }
          next()
        })
      })
    } else {
      req.info = { id: 'user_no_token', m: 'You did not pass a token.' }
      next()
    }
  },

  /**
   * Create a new account
   */
  signup: (req, res, next) => {
    // Send info if the data is not complete
    // Send info if password is weak
    if (!req.body.name || !req.body.email || !req.body.username || !req.body.password) {
      res.status(400).json({id: 'signup_failed', m: 'Please provide required sign up data: name, email, username, password.'})
    } else if (req.body.password.length < 8) {
      res.status(400).json({ id: 'signup_failed', m: 'Password must be longer than 8 characters.' })
    } else {
      // Create the account
      let account = new Account()
      account.name = req.body.name
      account.email = req.body.email
      account.username = req.body.username
      account.hash = account.generateHash(req.body.password)
      account.providers = 'local'
      // Save created account into database
      account.save((err) => {
        // Send an error message
        if (err) res.status(422).json({ id: 'signup_error', e: err.errors || err })
        // Send a failed message
        if (!account) res.status(404).json({ id: 'signup_failed', m: 'Sign up failed. Created account might not found or has a conflict.' })
        // Send a success sign up message
        if (account) {
          res.status(201).json({
            id: 'signup_success',
            m: `Successfully signed up an account.`,
            name: account.name,
            email: account.email,
            username: account.username,
            password: '[ENCRYPTED]',
            roles: account.roles
          })
        }
      })
    }
  },

  /**
   * Sign in a signed up account
   */
  signin: (req, res, next) => {
    // Check for username and password
    if (!req.body.username || !req.body.password) {
      res.status(400).json({ id: 'signin_failed_no_username_password', m: `Sign in failed because no username or password.` })
    } else {
      const username = (req.body.username).toLowerCase()
      const password = req.body.password
      // console.log({username, password})

      // Find the account with that username
      Account
        .findOne({ username: username })
        .then(account => {
          console.log('>>> account:', account)
          console.log('>>> account.valid:', account.validPassword)

          if (!account) { // Account not found
            res.status(401).json({ s: false, id: 'signin_not_found', m: `Sign in failed because account with username '${username}' is not found.` })
          } else if (!account.validPassword(password)) { // Password not match
            res.status(401).json({ s: false, id: 'signin_password_failed', m: `Sign in failed because password of '${username}' is not match.` })
          } else { // Correct account and password
            // Create token content and config
            let content = {
              payload: { // or claims
                iss: process.env.URL,       // ISSUER: DOMAIN/URL of the service
                sub: account._id,           // SUBJECT: OID/UID/UUID/GUID
                id: account.accountId,      // ACCOUNTID: Sequential ID
                username: account.username, // USERNAME: Username
                name: account.name,         // NAME: Full name
                roles: account.roles,       // ROLES: Authorization
                scope: 'self, profile'      // SCOPE: Specific payload/claims
              },
              secret: process.env.JWT_SECRET,
              options: {
                expiresIn: '365d' // EXPIRATION: 1 day
              }
            }

            // Assign admin flag if required
            if (account.roles === 'super' || 'admin' || 'dev' || 'test' || 'ops') {
              content.payload.admin = true
            }

            // Generate a token
            const token = auth.generateJWT(account)
            console.log('token:', token)

            // Finally send that token
            res.status(200).json({
              token: jwt.sign(content.payload, content.secret, content.options)
            })
          }
        })
        .catch(err => {
          if (err) res.status(422).json({ id: 'signin_failed', e: err.message })
        })
        // Finish sign in
    }
  },

  /**
   * Sign out
   */
  signout: (req, res) => {
    // req.logout()
    res.status(200).json({ id: 'signout', m: 'Sign out succeded.' })
  },

  /**
   * Generate authentic JWT account
   */
  generateJWT: (content) => {
    const token = content
    console.log('JWT GENERATED:', token)
  },

  /**
   * Check whether the username is already signed up
   */
  isAccountExist: (req, res, next) => {
    req.checkBody('username', 'Username is required').notEmpty()

    Account.count({
      'username': req.body.username
    }, (err, count) => {
      if (err) res.status(422).json({ s: false, id: 'account_exist', m: 'Failed to check account existency.' })
      else if (count === 0) next()
      else res.status(400).json({ id: 'account_info_exist', m: `Account with username '${req.body.username}' is already exist.` })
    })
  },

  /**
   * Check whether the user is authenticated
   */
  isAuthenticated: (req, res, next) => {
    // Check for token from various ways
    let token
    if (req.body.token) token = req.body.token
    else if (req.query.token) token = req.query.token
    else if (req.headers.authorization) token = req.headers.authorization.split(' ')[1]
    else token = 0

    // There's a token coming in!
    // console.log({token})

    // Decode the token if it's available
    if (token !== 0) {
      // Verifies JWT token with provided secret and checks expiration
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        // If there is an error when verifying the token...
        if (err) res.status(401).json({ s: false, id: 'auth_failed', m: 'Failed to authenticate token.', e: err })
        // If everything is good, save to request for use in other routes
        else req.decoded = decoded
        // Find the account based on the token subject
        Account.findById(decoded.sub, (err, account) => {
          // If there is no associated acccount...
          if (err || !account) {
            res.status(401).send({ s: false, id: 'auth_not_found', m: 'No account is associated with that token.', e: err })
          }
          // There's the account! Finally sure that actual account is authenticated with valid token
          // console.log({account})
          next()
        })
      })
    } else {
      // When there's no token
      res.status(403).send({ s: false, id: 'auth_no_token', m: 'Sorry, no access without an active access token that must be used to query information.' })
    }
    // Finish token checker for authentication
  },

  /**
   * Check whether the account is an admin
   */
  isAdmin: (req, res, next) => {
    // Check for token from various ways
    let token
    if (req.body.token) token = req.body.token
    else if (req.query.token) token = req.query.token
    else if (req.headers.authorization) token = req.headers.authorization.split(' ')[1]
    else token = 0

    if (token !== 0) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) res.status(401).json({ s: false, id: 'auth_failed', m: 'Failed to authenticate token.', e: err })
        else if (decoded.admin === true) {
          // console.log({decoded})
          next()
        } else {
          res.status(403).send({ s: false, id: 'auth_not_admin', m: `Account '${decoded.name}' is not an admin.`, e: err })
        }
      })
    } else {
      // When there's no token
      res.status(403).send({ s: false, m: 'Sorry, no access without token.' })
    }
    // Finish token checker for admin
  },

  /**
   * Check the API Key in header
   */
  isWithAPIKey: (req, res, next) => {
    // Check for X-API-Key from various ways
    req.apikey = req.body['x-api-key'] || req.query['x-api-key'] || req.headers['x-api-key'] || null
    // console.log('X-API-Key:', req.apikey)
    if (req.apikey !== null) next()
    else res.status(401).send({ s: false, m: 'Sorry, no access without API key.' })
  },

  /**
   * Check whether the environment is a setup via API Key
   */
  isSetup: (req, res, next) => {
    if (req.apikey === process.env.API_KEY_SETUP) next()
    else if (req.apikey !== process.env.API_KEY_SETUP) res.status(403).send({ s: false, m: 'Sorry, initial setup need valid key.' })
    else res.status(401).send({ s: false, m: 'Sorry, initial setup need a key.' })
  },

  /**
   * Check whether the environment is a test via API Key
   */
  isTest: (req, res, next) => {
    if (req.apikey === process.env.API_KEY_TEST) next()
    else if (req.apikey !== process.env.API_KEY_TEST) res.status(403).send({ s: false, m: 'Sorry, test mode need valid key.' })
    else res.status(401).send({ s: false, m: 'Sorry, test mode need a key.' })
  }

}
