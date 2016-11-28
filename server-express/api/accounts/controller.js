const Account = require('./model')

const accounts = require('./seed.json')

module.exports = {

  // ---------------------------------------------------------------------------
  // ADMINISTRATIVE
  // ---------------------------------------------------------------------------

  /*
   * @api {get} Seed some accounts
   */
  seedAccounts: (req, res) => {
    // List of accounts from seed
    console.log({accounts})

    // Remove all accounts first
    Account.remove({}, (err) => {
      if (err) res.status(400).json({ 'error': `Error: ${err}` })
      console.log({ 'message': `All accounts have been removed before seeding.` })
    })

    // Seed some accounts from data
    accounts.forEach((account, index) => {
      Account.register(new Account({
        name: account.name,
        username: account.username,
        email: account.email
      }),
      account.password,
      (err, account) => {
        if (err) res.status(400).json({ error: err.message })
        else if (!account) res.status(304).json({ 'message': `Failed to seed account: ${account}` })
      })
    })

    // Wait until all accounts are registered
    setTimeout(() => {
      Account.find({}, (err, data) => {
        if (err) res.status(400).json({ error: err.message })
        res.status(200).json(data)
      })
    }, 2000)
  },

  /*
   * Get list of all accounts
   */
  getAccounts: (req, res) => {
    Account.find({}, (err, data) => {
      console.log('getAccounts:', data)
      if (err) res.status(400).json({ 'error': `Error: ${err}` })
      if (!data) res.status(404).json({ 'message': 'Failed to get list of all accounts.' })
      res.status(200).json(data)
    })
  },

  /*
    Delete all accounts
  */
  deleteAccounts: (req, res) => {
    Account.remove({}, (err) => {
      if (err) res.status(400).json({ 'error': `Error: ${err}` })
      res.status(200).json({ 'message': `All accounts have been removed.` })
    })
  },

  // ---------------------------------------------------------------------------
  // PUBLIC
  // ---------------------------------------------------------------------------

  /*
    Get profile of an account by ID
  */
  getAccountProfileById: (req, res) => {
    Account.findOne({
      accountId: req.params.accountId
    }, (err, data) => {
      console.log('getProfileById:', data)
      if (err) res.status(400).json({ 'error': `Error: ${err}` })
      if (!data) res.status(404).json({ 'message': 'Failed to get account profile by ID' })
      res.status(200).json(data)
    })
  }

}
