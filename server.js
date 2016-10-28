'use strict'

// -----------------------------------------------------------------------------
// NODE MODULES
// -----------------------------------------------------------------------------

// Express dependencies
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

// Initiate Express
const app = express()
const router = express.Router()

// -----------------------------------------------------------------------------
// APP CONFIGURATION
// -----------------------------------------------------------------------------

// req.body
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

const books = require('./data.js')

// -----------------------------------------------------------------------------
// ROUTING
// -----------------------------------------------------------------------------

router.get('/ping', (req, res) => {
  res.json({ 'message': 'PONG!' })
})

router.get('/books', (req, res) => {
  res.json(books)
})

// -----------------------------------------------------------------------------
// REGISTER ROUTES
// -----------------------------------------------------------------------------

app.use('/', router)

// -----------------------------------------------------------------------------
// RUN THE APP
// -----------------------------------------------------------------------------

const host = process.env.HOST || "localhost"
const port = process.env.PORT || "3000"

app.listen(port, host, (err) => {
  if (err) console.log(err)
  console.log(`Server is running on ${host}:${port}`)
})
