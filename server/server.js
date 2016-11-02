'use strict'

// -----------------------------------------------------------------------------
// NODE MODULES
// -----------------------------------------------------------------------------

// CONFIG
require('dotenv').config()

// Express dependencies
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

// Initiate Express
const app = express()
const router = express.Router()

// Data and modeling
const mongoose = require('mongoose')

// -----------------------------------------------------------------------------
// APP MODULES
// -----------------------------------------------------------------------------

const apiBooks = require('./routes/api.books')

// -----------------------------------------------------------------------------
// APP CONFIGURATION
// -----------------------------------------------------------------------------

// EXPRESS
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

// MONGODB
mongoose.Promise = global.Promise // native Node.js promise
mongoose.connect(process.env.MONGODB_URI)

// -----------------------------------------------------------------------------
// REGISTER ROUTES
// -----------------------------------------------------------------------------

app.use('/api', apiBooks)

// -----------------------------------------------------------------------------
// RUN THE APP
// -----------------------------------------------------------------------------

const host = process.env.HOST || "localhost"
const port = process.env.PORT || "3000"

app.listen(port, host, (err) => {
  if (err) console.log(err)
  console.log(`Server is running on ${host}:${port}`)
})
