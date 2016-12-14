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
router.delete('/actions/empty', [auth.isWithAPIKey, auth.isTest], api.deleteAccounts)

// Get all accounts
router.get('/', auth.isAdmin, api.getAccounts)

// -----------------------------------------------------------------------------
// PUBLIC
// -----------------------------------------------------------------------------

// Get account by accountId
router.get('/:accountId', auth.isAuthenticated, api.getAccountProfileById)

// -----------------------------------------------------------------------------

module.exports = router
