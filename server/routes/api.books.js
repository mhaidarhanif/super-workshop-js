const express = require('express')
const router = express.Router()

const controller = require('../controllers/api.books')
const books = require('../data/books.js')

// -----------------------------------------------------------------------------
// ROUTING
// -----------------------------------------------------------------------------

// req.body   >>> /data + { id: 0 }
// req.params >>> /data/:id
// req.query  >>> /data?q={id}

router.get('/ping', controller.ping)
router.get('/books', controller.getBooks)
router.post('/books', controller.postBook)
router.get('/books/:isbn', controller.getBookByISBN)
router.delete('/books/:isbn', controller.deleteBookByISBN)
router.put('/books/:isbn', controller.updateBookByISBN)

module.exports = router
