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
    console.log('ping');
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
      // console.log('getBooks:', data)
      if (err) res.status(400).json({ 'error': `Error: ${err}` })
      if (!data) res.status(404).json({ 'message': 'Failed to get all books' })
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
      console.log('postBook:', data)
      if (err) res.status(400).json({ 'error': `Error: ${err}` })
      if (!data) res.status(304).json({ 'message': 'Failed to post book with that data' })
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
      console.log('getBookByISBN:', data)
      if (err) res.status(400).json({ 'error': `Error: ${err}` })
      if (!data) res.status(404).json({ 'message': 'Failed to get book by ISBN' })
      res.status(200).json(data)
    })
  },

  /*
    DELETE
    api/books/:isbn
  */
  deleteBookByISBN: (req, res) => {
    Book.findOneAndRemove({
      isbn: req.params.isbn
    }, (err, data) => {
      console.log('deleteBookByISBN:', data)
      if (err) res.status(400).json({ 'error': `Error: ${err}` })
      if (!data) res.status(404).json({ 'message': 'No book found' })
      res.status(200).json({ 'message': `Book ${req.params.isbn} has been deleted` })
    })
  },

  /*
    PUT
    api/books/:isbn
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
      if (err) res.status(400).json({ 'error': `Error: ${err}` })
      if (!data) res.status(404).json({ 'message': 'Failed to update book by ISBN' })
      res.status(200).json(data)
    })

  }

}
