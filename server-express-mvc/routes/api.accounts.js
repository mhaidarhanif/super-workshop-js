const express = require('express')
const router = express.Router()

const api = require('../controllers/api.accounts')
const auth = require('../controllers/api.auth')

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
