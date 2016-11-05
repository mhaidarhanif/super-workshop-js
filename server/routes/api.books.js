const express = require('express')
const router = express.Router()

const controller = require('../controllers/api.books')
const books = require('../data/books.js')

// -----------------------------------------------------------------------------
// ROUTING
// api/books
// -----------------------------------------------------------------------------

// req.body   >>> /data + { id: 0 }
// req.params >>> /data/:id
// req.query  >>> /data?q={id}

router.get('/', controller.getBooks)
router.post('/', controller.postBook)
router.post('/search', controller.searchBooks)
router.get('/:isbn', controller.getBookByISBN)
router.delete('/:isbn', controller.deleteBookByISBN)
router.put('/:isbn', controller.updateBookByISBN)

module.exports = router
