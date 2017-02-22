const express = require('express')
const router = express.Router()

const auth = require('../../auth/controller')
const api = require('./controller')

// -----------------------------------------------------------------------------
// ADMINISTRATIVE
// -----------------------------------------------------------------------------

// Create super account, only once
router.post('/actions/setup', [auth.isWithAPIKey, auth.isSetup], api.seedSuperAccounts)
// Seed initial accounts
router.post('/actions/seed', [auth.isWithAPIKey, auth.isSetup], api.seedAccounts)
// Delete all accounts
router.delete('/actions/delete', [auth.isWithAPIKey, auth.isSetup], api.deleteAccounts)
// Delete all accounts (for test purpose)
router.delete('/actions/empty', [auth.isWithAPIKey, auth.isTest], api.deleteAccounts)

// Get all accounts
router.get('/', auth.isAdmin, api.getAccounts)

// -----------------------------------------------------------------------------
// PROFILE
// -----------------------------------------------------------------------------

router.post('/profile/actions/edit-profile', auth.isAuthenticated, (req, res) => { res.send({m: `Profile has been updated.`}) })
router.post('/profile/actions/edit-image', auth.isAuthenticated, (req, res) => { res.send({m: `Profile image or avatar has been updated.`}) })

// -----------------------------------------------------------------------------
// PUBLIC
// -----------------------------------------------------------------------------

// Get account profile by accountId
router.get('/:accountId', auth.isAuthenticated, api.getAccountProfileById)
// Get account profile by username
router.get('/:accountId', auth.isAuthenticated, api.getAccountProfileByUsername)

// -----------------------------------------------------------------------------

module.exports = router
