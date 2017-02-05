const mongoose = require('mongoose')
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
  } else if (!data) res.status(304).json({ id: 'book_data_failed', m: message })
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
    // Drop books collection
    mongoose.connection.db.dropCollection('books', (err, result) => {
      if (err) res.status(400).json({ id: 'books_drop_error', e: `${err}` })
      console.log('[x] Dropped collection: books')

      // --------------------
      // Get the users you're looking for...
      Account.findOne({ roles: 'user' }, (err, user) => {
        if (err) res.status(400).json({ id: 'books_seed_find_users_error', m: err })
        if (!user) res.status(400).json({ id: 'books_seed_find_users_failed', m: 'Failed to find users.' })

        // --------------------
        // Post seed books
        Book.create(books, (err, data) => {
          if (err) res.status(400).json({ id: 'books_seed_failed', m: 'Failed to seed books.' })

          // --------------------
          // Put the one account id into book owners field
          Book.update({}, {
            $addToSet: { 'owners': user._id, 'updatedBy': user._id }
          }, {
            multi: true,
            new: true,
            upsert: true
          }, (err, info) => {
            if (err) {
              res.status(400).json({ id: 'account_book_error', e: `${err}`, m: 'Something wrong. Try again.' })
            } else if (!info) {
              res.status(404).json({ id: 'account_book_data_failed', m: `Failed to update books' owners.` })
            } else {
              // --------------------
              // Finally send the info
              res.status(200).json({
                books: { s: true, id: 'books_seed_success', m: `Successfully seeded some books.` }
              })
            }
          })
        })
      })
    })
  },

  /* ---------------------------------------------------------------------------
   * @api {get} /books/actions/seed-lot Seed a lot of books
   */
  seedBooksLot: (req, res) => {
    // Drop the collection first...
    mongoose.connection.db.dropCollection('books', (err, result) => {
      if (err) res.status(400).json({ id: 'books_drop_error', e: `${err}` })
      // Then we can seed a lot of them!
      if (result) {
        Book.create(booksLot, (err, data) => {
          if (err) res.status(400).json({ id: 'books_seed_lot_failed', m: 'Failed to seed a lot of books.' })
          res.status(200).json({
            books: { s: true, id: 'books_seed_lot_success', m: `Successfully seeded a lot of books.` }
          })
        })
      }
    })
  },

  /* ---------------------------------------------------------------------------
   * @api {get} /books Delete all books
   */
  deleteBooks: (req, res) => {
    Book.remove().exec((err, data) => {
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
      .catch((err) => {
        res.status(400).json({ id: 'books_error', e: `${err}`, m: 'Failed to get all books with pagination.' })
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
      .catch((err) => {
        res.status(400).json({ id: 'books_error', e: `${err}`, m: 'Failed to get all books without pagination.' })
      })
  },

  /* ---------------------------------------------------------------------------
   * @api {post} /books Post a new book
   */
  postBook: (req, res) => {
    const data = {}
    data.isbn = req.body.isbn
    data.title = req.body.title
    data.price = req.body.price
    data.createdBy = req.decoded.id
    data.updatedBy = req.decoded.id

    Book.save((err) => {
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
      price: req.body.price,
      owner: {
        id: req.body.ownerId
      }
    }
    console.log({book})

    Book
      .create(book, (err, data) => {
        // console.log('postBookWithOwner:', data)
        sendResponse(res, err, data, `Failed to post book with ISBN ${req.body.isbn}.`)
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
      $addToSet: {
        'updatedBy': req.decoded.sub,
        'owners.$.owner': req.decoded.sub
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
          m: `Failed to update book with ISBN '${req.params.isbn}' and assign owner of accountId '${req.decoded.id}'.`
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
        'updatedBy': req.decoded.sub,
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
          m: `Failed to update account with id of '${req.decoded.USERNAME}' and assign book with ISBN '${req.params.isbn}'. Might not exist yet.`
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
