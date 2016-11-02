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
router.post('/books', controller.postBooks)
router.get('/books/:id', controller.getBookById)
router.delete('/books/:id', controller.deleteBookById)
router.put('/books/:id', controller.updateBookById)

module.exports = router
