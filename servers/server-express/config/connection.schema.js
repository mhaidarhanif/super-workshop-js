'use strict'

const url = require('url')

const PROTOCOL = 'http'

const SERVER = {
  HOST: process.env.SERVER_HOST || 'localhost',
  PORT: process.env.SERVER_PORT || 3000
}

const CLIENT = {
  HOST: process.env.CLIENT_HOST || 'localhost',
  PORT: process.env.CLIENT_PORT || 3000
}

const URL = {
  SERVER: url.format({
    protocol: PROTOCOL,
    host: SERVER.HOST,
    port: SERVER.PORT
  }),
  CLIENT: url.format({
    protocol: PROTOCOL,
    host: CLIENT.HOST,
    port: CLIENT.PORT
  })
}

module.exports = {
  PROTOCOL,
  SERVER,
  CLIENT,
  URL
}
