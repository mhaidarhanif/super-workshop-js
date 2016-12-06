const R = require('ramda')

const Book = require('./model')
const books = require('./seed.json')
const booksLot = require('./seed.lot.json')

const Account = require('../accounts/model')

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

// Send response when POST
const sendResponse = (res, err, data, message) => {
  if (err) {
    res.status(400).json({
      id: 'book_error',
      e: `${err}`,
      m: 'Probably a duplicated data issue. Please check the potential book data which probably the same.'
    })
  } else if (!data) res.status(304).json({ id: 'book_data_duplicate', m: message })
  else res.status(201).json(data)
}

// Send response when GET/PUT
const sendResponseNF = (res, err, data, message) => {
  if (err) {
    res.status(400).json({
      id: 'book_error',
      e: `${err}`,
      m: 'Something wrong. Try again.'
    })
  } else if (!data) res.status(404).json({ id: 'book_data_failed', m: message })
  else res.status(200).json(data)
}

// -----------------------------------------------------------------------------
// BOOK CONTROLLER
// -----------------------------------------------------------------------------

module.exports = {

  // ---------------------------------------------------------------------------
  // ADMINISTRATIVE
  // ---------------------------------------------------------------------------

  /* ---------------------------------------------------------------------------
   * @api {get} /books/actions/seed Seed some books
   */
  seedBooks: (req, res) => {
    Book
      .create(books, (err, data) => {
        // console.log('seedBooks:', data)
        sendResponse(res, err, data, 'Failed to seed a few books.')
      })
  },

  /* ---------------------------------------------------------------------------
   * @api {get} /books/actions/seed-lot Seed a lot of books
   */
  seedBooksLot: (req, res) => {
    Book
      .create(booksLot, (err, data) => {
        // console.log('seedBooksLot:', data)
        sendResponse(res, err, data, 'Failed to seed a lot of books.')
      })
  },

  /* ---------------------------------------------------------------------------
   * @api {get} /books Delete all books
   */
  deleteBooks: (req, res) => {
    Book
      .remove()
      .exec((err, data) => {
        // console.log('deleteBooks:', data)
        if (err) res.status(400).json({ id: 'book_delete_error', e: `Error: ${err}` })
        else if (!data) res.status(404).json({ id: 'book_delete_failed', m: 'Data already empty.' })
        else res.status(200).json({ m: `All books have been removed.` })
      })
  },

  // ---------------------------------------------------------------------------
  // PUBLIC
  // ---------------------------------------------------------------------------

  /* ---------------------------------------------------------------------------
   * @api {get} /books?page=1 Get all books with pagination
   */
  getBooks: (req, res) => {
    Book
      .paginate({}, {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10
      })
      .then((result) => {
        let err = false
        // console.log('getBooksPaginated:', result.docs)
        sendResponseNF(res, err, result.docs, 'Failed to get all books with pagination.')
      })
  },

  /* ---------------------------------------------------------------------------
   * @api {get} /books/all Get all books without pagination
   */
  getBooksAll: (req, res) => {
    Book
      .find({})
      .exec((err, data) => {
        // console.log('getBooks:', data)
        sendResponseNF(res, err, data, 'Failed to get all books.')
      })
  },

  /* ---------------------------------------------------------------------------
   * @api {post} /books Post a new book
   */
  postBook: (req, res) => {
    Book
      .create({
        isbn: req.body.isbn,
        title: req.body.title,
        price: req.body.price,
        createdBy: req.decoded.id,
        updatedBy: req.decoded.id
      }, (err, data) => {
        // console.log('postBook:', data)
        sendResponse(res, err, data, `Book with ISBN ${req.body.isbn} is probably already exist.`)
      })
  },

  /* ---------------------------------------------------------------------------
   * @api {post} /books Post a new book with data
   */
  postBookAndOwner: (req, res) => {
    const book = {
      isbn: req.body.isbn,
      title: req.body.title,
      price: req.body.price
    }
    console.log({book})

    Book
      .create(book, (err, data) => {
        // console.log('postBookWithOwner:', data)
        sendResponse(res, err, data, `Book with ISBN ${req.body.isbn} is probably already exist.`)
      })
  },

  /* ---------------------------------------------------------------------------
   * @api {post} /books/search Search some books
   */
  searchBooks: (req, res) => {
    let book = {}
    if (req.body.isbn) book.isbn = new RegExp(req.body.isbn, 'i')
    if (req.body.title) book.title = new RegExp(req.body.title, 'i')
    if (req.body.price) book.price = Number(req.body.price)
    console.log({book})

    if (!R.isEmpty(book)) {
      Book.find(book, (err, data) => {
        // console.log('searchBooks:', data)
        sendResponse(res, err, data, `Failed to search books with data: ${book}`)
      })
    } else {
      res.status(422).json({ id: 'book_search_no_data', m: `Failed to search books with no data.` })
    }
  },

  /* ---------------------------------------------------------------------------
   * @api {get} /books/:isbn Get book by ISBN
   */
  getBookByISBN: (req, res) => {
    Book.findOne({
      isbn: req.params.isbn
    }, {
      '_id': 0
    }, (err, data) => {
      // console.log('getBookByISBN:', data)
      sendResponseNF(res, err, data, 'Failed to GET book by ISBN.')
    })
  },

  /* ---------------------------------------------------------------------------
   * @api {delete} /books/:isbn Delete book by ISBN
   */
  deleteBookByISBN: (req, res) => {
    let updated = {
      m: `Book with ISBN '${req.params.isbn}' has been removed.`,
      book: null,
      i: null
    }

    // Remove book from database
    Book.findOneAndRemove({
      isbn: req.params.isbn
    }, (err, data) => {
      // console.log('deleteBookByISBN:', data)
      if (err) res.status(400).json({ id: 'book_delete_error', e: `Error: ${err}` })
      else if (!data) res.status(404).json({ id: 'book_delete_not_found', m: `No book found with ISBN '${req.params.isbn}'.` })
      else {
        updated.book = data
      }
    })

    // Remove book ISBN from multi accounts data
    Account.update({
      books: { '$in': [req.params.isbn] }
    }, {
      $pull: { 'books': req.params.isbn },
      $addToSet: { 'updatedBy': req.decoded.id }
    }, {
      multi: true,
      new: true,
      upsert: true
    }, (err, info) => {
      if (err) {
        res.status(400).json({
          id: 'account_book_error', e: `${err}`, m: 'Something wrong. Try again.'
        })
      } else if (!info) {
        res.status(404).json({
          id: 'account_book_data_failed',
          m: `Failed to update account with ID '${req.decoded.id}' and remove their books with ISBN '${req.params.isbn}'. Might not exist yet.`
        })
      }
      updated.i = info
    })

    // Wait until all data have been removed and updated
    // Finally send the deleted book and updated account data
    // console.log(updated)
    setTimeout(() => { res.status(201).json(updated) }, 1000)
  },

  /* ---------------------------------------------------------------------------
   * @api {put} /books/:isbn Update book by ISBN
   */
  updateBookByISBN: (req, res) => {
    // Prepare required data
    let book = {}
    if (req.body.isbn) book.isbn = req.body.isbn
    if (req.body.title) book.title = req.body.title
    if (req.body.price) book.price = req.body.price
    console.log({book})

    // Check if the required data are exist
    if (!R.isEmpty(book)) {
      res.status(422).json({ id: 'book_update_no_data', m: `Failed to update book with no data.` })
    }

    // Update existing book data with new book data
    Book.findOneAndUpdate({
      isbn: req.params.isbn
    }, {
      $set: book,
      $addToSet: { // only add if not exist
        'updatedBy': req.decoded.id
      }
    }, {
      new: true,    // return the modified document
      upsert: false // create new doc if not exist
    }, (err, data) => {
        // console.log('updateBookByISBN:', data)
      sendResponseNF(res, err, data, `Failed to update book with ISBN '${req.params.isbn}'.`)
    })
  },

  /* ---------------------------------------------------------------------------
   * @api {put} /books/:isbn/owner Update book by ISBN to put with owner
   */
  updateBookByISBNAndOwner: (req, res) => {
    // Prepare response data
    let updated = {
      s: true,
      m: 'Successfully updated book by ISBN to put with owner account ID.',
      book: null,
      account: null
    }

    // Assign accountId to book's owners
    Book.findOneAndUpdate({
      isbn: req.params.isbn
    }, {
      $addToSet: { 'updatedBy': req.decoded.id, 'owners': req.decoded.id }
    }, {
      new: true,
      upsert: false
    }, (err, data) => {
      if (err) {
        res.status(400).json({
          id: 'book_error', e: `${err}`, m: 'Something wrong. Try again.'
        })
      } else if (!data) {
        res.status(404).json({
          id: 'book_data_failed',
          m: `Failed to update book with ISBN '${req.params.isbn}' and assign owner accountId '${req.decoded.id}'.`
        })
      } else {
        updated.book = data
      }
    })

    // Assign book ISBN to account's books
    Account.findOneAndUpdate({
      accountId: req.decoded.id
    }, {
      $addToSet: {
        'updatedBy': req.decoded.id,
        'books': String(req.params.isbn)
      }
    }, {
      new: true,
      upsert: false
    }, (err, data) => {
      if (err) {
        res.status(400).json({
          id: 'book_error', e: `${err}`, m: 'Something wrong. Try again.'
        })
      } else if (!data) {
        res.status(404).json({
          id: 'book_data_failed',
          m: `Failed to update account with ID '${req.decoded.id}' and assign book with ISBN '${req.params.isbn}'. Might not exist yet.`
        })
      } else {
        updated.account = data
      }
    })

    // Wait until all data have been updated
    // Finally send the updated book and account data
    // console.log(updated)
    setTimeout(() => { res.status(201).json(updated) }, 1000)
  }

// BookController
}
