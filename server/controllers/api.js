const passport = require('passport')
const Account = require('../models/account')

module.exports = {

  /*
    API intro
  */
  api: (req, res) => {
    res.send('API')
  },

  /*
    Ping
  */
  ping: (req, res) => {
    console.log('ping')
    res.json({ 'message': 'PONG!' })
  },

  /*
    Get list of users
  */
  getUsers: (req, res) => {
    Account.find({}, (err, data) => {
      console.log('getUsers:', data)
      if (err) res.status(400).json({ 'error': `Error: ${err}` })
      if (!data) res.status(404).json({ 'message': 'Failed to get all users' })
      res.status(200).json(data)
    })
  },

  /*
    Get profile of the authenticated user account
  */
  getUserProfile: (req, res) => {
    Account.findOne({
      username: req.user.username
    }, (err, data) => {
      console.log('getProfile:', data)
      if (err) res.status(400).json({ 'error': `Error: ${err}` })
      if (!data) res.status(404).json({ 'message': 'Failed to get user profile by username' })
      res.status(200).json(data)
    })
  }

}
