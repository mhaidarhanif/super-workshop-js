const connection = require('./connection')
const url = connection.URL

const SECRET = {
  JWT: process.env.JWT_SECRET || 'change_this',
  SESSION: process.env.SESSION_SECRET || 'change_this'
}

const API_KEY = {
  DEV: process.env.API_KEY_DEV || 'change_this',
  TEST: process.env.API_KEY_TEST || 'change_this',
  STAGING: process.env.API_KEY_STAGING || 'change_this',
  PRODUCTION: process.env.API_KEY_PRODUCTION || 'change_this'
}

const GITHUB = {
  CLIENT_ID: process.env.GITHUB_ID || 'change_this',
  CLIENT_SECRET: process.env.GITHUB_SECRET || 'change_this',
  CALLBACK: `${url}/auth/github/callback`
}

const FACEBOOK = {
  APP_ID: process.env.FACEBOOK_ID || 'change_this',
  APP_SECRET: process.env.FACEBOOK_SECRET || 'change_this',
  CALLBACK: `${url}/auth/facebook/callback`
}

const TWITTER = {
  API_KEY: process.env.TWITTER_KEY || 'change_this',
  API_SECRET: process.env.TWITTER_SECRET || 'change_this',
  CALLBACK: `${url}/auth/twitter/callback`
}

const GOOGLE = {
  CLIENT_ID: process.env.GOOGLE_ID || 'change_this',
  CLIENT_SECRET: process.env.GOOGLE_SECRET || 'change_this',
  CALLBACK: `${url}/auth/google/callback`
}

module.exports = {
  SECRET,
  API_KEY,
  GITHUB,
  FACEBOOK,
  TWITTER,
  GOOGLE
}
