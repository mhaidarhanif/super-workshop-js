var mongoose = require('mongoose')
var Schema = mongoose.Schema
var passportLocalMongoose = require('passport-local-mongoose')

var Account = new Schema({
  name: String,
  username: String,
  email: String,
  password: {
    type: String,
    lowercase: true,
    trim: true
  }
})

Account.plugin(passportLocalMongoose)

module.exports = mongoose.model('Account', Account)
