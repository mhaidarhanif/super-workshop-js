const express = require('express')
const router = express.Router()

const api = require('../controllers/api.accounts')
const auth = require('../controllers/api.auth')

// ACCOUNTS
// router.get('/api/accounts', auth.isAuthenticated, api.getAccounts)
router.get('/', api.getAccounts)
router.delete('/', api.deleteAccounts)

// PROFILE
// router.get('/api/profile', auth.isAuthenticated, api.getProfile)
router.get('/profile', api.getAccountProfile)

module.exports = router
