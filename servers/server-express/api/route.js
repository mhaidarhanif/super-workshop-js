const express = require('express')
const router = express.Router()

const api = require('./controller')
const auth = require('./auth/controller')
const accounts = require('./accounts/controller')

// -----------------------------------------------------------------------------
// PUBLIC
// -----------------------------------------------------------------------------

// Get home info
router.get('/', api.home)
// Get root API info
router.get('/api', api.api)
// Ping and get request info
router.get('/ping', api.ping)

// -----------------------------------------------------------------------------
// AUTHENTICATED
// -----------------------------------------------------------------------------

// Get account profile from authenticated user
router.get('/me', auth.isAuthenticated, accounts.getProfile)

module.exports = router
