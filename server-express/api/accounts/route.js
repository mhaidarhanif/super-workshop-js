const express = require('express')
const router = express.Router()

const api = require('./controller')
const auth = require('../auth/controller')

// -----------------------------------------------------------------------------
// api/accounts
// -----------------------------------------------------------------------------

router.get('/actions/seed', api.seedAccounts)

// Need auth.isAuthenticated
router.get('/', api.getAccounts)
router.delete('/', api.deleteAccounts)

// PROFILE
// router.get('/:accountId', api.getAccountProfileById)
router.get('/:accountId', auth.isAuthenticated, api.getAccountProfileById)

module.exports = router
