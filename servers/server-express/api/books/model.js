const mongoose = require('mongoose')
const Schema = mongoose.Schema
const sequence = require('mongoose-sequence')
const mongoosePaginate = require('mongoose-paginate')

// const searchPlugin = require('mongoose-search-plugin')
// const textSearch = require('mongoose-text-search')

const statusTypes = ['unknown', 'available', 'unavailable', 'rare']

// -----------------------------------------------------------------------------

mongoosePaginate.paginate.options = {
  // lean: true,
  // leanWithId: false,
  page: 1,
  limit: 10,
  sort: { updatedAt: -1 }
}

// -----------------------------------------------------------------------------

const BookSchema = new Schema({
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
BookSchema.plugin(sequence, { inc_field: 'bookId' })

// -----------------------------------------------------------------------------
// PAGINATION
BookSchema.plugin(mongoosePaginate)

// -----------------------------------------------------------------------------
// ADDITIONALS
BookSchema.virtual('lenders', {
  ref: 'Account',
  localField: 'owners', // Find account where `localField`
  foreignField: 'books' // is equal to `foreignField`
})

// -----------------------------------------------------------------------------
// POPULATE
BookSchema.pre('find', function (next) {
  this.select({ __v: false })
  this.populate([
    {path: 'owners.owner', select: 'username name'},
    {path: 'createdBy', select: 'username name'},
    {path: 'updatedBy', select: 'username name'}
  ])
  next()
})
BookSchema.pre('findOne', function (next) {
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
// BookSchema.plugin(searchPlugin, {
//   fields: ['isbn', 'name', 'price']
// })

// Give our schema text search capabilities
// BookSchema.plugin(textSearch)

// Add a text index
// BookSchema.index({ name: 'text' })
// -----------------------------------------------------------------------------

module.exports = mongoose.model('Book', BookSchema)
