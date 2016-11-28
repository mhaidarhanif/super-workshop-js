// const passport = require('passport')
// const Account = require('../models/account')

module.exports = {

  /*
    Home
  */
  home: (req, res) => {
    res.send('Home')
  },

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
  }

}
