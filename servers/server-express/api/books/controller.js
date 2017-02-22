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
    res.status(400).send({
      s: false,
      id: 'book_error',
      e: `${err}`,
      m: 'Probably a duplicated data issue. Please check the potential book data which probably the same.'
    })
  } else if (!data) res.status(304).send({ id: 'book_data_failed', m: message })
  else res.status(201).send(data)
}

// Send response when GET/PUT
const sendResponseNF = (res, err, data, message) => {
  if (err) {
    res.status(400).send({
      s: false,
      id: 'book_error',
      e: `${err}`,
      m: 'Something wrong. Try again.'
    })
  } else if (!data) res.status(404).send({ id: 'book_data_failed', m: message })
  else res.status(200).send(data)
}

// -----------------------------------------------------------------------------
// BOOK CONTROLLER
// -----------------------------------------------------------------------------

module.exports = {

  // ---------------------------------------------------------------------------
  // ADMINISTRATIVE
  // ---------------------------------------------------------------------------

  /* ---------------------------------------------------------------------------
   * @api {get} /actions/seed
   */
  seedBooks: (req, res) => {
    // Drop books collection
    mongoose.connection.db.dropCollection('books', (err, result) => {
      if (err) res.status(400).send({ id: 'books_drop_error', e: `${err}` })
      console.log('[x] Dropped collection: books')

      // Get the admin you're looking for...
      Account.findOne({ roles: { '$in': ['admin']} }, (err, user) => {
        if (err) res.status(400).send({ id: 'books_seed_find_users_error', m: err })
        if (!user) res.status(400).send({ id: 'books_seed_find_users_failed', m: 'Failed to find users.' })
        // Post seed books
        else {
          Book.create(books, (err, data) => {
            if (err) res.status(400).send({ id: 'books_seed_failed', m: 'Failed to seed books.' })

          // Put the one account id into book owners field
            Book.update({}, {
              $addToSet: {
                'createdBy': user._id,
                'updatedBy': user._id,
                'owners': {owner: user._id}
              }
            }, {
              multi: true, // add more than one items
              new: true,   // return updated data
              upsert: true // create new data if didn't exist yet
            }, (err, info) => {
              if (err) {
                res.status(400).send({ id: 'account_book_error', e: `${err}`, m: 'Something wrong. Try again.' })
              } else if (!info) {
                res.status(404).send({ id: 'account_book_data_failed', m: `Failed to update books' owners.` })
              } else {
              // Finally send the info
                res.status(200).send({
                  books: { s: true, id: 'books_seed_success', m: `Successfully seeded some books.` }
                })
              }
            })
          })
        }
      })
    })
  },

  /* ---------------------------------------------------------------------------
   * @api {get} //actions/seed-lot
   */
  seedBooksLot: (req, res) => {
    // Get the admin you're looking for...
    Account.findOne({ roles: { '$in': ['admin']} }, (err, user) => {
      if (err) res.status(400).send({ id: 'books_seed_find_users_error', m: err })
      if (!user) res.status(400).send({ id: 'books_seed_find_users_failed', m: 'Failed to find users.' })
      // Post seed a lot of books
      else {
        Book.create(booksLot, (err, data) => {
          if (err) res.status(400).send({ id: 'books_seed_lot_failed', m: 'Failed to seed a lot of books.' })
          else {
            // Put the one account id into book owners field
            Book.update({}, {
              $addToSet: {
                'createdBy': user._id,
                'updatedBy': user._id,
                'owners': {owner: user._id}
              }
            }, {
              multi: true, // add more than one items
              new: true,   // return updated data
              upsert: true // create new data if didn't exist yet
            }, (err, info) => {
              if (err) {
                res.status(400).send({
                  s: false,
                  id: 'account_book_error',
                  e: `${err}`,
                  m: 'Something wrong. Try again.'
                })
              } else if (!info) {
                res.status(404).send({
                  s: false,
                  id: 'account_book_data_failed',
                  e: `${err}`,
                  m: `Failed to update books' owners.`
                })
              } else {
            // Finally send the info
                res.status(200).send({
                  books: {
                    s: true,
                    id: 'books_seed_lot_success',
                    m: `Successfully seeded some books.`
                  }
                })
              }
            })
          }
        })
      }
    })
  },

  /* ---------------------------------------------------------------------------
   * @api {delete} /
   */
  deleteBooks: (req, res) => {
    Book.remove().exec((err, result) => {
      if (err) res.status(400).send({books: { s: false, id: 'book_delete_error', e: `${err}` }})
      else if (!result) res.status(404).send({books: { s: false, id: 'book_delete_failed', m: 'Something went wrong.', e: `${err}` }})
      else res.status(200).send({books: { s: true, id: 'book_delete_success', m: `All books have been removed.` }})
    })
  },

  // ---------------------------------------------------------------------------
  // PUBLIC
  // ---------------------------------------------------------------------------

  /* ---------------------------------------------------------------------------
   * @api {get} /?page=1
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
        res.status(400).send({ id: 'books_error', e: `${err}`, m: 'Failed to get all books with pagination.' })
      })
  },

  /* ---------------------------------------------------------------------------
   * @api {get} //all
   */
  getBooksAll: (req, res) => {
    Book
      .find({})
      .exec((err, data) => {
        // console.log('getBooks:', data)
        sendResponseNF(res, err, data, 'Failed to get all books.')
      })
      .catch((err) => {
        res.status(400).send({ id: 'books_error', e: `${err}`, m: 'Failed to get all books without pagination.' })
      })
  },

  /* ---------------------------------------------------------------------------
   * @api {post} /
   */
  postBook: (req, res) => {
    const data = {
      isbn: req.body.isbn,
      title: req.body.title,
      price: req.body.price,
      createdBy: req.decoded.sub,
      updatedBy: req.decoded.sub
    }

    console.log('.....', data)

    Book.create(data, (err, data) => {
      // console.log('postBook:', data)
      sendResponse(res, err, data, `Book with ISBN ${data.isbn} is probably already exist.`)
    })
  },

  /* ---------------------------------------------------------------------------
   * @api {post} /
   */
  postBookAndOwner: (req, res) => {
    const data = {
      isbn: req.body.isbn,
      title: req.body.title,
      price: req.body.price,
      createdBy: req.decoded.sub,
      updatedBy: req.decoded.sub,
      owners: {
        owner: req.decoded.sub
      }
    }

    console.log({book: {data}})

    Book
      .create(data, (err, data) => {
        // console.log('postBookWithOwner:', data)
        sendResponse(res, err, data, `Failed to post book with ISBN ${req.body.isbn}.`)
      })
  },

  /* ---------------------------------------------------------------------------
   * @api {post} //search Search some books
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
      res.status(422).send({ id: 'book_search_no_data', m: `Failed to search books with no data.` })
    }
  },

  /* ---------------------------------------------------------------------------
   * @api {get} /:isbn Get book by ISBN
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
   * @api {delete} /:isbn Delete book by ISBN
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
      if (err) res.status(400).send({ id: 'book_delete_error', e: `Error: ${err}` })
      else if (!data) res.status(404).send({ id: 'book_delete_not_found', m: `No book found with ISBN '${req.params.isbn}'.` })
      else {
        updated.book = data
      }
    })

    // Remove book ISBN from multi accounts data
    Account.update({
      books: { '$in': [req.params.isbn] }
    }, {
      $pull: { 'books': req.params.isbn },
      $addToSet: { 'updatedBy': req.decoded.sub }
    }, {
      multi: true,
      new: true,
      upsert: true
    }, (err, info) => {
      if (err) {
        res.status(400).send({
          id: 'account_book_error', e: `${err}`, m: 'Something wrong. Try again.'
        })
      } else if (!info) {
        res.status(404).send({
          id: 'account_book_data_failed',
          m: `Failed to update account with ID '${req.decoded.id}' and remove their books with ISBN '${req.params.isbn}'. Might not exist yet.`
        })
      }
      updated.i = info
    })

    // Wait until all data have been removed and updated
    // Finally send the deleted book and updated account data
    // console.log(updated)
    setTimeout(() => { res.status(201).send(updated) }, 1000)
  },

  /* ---------------------------------------------------------------------------
   * @api {put} /:isbn
   */
  updateBookByISBN: (req, res) => {
    // Prepare required data
    let book = {}
    if (req.body.isbn) book.isbn = String(req.body.isbn)
    if (req.body.title) book.title = req.body.title
    if (req.body.price) book.price = req.body.price
    console.log({book})

    // Update existing book data with new book data
    Book.findOneAndUpdate({
      isbn: req.params.isbn
    }, {
      $set: book,
      $addToSet: { // only add if not exist
        'updatedBy': req.decoded.sub
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
   * @api {put} /:isbn/owner Update book by ISBN to put with owner
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
        res.status(400).send({
          id: 'book_error', e: `${err}`, m: 'Something wrong. Try again.'
        })
      } else if (!data) {
        res.status(404).send({
          id: 'book_data_failed',
          m: `Failed to update book with ISBN '${req.params.isbn}' and assign owner of accountId '${req.decoded.id}'.`
        })
      } else {
        updated.book = data
      }
    })

    // Assign book ISBN to account's books
    Account.findOneAndUpdate({
      _id: req.decoded.sub
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
        res.status(400).send({
          id: 'book_error', e: `${err}`, m: 'Something wrong. Try again.'
        })
      } else if (!data) {
        res.status(404).send({
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
    setTimeout(() => { res.status(201).send(updated) }, 1000)
  }

// BookController
}
