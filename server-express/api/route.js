const express = require('express')
const router = express.Router()

const api = require('./controller')

// COMMON
router.get('/', api.home)
router.get('/api', api.api)
router.get('/ping', api.ping)

module.exports = router
