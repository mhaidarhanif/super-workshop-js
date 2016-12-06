const mongoose = require('mongoose')
const Schema = mongoose.Schema

const passportLocalMongoose = require('passport-local-mongoose')
const sequence = require('mongoose-sequence')

const AccountSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  books: [
    {
      type: String,
      foreignField: 'isbn',
      ref: 'Book'
    }
  ],
  url: {
    type: String
  },
  createdBy: [
    {
      type: Number,
      foreignField: 'accountId',
      ref: 'Account'
    }
  ],
  updatedBy: [
    {
      type: Number,
      foreignField: 'accountId',
      ref: 'Account'
    }
  ]
}, {
  timestamps: true
})

// Auto increment accountId
AccountSchema.plugin(sequence, { inc_field: 'accountId' })

// Auto hash and salt the password field
AccountSchema.plugin(passportLocalMongoose)

// -----------------------------------------------------------------------------
// POPULATE

// AccountSchema.plugin(deepPopulate)

// AccountSchema.pre('find', function (next) {
//   this.populate('books.isbn', 'name')
//   next()
// })
// AccountSchema.pre('findOne', function (next) {
//   this.populate('books.isbn', 'name')
//   next()
// })
// -----------------------------------------------------------------------------

module.exports = mongoose.model('Account', AccountSchema)
