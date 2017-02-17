/*
Account is a Person: A person is either alive, dead, undead, or fictional.
http://schema.org/Person
*/

const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const sequence = require('mongoose-sequence')
const validate = require('mongoose-validator')

const Schema = mongoose.Schema

const roleTypes = [
  'super',
  'admin',
  'dev',
  'ops',
  'test',
  'user'
]
const authTypes = [
  'local',
  'github',
  'twitter',
  'facebook',
  'google'
]
const planTypes = [
  'free',
  'personal',
  'team',
  'education',
  'startup',
  'business',
  'enterprise',
  'custom'
]

const SALT_WORK_FACTOR = 8

// -----------------------------------------------------------------------------
// FIELD VALIDATORS

const validateName = validate({
  validator: 'isLength',
  arguments: [
    3, 50
  ],
  message: 'Name must between {ARGS[0]} and {ARGS[1]} characters'
})

const validateEmail = [validate({ validator: 'isEmail', message: 'Email must be a valid email (name@example.com)' })]

const validateUsername = [
  validate({
    validator: 'isLength',
    arguments: [
      1, 50
    ],
    message: 'Username must between {ARGS[0]} and {ARGS[1]} characters'
  }),
  validate({ validator: 'isAlphanumeric', passIfEmpty: true, message: 'Name should contain alpha-numeric characters only' })
]

const validateURL = [validate({ validator: 'isURL', message: 'URL must be a valid URL (http://example.com/path/to/page.html)' })]

// -----------------------------------------------------------------------------
// SCHEMA

const AccountSchema = new Schema({
  // Internal
  name: {
    type: String,
    // required: true,
    firstName: String,
    lastName: String,
    validate: validateName
  },
  username: {
    type: String,
    // required: true,
    unique: true,
    lowercase: true,
    validate: validateUsername
  },
  email: {
    type: String,
    // required: true,
    unique: true,
    lowercase: true,
    validate: validateEmail
  },
  password: String,
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
    min: [
      6, 'Too young'
    ],
    max: [ 120, 'Too old' ]
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
}, { timestamps: true })

// -----------------------------------------------------------------------------
// GENERATED FIELDS

// Auto increment accountId
AccountSchema.plugin(sequence, { inc_field: 'accountId' })

// -----------------------------------------------------------------------------
// MIDDLEWARES
// - ROLES ASSIGNER
// - PASSWORD HASH + SALT GENERATOR

// BEWARE! We cannot define the same mongoose middlewares separately
AccountSchema.pre('save', function (next) {
  // assign roles
  if (this.username === 'super') this.roles.push('super')
  if (this.username === ('super' || 'admin')) this.roles.push('admin')
  // assign created by who
  if (this.createdBy.length === 0) this.createdBy = this._id
  // only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) next()
  else {
    // Generate salt with predefined factor
    // BEWARE! We cannot do these in synchronous way
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
      if (err) next(err)
      else {
        // Generate hash with current plain password and salt
        bcrypt.hash(this.password, salt, (err, hash) => {
          if (err) next(err)
          else {
            // override the clear text password with the hashed one
            this.password = hash
            this.hash = hash
            this.salt = salt
            next() // finally!
          }
        })
      }
    })
  }
})

AccountSchema.post('init', function (doc) {
  console.log(`[i] ACCOUNT: ${doc._id} ${doc.username} has been initialized`)
})
AccountSchema.post('validate', function (doc) {
  console.log(`[i] ACCOUNT: ${doc._id} ${doc.username} has been validated (but not saved yet)`)
})
AccountSchema.post('save', function (doc) {
  console.log(`[i] ACCOUNT: ${doc._id} ${doc.username} has been saved`)
})
AccountSchema.post('remove', function (doc) {
  console.log(`[i] ACCOUNT: ${doc._id} ${doc.username} has been removed`)
})

// -----------------------------------------------------------------------------
// EXTRA INFORMATION

// Public profile information
AccountSchema.virtual('profile').get(function () {
  return {
    username: this.username,
    name: this.name,
    github: {
      name: this.github.name
    },
    facebook: {
      name: this.facebook.name
    },
    twitter: {
      name: this.twitter.name
    },
    google: {
      name: this.google.name
    }
  }
})

// Non-sensitive info we'll be putting in the token
AccountSchema.virtual('token').get(function () {
  return { _id: this._id, name: this.name, username: this.username, role: this.role }
})

// -----------------------------------------------------------------------------
// DATA POPULATION

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
// FINALLY REGISTER THE SCHEMA INTO MODEL

module.exports = mongoose.model('Account', AccountSchema)
