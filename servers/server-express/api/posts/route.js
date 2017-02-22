const express = require('express')
const router = express.Router()

const api = require('./controller')
const auth = require('../../auth/controller')

// -----------------------------------------------------------------------------
// ADMINISTRATIVE
// -----------------------------------------------------------------------------

// Seed
router.post('/actions/seed', [auth.isWithAPIKey, auth.isSetup], api.seed)
// Delete all
router.delete('/actions/delete', [auth.isWithAPIKey, auth.isSetup], api.delete)

// -----------------------------------------------------------------------------
// AUTHENTICATED ACCOUNT
// -----------------------------------------------------------------------------

// Post
router.post('/', auth.isAuthenticated, api.post)
// Update by ID
router.put('/:id', auth.isAuthenticated, api.updateById)
// Delete by ID
router.delete('/:id', auth.isAuthenticated, api.deleteById)

// -----------------------------------------------------------------------------
// PUBLIC USER
// -----------------------------------------------------------------------------

// Get with pagination
router.get('/', api.get)
// Get without pagination
router.get('/all', api.getAll)
// Get by ID
router.get('/:id', api.getById)
// Search by data
router.post('/search', api.search)

// -----------------------------------------------------------------------------

module.exports = router
