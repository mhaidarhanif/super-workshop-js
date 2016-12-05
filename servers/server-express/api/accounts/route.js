const express = require('express')
const router = express.Router()

const api = require('./controller')
const auth = require('../auth/controller')

// -----------------------------------------------------------------------------
// api/accounts
// -----------------------------------------------------------------------------

// ADMINISTRATIVE
router.get('/', auth.isAdmin, api.getAccounts)
router.post('/actions/seed', auth.isAdmin, api.seedAccounts)
router.delete('/actions/delete', auth.isAdmin, api.deleteAccounts)

// PUBLIC
router.get('/:accountId', auth.isAuthenticated, api.getAccountProfileById)

module.exports = router
