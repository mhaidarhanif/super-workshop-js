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
      type: Number,
      foreignField: 'isbn',
      ref: 'Book'
    }
  ]
}, {
  timestamps: true
})

// Auto increment accountId
AccountSchema.plugin(sequence, { inc_field: 'accountId' })

// Auto crypt password
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
