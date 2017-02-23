/*
Book: A collection of pages
http://schema.org/Book
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const sequence = require('mongoose-sequence')
const mongoosePaginate = require('mongoose-paginate')
// const searchPlugin = require('mongoose-search-plugin')
// const textSearch = require('mongoose-text-search')

mongoosePaginate.paginate.options = {
  // lean: true,
  // leanWithId: false,
  page: 1,
  limit: 10,
  sort: { updatedAt: -1 }
}

// -----------------------------------------------------------------------------
// PRECONFIGURATION

const modelName = 'Book'

const statusTypes = [
  'unknown',
  'available',
  'unavailable',
  'rare'
]

// -----------------------------------------------------------------------------

const schema = new Schema({
  isbn: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  // Properties
  url: String,
  status: [
    {
      type: String,
      lowercase: true,
      enum: statusTypes,
      default: 'unknown'
    }
  ],
  // Ownership
  owners: [
    {
      owner: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdBy: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Account'
    }
  ],
  updatedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Account'
    }
  ]
}, {
  timestamps: true
})

// -----------------------------------------------------------------------------
// AUTO INCREMENT ID

schema.plugin(sequence, { inc_field: 'bookId' })

// -----------------------------------------------------------------------------
// PAGINATION

schema.plugin(mongoosePaginate)

// -----------------------------------------------------------------------------
// ADDITIONALS

schema.virtual('lenders', {
  ref: 'Account',
  localField: 'owners', // Find account where `localField`
  foreignField: 'books' // is equal to `foreignField`
})

// -----------------------------------------------------------------------------
// DATA POPULATION

schema.pre('find', function (next) {
  this.select({ __v: false })
  this.populate([
    {path: 'owners.owner', select: 'username name'},
    {path: 'createdBy', select: 'username name'},
    {path: 'updatedBy', select: 'username name'}
  ])
  next()
})

schema.pre('findOne', function (next) {
  this.select({ __v: false })
  this.populate([
    {path: 'owners.owner', select: 'username name'},
    {path: 'createdBy', select: 'username name'},
    {path: 'updatedBy', select: 'username name'}
  ])
  next()
})

// -----------------------------------------------------------------------------
// FULL TEXT SEARCH

// Give our schema text search capabilities
// schema.plugin(searchPlugin, {
//   fields: ['isbn', 'name', 'price']
// })

// Give our schema text search capabilities
// schema.plugin(textSearch)

// Add a text index
// schema.index({ name: 'text' })
// -----------------------------------------------------------------------------

module.exports = mongoose.model(modelName, schema)
