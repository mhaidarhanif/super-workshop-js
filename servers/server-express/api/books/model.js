const mongoose = require('mongoose')
const Schema = mongoose.Schema

// const searchPlugin = require('mongoose-search-plugin')
// const textSearch = require('mongoose-text-search')

// Paginate list of all data
const mongoosePaginate = require('mongoose-paginate')

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
  this.populate('owners.owner', 'username')
  this.populate('createdBy', 'username')
  this.populate('updatedBy', 'username')
  next()
})

BookSchema.pre('findOne', function (next) {
  this.select({ __v: false })
  this.populate('owners.owner', 'username')
  this.populate('createdBy', 'username')
  this.populate('updatedBy', 'username')
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
