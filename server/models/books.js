const mongoose = require('mongoose')
const Schema = mongoose.Schema

// TODO: Use full text search
// const searchPlugin = require('mongoose-search-plugin')
// const textSearch = require('mongoose-text-search')

const BookSchema = new Schema({
  isbn: {
    type: Number,
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
      ref: 'Account'
    }
  ]
}, {
  timestamps: true
})

// -----------------------------------------------------------------------------
// POPULATE

// BookSchema.pre('find', function (next) {
//   this.populate('owners', 'name')
//   next()
// })

// BookSchema.pre('findOne', function (next) {
//   this.populate('owners', 'name')
//   next()
// })
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// FULL TEXT SEARCH

// Give our schema text search capabilities
// BookSchema.plugin(searchPlugin, {
//   fields: ['isbn', 'name', 'price']
// })

// Give our schema text search capabilities
// BookSchema.plugin(textSearch)

// Add a text index
// BookSchema.index({ name: 'text' })
// -----------------------------------------------------------------------------

module.exports = mongoose.model('Book', BookSchema)
