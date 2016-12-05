const R = require('ramda')

const Book = require('./model')

const books = require('./seed.json')
const booksLot = require('./seed.lot.json')

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

// Send response when POST
const sendResponse = (res, err, data, message) => {
  if (err) {
    res.status(400).json({
      e: `${err}`,
      m: 'Probably a duplicated data issue. Please check the potential book data which probably the same.'
    })
  } else if (!data) res.status(304).json({ m: message })
  else res.status(201).json(data)
}

// Send response when GET/PUT
const sendResponseNF = (res, err, data, message) => {
  if (err) {
    res.status(400).json({
      e: `${err}`,
      m: 'Something wrong, try again.'
    })
  } else if (!data) res.status(404).json({ m: message })
  else res.status(200).json(data)
}

// -----------------------------------------------------------------------------
// BOOK CONTROLLER
// -----------------------------------------------------------------------------

const BookController = module.exports = {

  // ---------------------------------------------------------------------------
  // ADMINISTRATIVE
  // ---------------------------------------------------------------------------

  /*
   * @api {get} /books/actions/seed Seed some books
   * @apiName seedBooks
   * @apiGroup Books
   */
  seedBooks: (req, res) => {
    BookController.deleteBooks()
    Book
      .create(books, (err, data) => {
        // console.log('seedBooks:', data)
        sendResponse(res, err, data, 'Failed to seed a few books.')
      })
  },

  /*
   * @api {get} /books/actions/seed-lot Seed a lot of books
   * @apiName seedBooksLot
   * @apiGroup Books
   */
  seedBooksLot: (req, res) => {
    BookController.deleteBooks()
    Book
      .create(booksLot, (err, data) => {
        // console.log('seedBooksLot:', data)
        sendResponse(res, err, data, 'Failed to seed a lot of books.')
      })
  },

  /*
   * @api {get} /books Delete all books
   * @apiName deleteBooks
   * @apiGroup Books
   *
   * @apiParam {Number} isbn
   *
   * @apiSuccess {JSON} message All books have been removed.
   */
  deleteBooks: (req, res) => {
    Book
      .remove()
      .exec((err, data) => {
        // console.log('deleteBooks:', data)
        if (err) res.status(400).json({ e: `Error: ${err}` })
        else if (!data) res.status(404).json({ m: 'Data already empty.' })
        else res.status(200).json({ m: `All books have been removed.` })
      })
  },

  // ---------------------------------------------------------------------------
  // PUBLIC
  // ---------------------------------------------------------------------------

  /*
   * @api {get} /books Get all books
   * @apiName getBooks
   * @apiGroup Books
   *
   * @apiSuccess {Number} isbn  Book ISBN (international standard book number)
   * @apiSuccess {String} name  Book title
   * @apiSuccess {Number} price Book retail price
   */
  getBooks: (req, res) => {
    Book
      .find({})
      .exec((err, data) => {
        // console.log('getBooks:', data)
        sendResponseNF(res, err, data, 'Failed to get all books.')
      })
  },

  /*
   * @api {get} /books?page=20 Get all books with pagination
   * @apiName getBooksPaginated
   * @apiGroup Books
   *
   * @apiSuccess {Number} isbn  Book ISBN (international standard book number)
   * @apiSuccess {String} name  Book title
   * @apiSuccess {Number} price Book retail price
   */
  getBooksPaginated: (req, res) => {
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

  /*
   * @api {post} /books Post a new book
   * @apiName postBooks
   * @apiGroup Books
   *
   * @apiParams {Number} isbn  Book ISBN
   * @apiParams {String} name  Book title
   * @apiParams {Number} price Book retail price
   *
   * @apiSuccess {JSON} isbn, name, price
   */
  postBook: (req, res) => {
    Book
      .create({
        isbn: req.body.isbn,
        name: req.body.name,
        price: req.body.price,
        createdBy: req.decoded.id,
        updatedBy: req.decoded.id
      }, (err, data) => {
        if (err) console.log(err)
        console.log('postBook:', data)
        sendResponse(res, err, data, `Book with ISBN ${req.body.isbn} is probably already exist.`)
      })
  },

  /*
   * @api {post} /books Post a new book with owner data
   */
  postBookAndOwner: (req, res) => {
    const book = {
      isbn: req.body.isbn,
      name: req.body.name,
      price: req.body.price,
      owners: req.body.owner // accountId
    }
    console.log({book})

    Book
      .create(book, (err, data) => {
        if (err) console.log(err)
        console.log('postBookWithOwner:', data)
        sendResponse(res, err, data, `Book with ISBN ${req.body.isbn} is probably already exist.`)
      })
  },

  /*
   * @api {post} /books/search Search some books
   * @apiName searchBooks
   * @apiGroup Books
   *
   * @apiParams {Number} isbn  Book ISBN
   *
   * @apiSuccess {JSON} isbn, name, price
   */
  searchBooks: (req, res) => {
    let book = {}
    if (req.body.isbn) book.isbn = new RegExp(req.body.isbn, 'i')
    if (req.body.name) book.name = new RegExp(req.body.name, 'i')
    if (req.body.price) book.price = Number(req.body.price)
    console.log({book})

    if (!R.isEmpty(book)) {
      Book.find(book, (err, data) => {
        // console.log('searchBooks:', data)
        if (err) res.status(500).json({ e: `Error: ${err}` })
        else if (!data) res.status(304).json({ m: `Failed to search books with data: ${book}` })
        else res.status(200).json(data)
      })
    } else {
      res.status(422).json({ m: `Failed to search books with no data.` })
    }
  },

  /*
   * @api {get} /books/:isbn Get book by ISBN
   * @apiName getBookByISBN
   * @apiGroup Books
   *
   * @apiParams {String} isbn   Book id is ISBN
   *
   * @apiSuccess {Number} isbn  Book ISBN
   * @apiSuccess {String} name  Book title
   * @apiSuccess {Number} price Book retail price
   */
  getBookByISBN: (req, res) => {
    Book.findOne({
      isbn: req.params.isbn
    }, {
      '_id': 0
    }, (err, data) => {
      console.log('getBookByISBN:', data)
      sendResponseNF(res, err, data, 'Failed to GET book by ISBN.')
    })
  },

  /*
   * @api {delete} /books/:isbn Delete book by ISBN
   * @apiName deleteBookByISBN
   * @apiGroup Books
   *
   * @apiParams {String} isbn   Book id is ISBN
   *
   * @apiSuccess {JSON} message Book ISBN has been removed
   */
  deleteBookByISBN: (req, res) => {
    Book.findOneAndRemove({
      isbn: req.params.isbn
    }, (err, data) => {
      console.log('deleteBookByISBN:', data)
      if (err) res.status(400).json({ 'error': `Error: ${err}` })
      else if (!data) res.status(404).json({ 'message': `No book found with ISBN: ${req.params.isbn}.` })
      else {
        res.status(200).json({
          'message': `Book ${req.params.isbn} has been removed.`,
          'data': data
        })
      }
    })
  },

  /*
   * @api {put} /books/:isbn Update book by ISBN
   * @apiName updateBookByISBN
   * @apiGroup Books
   *
   * @apiParams {Number} isbn  Book ISBN
   * @apiParams {String} name  Book title
   * @apiParams {Number} price Book retail price
   *
   * @apiSuccess {JSON} isbn, name, price
   */
  updateBookByISBN: (req, res) => {
    let book = {}
    if (req.body.isbn) book.isbn = req.body.isbn
    if (req.body.name) book.name = req.body.name
    if (req.body.price) book.price = req.body.price

    console.log({book})
    console.log(req.body)

    if (!R.isEmpty(book)) {
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
        console.log('updateBookByISBN:', data)
        sendResponseNF(res, err, data, `Failed to update book with ISBN '${req.params.isbn}'. Might not exist yet.`)
      })
    } else {
      res.status(422).json({ m: `Failed to put owners with no data.` })
    }
  },

  /*
   * @api {put} /books/:isbn/owner Update book by ISBN to put with owner accountId
   * @apiName updateBookByISBNAndOwner
   * @apiGroup Books
   */

  updateBookByISBNAndOwner: (req, res) => {
    let book = {}
    if (req.decoded.id) {
      book.owner = req.decoded.id
      book.updatedBy = req.decoded.id
    }
    console.log({book})

    if (!R.isEmpty(book)) {
      Book.findOneAndUpdate({
        isbn: req.params.isbn
      }, {
        $addToSet: {
          'updatedBy': book.updatedBy,
          'owners': book.owner
        }
      }, {
        new: true,
        upsert: false
      }, (err, data) => {
        console.log('updateBookByISBNAndOwner:', data)
        sendResponseNF(res, err, data, `Failed to update book with ISBN '${req.params.isbn}' and assign owner accountId '${req.decoded.id}'. Might not exist yet.`)
      })
    } else {
      res.status(422).json({ m: `Failed to put owners with no account.` })
    }
  }

}
