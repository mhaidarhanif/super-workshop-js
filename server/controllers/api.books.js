// LEGACY DATA WITH JSON
const books = require('../data/books')

// DATA WITH MONGOOSE MODEL
const Book = require('../models/books')

// -----------------------------------------------------------------------------
// CONTROLLING
// -----------------------------------------------------------------------------

module.exports = {
  /*
    PING
  */
  ping: (req, res) => {
    res.json({ 'message': 'PONG!' })
  },

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
    Book.find({}, (err, data) => {
      if (err) res.status(400).json({ 'error': `Error: ${err}` })
      if (!data) res.status(404).json({ 'message': 'No books found' })
      res.status(200).json(data)
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
    const book = {
      isbn: req.body.isbn,
      name: req.body.name,
      price: Number(req.body.price)
    }
    Book.create(book, (err, data) => {
      if (err) res.status(400).json({ 'error': `Error: ${err}` })
      if (!data) res.status(304).json({ 'message': 'Failed to post book' })
      res.status(200).json(data)
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
      if (err) res.status(400).json({ 'error': `Error: ${err}` })
      if (!data) res.status(404).json({ 'message': 'No book found' })
      res.status(200).json(data)
    })
  },

  /*
    DELETE
    api/books/:id
  */
  deleteBookById: (req, res) => {
    // get book by id
    const book = books.filter(book => {
      return book.id === Number(req.params.id)
    })[0]
    if (!book) res.status(404).json({ 'message': "No book found" })
      // delete the book by id from array of book
    books.splice(books.indexOf(book), 1)
    res.status(200).json({ 'message': `Book ${req.params.id} has been deleted` })
  },

  /*
    PUT
    api/books/:id
  */
  updateBookById: (req, res) => {
    const book = books.filter(book => {
      return book.id == req.params.id
    })[0]
    if (!book) res.status(404).json({ message: "No book found" })
    const index = books.indexOf(book)
    const keys = Object.keys(req.body)
    keys.forEach(key => {
      // book[key] = req.body[key]
      book.id = Number(req.body.id)
      book.name = req.body.name
      book.price = Number(req.body.price)
    })
    books[index] = book
    res.json(book)
  }

}
