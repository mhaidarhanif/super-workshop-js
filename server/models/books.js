const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Book = new Schema({
  isbn: String,
  name: String,
  price: Number
}, {
  timestamp: true
})

module.exports = mongoose.model('Book', Book)
