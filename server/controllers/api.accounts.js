const passport = require('passport')

const Account = require('../models/account')

module.exports = {

  /*
    Get list of all accounts
  */
  getAccounts: (req, res) => {
    Account.find({}, (err, data) => {
      console.log('getAccounts:', data)
      if (err) res.status(400).json({ 'error': `Error: ${err}` })
      if (!data) res.status(404).json({ 'message': 'Failed to get list of all accounts' })
      res.status(200).json(data)
    })
  },

  /*
    Get profile of an account
  */
  getAccountProfile: (req, res) => {
    req.checkBody('username', 'Username is required').notEmpty()
    if (!req.body.username) return res.send('Please require username')

    Account.findOne({
      username: req.body.username
    }, (err, data) => {
      console.log('getProfile:', data)
      if (err) res.status(400).json({ 'error': `Error: ${err}` })
      if (!data) res.status(404).json({ 'message': 'Failed to get account profile by username' })
      res.status(200).json(data)
    })
  }

}
