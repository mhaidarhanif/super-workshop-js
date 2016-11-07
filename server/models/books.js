const mongoose = require('mongoose')
const Schema = mongoose.Schema

// const searchPlugin = require('mongoose-search-plugin')
// const textSearch = require('mongoose-text-search')

const BookSchema = new Schema({
  isbn: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  owners: [
    {
      type: Number,
      foreignField: 'accountId',
      ref: 'accounts'
    }
  ]
}, {
  timestamps: true
})

// BookSchema.plugin(searchPlugin, {
//   fields: ['isbn', 'name', 'price']
// })

// BookSchema.plugin(textSearch) // Give our schema text search capabilities
// BookSchema.index({ name: 'text' }) // Add a text index

module.exports = mongoose.model('Book', BookSchema)
