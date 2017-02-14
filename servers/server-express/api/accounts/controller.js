const mongoose = require('mongoose')

const Account = require('./model')
const superAccounts = require('./seed.super.json')
const normalAccounts = require('./seed.json')

module.exports = {

  // ---------------------------------------------------------------------------
  // ADMINISTRATIVE
  // ---------------------------------------------------------------------------

  /* ---------------------------------------------------------------------------
   * @api {get} Seed super accounts
   */
  seedSuperAccounts: (req, res) => {
    // Drop all collections
    mongoose.connection.db.dropCollection('counters', (err, result) => {
      if (err) res.status(400).json({ id: 'counters_drop_error', e: `${err}` })
      console.log('[x] Dropped collection: counters')
    })
    mongoose.connection.db.dropCollection('accounts', (err, result) => {
      if (err) res.status(400).json({ id: 'accounts_drop_error', e: `${err}` })
      console.log('[x] Dropped collection: accounts')
    })

    // Seed them
    Account
      .find({})
      .then(() => {
        Account.create(superAccounts)
      })
      .then(() => {
        res.status(200).json({
          counters: { s: true, id: 'counter_drop_success', m: `Collection 'counters' have been removed before seeding.` },
          accounts: { s: true, id: 'account_super_seed_success', m: `Successfully seeded super accounts.` }
        })
      })
      .catch((err) => {
        res.status(400).json({ id: 'account_super_seed_error', m: `Failed to seed super accounts. Might already have seeded before.`, e: err.message })
      })
  },

  /* ---------------------------------------------------------------------------
   * @api {get} Seed some accounts
   */
  seedAccounts: (req, res) => {
    Account
      .find({})
      .then(() => {
        Account.create(normalAccounts)
      })
      .then(() => {
        res.status(200).json({
          accounts: { s: true, id: 'account_seed_success', m: `Successfully seeded normal accounts.` }
        })
      })
      .catch((err) => {
        res.status(400).json({ id: 'account_seed_error', m: `Failed to seed normal accounts. Might already have seeded before.`, e: err.message })
      })
  },

  /* ---------------------------------------------------------------------------
   * @api {get} Seed accounts <entities> collection
   */
  seedAccountsEntities: (req, res) => {
    Account
      .find({})
      .then(() => {
        res.status(200).json({
          accounts: { s: true, id: 'account_seed_entities_success', m: `Successfully seeded entities into accounts.` }
        })
      })
      .catch((err) => {
        res.status(400).json({ id: 'account_seed_entities_error', m: `Failed to seed entities into accounts.`, e: err.message })
      })
  },

  /* ---------------------------------------------------------------------------
   * Get list of all accounts
   */
  getAccounts: (req, res) => {
    Account.find({}, (err, data) => {
      // console.log('getAccounts:', data)
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
    // TODO: use fields query
    // ?fields=id,name,username,email,about,birthday,avatar,cover,

    Account.findOne({
      accountId: req.decoded.id
    }, {
      'name': 1,
      'username': 1
    }, (err, data) => {
      // console.log('getProfile:', data)
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
    Account.findOneAsync({
      accountId: req.params.accountId
    }, {
      '_id': 0,
      'accountId': 1,
      'name': 1,
      'username': 1
    }, (err, data) => {
      // console.log('getProfileById:', data)
      if (err) res.status(400).json({ id: 'account_profile_id_error', e: `${err}` })
      else if (!data) res.status(404).json({ id: 'account_profile_id_failed', m: 'Failed to get account profile by ID.' })
      else res.status(200).json(data)
    })
  },

  /* ---------------------------------------------------------------------------
   * Get account profile by username
   */
  getAccountProfileByUsername: (req, res) => {
    Account.findOneAsync({
      username: req.params.username
    }, {
      '_id': 0,
      'accountId': 1,
      'name': 1,
      'username': 1
    }, (err, data) => {
      // console.log('profile:', data)
      if (err) res.status(400).json({ id: 'account_profile_username_error', e: `${err}` })
      else if (!data) res.status(404).json({ id: 'account_profile_username_failed', m: 'Failed to get account profile by username.' })
      else res.status(200).json(data)
    })
  }

}
