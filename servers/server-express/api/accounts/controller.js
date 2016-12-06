const mongoose = require('mongoose')

const Account = require('./model')

const superAccounts = require('./seed.super.json')
const accounts = require('./seed.json')

module.exports = {

  // ---------------------------------------------------------------------------
  // ADMINISTRATIVE
  // ---------------------------------------------------------------------------

  /* ---------------------------------------------------------------------------
   * @api {get} Seed super accounts
   */
  seedSuperAccounts: (req, res) => {
    // Drop counters collection
    mongoose.connection.db.dropCollection('counters', (err, result) => {
      if (err) res.status(400).json({ id: 'counter_drop_error', e: `${err}` })
      console.log({ id: 'counter_dropped', m: `Collection 'counters' have been removed before seeding.` })
    })

    // Seed some accounts from prepared data
    superAccounts.forEach((account, index) => {
      Account.register(new Account({
        email: account.email,
        name: account.name,
        username: account.username
      }),
      account.password,
      (err, account) => {
        if (err) res.status(400).json({ id: 'account_super_seed_error', e: err.message })
        else if (!account) res.status(304).json({ id: 'account_super_seed_failed', m: `Failed to seed super accounts.` })
      })
    })

    // Wait until all accounts are registered
    setTimeout(() => {
      Account.find({}, (err, data) => {
        if (err) res.status(400).json({ id: 'account_find_error', e: err.message })
        res.status(200).json(data)
      })
    }, 2000)
  },

  /* ---------------------------------------------------------------------------
   * @api {get} Seed some accounts
   */
  seedAccounts: (req, res) => {
    // List of accounts from seed
    console.log({accounts})

    // Seed some accounts from prepared data
    accounts.forEach((account, index) => {
      Account.register(new Account({
        email: account.email,
        name: account.name,
        username: account.username
      }),
      account.password,
      (err, account) => {
        if (err) res.status(400).json({ id: 'account_seed_error', e: err.message })
        else if (!account) res.status(304).json({ id: 'account_seed_failed', m: `Failed to seed account: ${account}` })
      })
    })

    // Wait until all accounts are registered
    setTimeout(() => {
      Account.find({}, (err, data) => {
        if (err) res.status(400).json({ id: 'account_find_error', e: err.message })
        res.status(200).json(data)
      })
    }, 2000)
  },

  /* ---------------------------------------------------------------------------
   * Get list of all accounts
   */
  getAccounts: (req, res) => {
    Account.find({}, {
      '_id': 0,
      'accountId': 1,
      'name': 1,
      'username': 1
    }, (err, data) => {
      console.log('getAccounts:', data)
      if (err) res.status(400).json({ id: 'account_get_error', e: `${err}` })
      if (!data) res.status(404).json({ id: 'account_get_failed', m: 'Failed to get list of all accounts.' })
      res.status(200).json(data)
    })
  },

  /* ---------------------------------------------------------------------------
   * Delete all accounts
   */
  deleteAccounts: (req, res) => {
    Account.remove({}, (err) => {
      if (err) res.status(400).json({ id: 'account_remove_error', e: `${err}` })
      res.status(200).json({ id: 'account_removed', m: 'All accounts have been removed.' })
    })
  },

  // ---------------------------------------------------------------------------
  // AUTHENTICATED
  // ---------------------------------------------------------------------------

  /* ---------------------------------------------------------------------------
   * Get account profile from authenticated user
   */
  getProfile: (req, res) => {
    Account.findOne({
      accountId: req.decoded.id
    }, {
      'name': 1,
      'username': 1
    }, (err, data) => {
      console.log('getProfile:', data)

      if (err) res.status(400).json({ id: 'account_profile_error', e: `${err}` })
      else if (!data) res.status(404).json({ id: 'account_profile_failed', m: 'Failed to get account profile with that token.' })
      else res.status(200).json(data)
    })
  },

  // ---------------------------------------------------------------------------
  // PUBLIC
  // ---------------------------------------------------------------------------

  /* ---------------------------------------------------------------------------
   * Get account profile by account ID
   */
  getAccountProfileById: (req, res) => {
    Account.findOne({
      accountId: req.params.accountId
    }, {
      '_id': 0,
      'accountId': 1,
      'name': 1,
      'username': 1
    }, (err, data) => {
      console.log('getProfileById:', data)
      if (err) res.status(400).json({ id: 'account_profile_error', e: `${err}` })
      else if (!data) res.status(404).json({ id: 'account_profile_failed', m: 'Failed to get account profile by ID.' })
      else res.status(200).json(data)
    })
  }

}
