const express = require('express')
const router = express.Router()

const api = require('./controller')
const auth = require('../auth/controller')

// req.body   >>> /data + { id: 0 }
// req.params >>> /data/:id
// req.query  >>> /data?q={id}

// -----------------------------------------------------------------------------
// ADMINISTRATIVE ACCOUNT
// -----------------------------------------------------------------------------

// Seed a few books
router.post('/actions/seed', auth.isAdmin, api.seedBooks)
// Seed a lot of books
router.post('/actions/seed-lot', auth.isAdmin, api.seedBooksLot)
// Delete all books
router.delete('/actions/delete', auth.isAdmin, api.deleteBooks)

// -----------------------------------------------------------------------------
// AUTHENTICATED ACCOUNT
// -----------------------------------------------------------------------------

// Post a book
router.post('/', auth.isAuthenticated, api.postBook)
// Search books by data
router.post('/search', auth.isAuthenticated, api.searchBooks)
// Update a book by ISBN
router.put('/:isbn', auth.isAuthenticated, api.updateBookByISBN)
// Update a book owners
router.put('/:isbn/owners', auth.isAuthenticated, api.updateBookByISBNAndOwner)
// Delete a book by ISBN
router.delete('/:isbn', auth.isAuthenticated, api.deleteBookByISBN)

// -----------------------------------------------------------------------------
// PUBLIC USER
// -----------------------------------------------------------------------------

// Get all books
router.get('/', api.getBooks)
// Get all books paginated
router.get('/paginated', api.getBooksPaginated)
// Get a book by ISBN
router.get('/:isbn', api.getBookByISBN)

// -----------------------------------------------------------------------------

module.exports = router
