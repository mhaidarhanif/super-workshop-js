const express = require('express')
const router = express.Router()

const api = require('../controllers/api.books')

// -----------------------------------------------------------------------------
// ROUTING
// api/books
// -----------------------------------------------------------------------------

// req.body   >>> /data + { id: 0 }
// req.params >>> /data/:id
// req.query  >>> /data?q={id}

router.get('/', api.getBooks)
router.delete('/', api.deleteBooks)
router.post('/', api.postBook)
router.post('/search', api.searchBooks)
router.get('/:isbn', api.getBookByISBN)
router.delete('/:isbn', api.deleteBookByISBN)
router.put('/:isbn', api.updateBookByISBN)

module.exports = router
