const express = require('express')
const router = express.Router()

const api = require('../controllers/api.books')

// -----------------------------------------------------------------------------
// api/books
// -----------------------------------------------------------------------------

// req.body   >>> /data + { id: 0 }
// req.params >>> /data/:id
// req.query  >>> /data?q={id}

router.get('/actions/seed', api.seedBooks)
router.get('/actions/seed-lot', api.seedBooksLot)

router.get('/', api.getBooks)
router.get('/paginated', api.getBooksPaginated)
router.delete('/', api.deleteBooks)
router.post('/', api.postBook)
router.post('/owner', api.postBookAndOwner)
router.post('/search', api.searchBooks)
router.get('/:isbn', api.getBookByISBN)
router.delete('/:isbn', api.deleteBookByISBN)
router.put('/:isbn', api.updateBookByISBN)
router.put('/:isbn/owner', api.updateBookByISBNAndOwner)

module.exports = router
