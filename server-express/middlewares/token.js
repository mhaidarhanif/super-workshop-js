const jwt = require('jsonwebtoken')

const Account = require('../models/account')

module.exports = function () {

  /*
   * Return the middleware function
   */
  return function (req, res, next) {
    if (!req.headers.authorization) {
      return res.status(401).end()
    }

    console.log(">>>>>>>>> TOKEN VERIFICATION <<<<<<<<<<")

    // get the last part from a authorization header string like "bearer token-value"
    // then decode the token using a secret key-phrase
    jwt.verify(
      req.headers.authorization.split(' ')[1],
      process.env.SECRET,
      function (err, decoded) {
        // the 401 code is for unauthorized status
        if (err) return res.status(401).end()

        // check if a account exists
        else {
          Account.findById(decoded.sub, function (err, account) {
            console.log(">>>>>>> ACCOUNT:", account)
            if (err || !account) return res.status(401).end()
            return next()
          })
        }
      })

  }

}
