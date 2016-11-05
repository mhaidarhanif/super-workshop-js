const mongoose = require('mongoose')
const Schema = mongoose.Schema

// const searchPlugin = require('mongoose-search-plugin')
// const textSearch = require('mongoose-text-search')

const BookSchema = new Schema({
  isbn: String,
  name: String,
  price: Number
}, {
  timestamps: true
})

// BookSchema.plugin(searchPlugin, {
//   fields: ['isbn', 'name', 'price']
// })

// BookSchema.plugin(textSearch) // Give our schema text search capabilities
// BookSchema.index({ name: 'text' }) // Add a text index

module.exports = mongoose.model('Book', BookSchema)
