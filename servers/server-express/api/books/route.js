const express = require('express')
const router = express.Router()

const api = require('./controller')
const auth = require('../auth/controller')

// -----------------------------------------------------------------------------
// api/books
// -----------------------------------------------------------------------------

// req.body   >>> /data + { id: 0 }
// req.params >>> /data/:id
// req.query  >>> /data?q={id}

// ADMINISTRATIVE ACCOUNT
router.get('/actions/seed', auth.isAdmin, api.seedBooks)
router.get('/actions/seed-lot', auth.isAdmin, api.seedBooksLot)
router.delete('/actions/delete', auth.isAdmin, api.deleteBooks)

// AUTHENTICATED ACCOUNT
router.post('/', auth.isAuthenticated, api.postBook)
router.post('/owner', auth.isAuthenticated, api.postBookAndOwner)
router.post('/search', auth.isAuthenticated, api.searchBooks)
router.put('/:isbn', auth.isAuthenticated, api.updateBookByISBN)
router.put('/:isbn/owner', auth.isAuthenticated, api.updateBookByISBNAndOwner)
router.delete('/:isbn', auth.isAuthenticated, api.deleteBookByISBN)

// PUBLIC USER
router.get('/', api.getBooks)
router.get('/paginated', api.getBooksPaginated)
router.get('/:isbn', api.getBookByISBN)

module.exports = router
