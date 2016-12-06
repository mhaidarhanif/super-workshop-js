const express = require('express')
const router = express.Router()

const api = require('./controller')
const auth = require('../auth/controller')

// -----------------------------------------------------------------------------
// ADMINISTRATIVE
// -----------------------------------------------------------------------------

// Create super account, only once
router.post('/actions/setup', api.seedSuperAccounts)
// Seed initial accounts
router.post('/actions/seed', auth.isAdmin, api.seedAccounts)
// Delete all accounts
router.delete('/actions/delete', auth.isAdmin, api.deleteAccounts)
// Get all accounts
router.get('/', auth.isAdmin, api.getAccounts)

// -----------------------------------------------------------------------------
// PUBLIC
// -----------------------------------------------------------------------------

// Get account by accountId
router.get('/:accountId', auth.isAuthenticated, api.getAccountProfileById)

// -----------------------------------------------------------------------------

module.exports = router
