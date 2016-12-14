/*
Account is a Person
A person is either alive, dead, undead, or fictional.
http://schema.org/Person
*/

const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const sequence = require('mongoose-sequence')
const validate = require('mongoose-validator')

const Schema = mongoose.Schema

const roleTypes = ['super', 'admin', 'dev', 'ops', 'test', 'user']
const authTypes = ['local', 'github', 'twitter', 'facebook', 'google']

// -----------------------------------------------------------------------------

const validateName = validate({
  validator: 'isLength',
  arguments: [3, 50],
  message: 'Name must between {ARGS[0]} and {ARGS[1]} characters'
})

const validateEmail = [
  validate({
    validator: 'isEmail',
    message: 'Email must be a valid email (name@example.com)'
  })
]

const validateUsername = [
  validate({
    validator: 'isLength',
    arguments: [1, 50],
    message: 'Username must between {ARGS[0]} and {ARGS[1]} characters'
  }),
  validate({
    validator: 'isAlphanumeric',
    passIfEmpty: true,
    message: 'Name should contain alpha-numeric characters only'
  })
]

const validateURL = [
  validate({
    validator: 'isURL',
    message: 'URL must be a valid URL (http://example.com/path/to/image.png)'
  })
]

// -----------------------------------------------------------------------------

const AccountSchema = new Schema({
  // Internal
  name: {
    type: String,
    validate: validateName
  },
  username: {
    type: String,
    unique: true,
    lowercase: true,
    validate: validateUsername
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    validate: validateEmail
  },
  hash: String,
  salt: String,
  verified: Boolean,
  gender: Number,
  telephone: String,
  affiliation: String,
  birthDate: Date,
  age: {
    type: Number,
    min: [6, 'Too young'],
    max: [120, 'Too old']
  },
  image: {
    type: String,
    validate: validateURL
  },
  // External
  providers: [
    {
      type: String,
      lowercase: true,
      enum: authTypes,
      default: 'local'
    }
  ],
  github: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  // Properties
  url: {
    type: String,
    required: false
  },
  roles: [
    {
      type: String,
      lowercase: true,
      enum: roleTypes
    }
  ],
  // Ownership
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

// -----------------------------------------------------------------------------
// ADDITIONALS

// Auto increment accountId
AccountSchema.plugin(sequence, { inc_field: 'accountId' })

// Public profile information
AccountSchema.virtual('profile').get(() => {
  return {
    username: this.username,
    name: this.name,
    github: { name: this.github.name },
    facebook: { name: this.facebook.name },
    twitter: { name: this.twitter.name },
    google: { name: this.google.name }
  }
})

// Non-sensitive info we'll be putting in the token
AccountSchema.virtual('token').get(() => {
  return {
    _id: this._id,
    name: this.name,
    username: this.username,
    role: this.role
  }
})

// -----------------------------------------------------------------------------
// ASYNC PASSWORD GENERATOR + VALIDATOR

// Generating a hash
// Via statis class methods
AccountSchema.statics.generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}
// Checking if password has is valid
// Via instance methods
AccountSchema.methods.validPassword = (password) => {
  return bcrypt.compareSync(password, this.password)
}

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
