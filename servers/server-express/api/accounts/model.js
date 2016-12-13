/*
Account is a Person
A person is either alive, dead, undead, or fictional.
http://schema.org/Person
*/

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const passportLocalMongoose = require('passport-local-mongoose')
const sequence = require('mongoose-sequence')

const AccountSchema = new Schema({
  name: {
    type: String,
    required: true,
    first: {
      type: String,
      required: false
    },
    middle: {
      type: String,
      required: false
    },
    last: {
      type: String,
      required: false
    }
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
    type: String,
    required: false
  },
  verified: {
    type: Boolean,
    required: false
  },
  image: {
    type: String,
    required: false
  },
  gender: {
    type: Number,
    required: false
  },
  birthDate: {
    type: Date,
    required: false
  },
  age: {
    type: Number,
    required: false
  },
  telephone: {
    type: String,
    required: false
  },
  affiliation: {
    type: String,
    required: false
  },
  url: {
    type: String,
    required: false
  },
  books: [
    {
      type: String,
      required: false,
      foreignField: 'isbn',
      ref: 'Book'
    }
  ],
  createdBy: [
    {
      type: Number,
      required: false,
      foreignField: 'accountId',
      ref: 'Account'
    }
  ],
  updatedBy: [
    {
      type: Number,
      required: false,
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
