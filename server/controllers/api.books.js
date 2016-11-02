const books = require('../data/books.js')

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
    GET
    api/books
  */
  getBooks: (req, res) => {
    res.json(books)
  },

  /*
    POST
    api/books
  */
  postBooks: (req, res) => {
    const book = {
      id: Number(req.body.id),
      name: req.body.name,
      price: Number(req.body.price)
    }
    books.push(book)
    res.json(book)
  },

  /*
    GET
    api/books/:id
  */
  getBookById: (req, res) => {
    const book = books.filter(book => {
      return book.id === Number(req.params.id)
    })[0]
    if (!book) res.status(404).json({ 'message': "No book found" })
    res.status(200).json(book)
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
