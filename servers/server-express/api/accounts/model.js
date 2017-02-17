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
const planTypes = ['free', 'personal', 'team', 'school', 'startup', 'enterprise', 'custom']

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
    validate: validateName,
    firstName: String,
    lastName: String
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
  title: String,
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
  bitbucket: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  gitlab: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  // Properties
  url: String,
  tokens: [],
  roles: [
    {
      type: String,
      lowercase: true,
      enum: roleTypes,
      default: ['user']
    }
  ],
  // Preferences
  notification: Boolean,
  coupons: [],
  plan: {
    type: String,
    lowercase: true,
    enum: planTypes
  },
  // Development
  apiKey: String,
  sshKey: String,
  // Ownership
  books: [
    {
      book: {
        type: Schema.Types.ObjectId,
        ref: 'Book'
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
// ADDITIONALS

// Auto increment accountId
AccountSchema.plugin(sequence, { inc_field: 'accountId' })

AccountSchema.pre('save', function (next) {
  if (this.roles.length === 0) this.roles.push('user')
  if (this.username === 'super') this.roles.push('super')
  if (this.username === 'super' || 'admin') this.roles.push('admin')
  if (this.createdBy.length === 0) this.createdBy = this.id
  next()
})

// Public profile information
AccountSchema.virtual('profile').get(function () {
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
AccountSchema.virtual('token').get(function () {
  return {
    _id: this._id,
    name: this.name,
    username: this.username,
    role: this.role
  }
})

// -----------------------------------------------------------------------------
// PASSWORD GENERATOR + VALIDATOR

// Generating a hash via statis class methods (OK)
AccountSchema.methods.generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

// Checking if password has is valid via instance methods (WIP)
// AccountSchema.methods.validPassword = (password) => {
//   console.log('this:', this)
//   return bcrypt.compareSync(password, this.hash)
// }

// -----------------------------------------------------------------------------
// POPULATE

AccountSchema.pre('find', function (next) {
  this.populate('books.book', 'title')
  next()
})

AccountSchema.pre('findOne', function (next) {
  this.populate('books.book', 'title')
  next()
})

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
