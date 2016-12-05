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
      e: `Error: ${err}`,
      m: 'Probably a duplicated data issue. Please delete the potential data which will be the same before.'
    })
  } else if (!data) res.status(304).json({ 'message': message })
  else res.status(201).json(data)
}

// Send response when GET/PUT
const sendResponseNF = (res, err, data, message) => {
  if (err) {
    res.status(400).json({
      e: `Error: ${err}`,
      m: 'Something wrong, try again.'
    })
  } else if (!data) res.status(404).json({ 'message': message })
  else res.status(200).json(data)
}

// -----------------------------------------------------------------------------
// BOOKS CONTROLLERS
// -----------------------------------------------------------------------------

module.exports = {

  // ---------------------------------------------------------------------------
  // ADMINISTRATIVE
  // ---------------------------------------------------------------------------

  /*
   * @api {get} /books/actions/seed Seed some books
   * @apiName seedBooks
   * @apiGroup Books
   */
  seedBooks: (req, res) => {
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
      .find()
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
        select: 'isbn name price owners',
        page: req.query.page || 1,
        limit: req.query.limit || 10
      })
      .then((result) => {
        const data = result.docs
        const err = 'ERROR: Get all books with pagination'

        console.log('getBooksPaginated:', data)
        sendResponseNF(res, err, data, 'Failed to get all books.')
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
        price: req.body.price
      }, (err, data) => {
        // console.log('postBook:', data)
        sendResponse(res, err, data, 'Failed to post book with that data')
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

    Book.create(book, (err, data) => {
      // console.log('postBookWithOwner:', data)
      sendResponse(res, err, data, 'Failed to POST book with that data and ownership')
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
    const params = {}
    if (req.body.isbn) params.isbn = req.body.isbn
    if (req.body.name) params.name = req.body.name

    Book.find(params, (err, data) => {
      console.log('searchBooks:', data)
      if (err) return res.status(500).json({ e: `Error: ${err}` })
      else if (!data) res.status(304).json({ m: `Failed to find books with params: ${params}` })
      else res.status(200).json(data)
    })
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
    Book.findOneAndUpdate({
      isbn: req.params.isbn
    }, {
      isbn: req.body.isbn,
      name: req.body.name,
      price: req.body.price
    }, {
      new: true,
      upsert: true
    }, (err, data) => {
      console.log('updateBookByISBN:', data)
      sendResponseNF(res, err, data, 'Failed to UPDATE book by ISBN.')
    })
  },

  /*
   * @api {put} /books/:isbn/owner Update book by ISBN to put with owner accountId
   * @apiName updateBookByISBNAndOwner
   * @apiGroup Books
   */

  updateBookByISBNAndOwner: (req, res) => {
    Book.findOneAndUpdate({
      isbn: req.params.isbn
    }, {
      $push: { 'owners': req.body.owner }
    }, {
      new: true,
      upsert: false
    }, (err, data) => {
      console.log('updateBookByISBNAndOwner:', data)
      sendResponseNF(res, err, data, 'Failed to UPDATE book by ISBN and PUSH owner accountId.')
    })
  }

}
