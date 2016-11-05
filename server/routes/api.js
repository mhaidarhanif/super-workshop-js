const express = require('express')
const router = express.Router()

const api = require('../controllers/api')
const auth = require('../controllers/api.auth')

// COMMON
router.get('/api', api.api)
router.get('/ping', api.ping)

// USERS
// router.get('/api/users', auth.isAuthenticated, api.getUsers)
router.get('/api/users', api.getUsers)

// PROFILE
// router.get('/api/profile', auth.isAuthenticated, api.getProfile)
router.get('/api/profile', api.getUserProfile)

module.exports = router
