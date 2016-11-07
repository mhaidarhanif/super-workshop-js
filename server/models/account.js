const mongoose = require('mongoose')
const Schema = mongoose.Schema

const increment = require('mongoose-increment');
const passportLocalMongoose = require('passport-local-mongoose')

const Account = new Schema({
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
      ref: 'books'
    }
  ]
}, {
  timestamps: true
})

Account.plugin(increment, {
  modelName: 'Account',
  fieldName: 'accountId'
})

Account.plugin(passportLocalMongoose)

module.exports = mongoose.model('Account', Account)
