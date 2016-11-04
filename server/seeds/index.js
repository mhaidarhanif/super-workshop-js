'use strict'

require('dotenv').config()
const fs = require('fs')
const mongoose = require('mongoose')
const Books = require('../models/books')

mongoose.connect(process.env.MONGODB_URI)
const books = JSON.parse(fs.readFileSync(__dirname + '/books.json', 'utf8'))

Books.create(books, (err) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
  console.log('Seeding books completed!')
  process.exit()
})
