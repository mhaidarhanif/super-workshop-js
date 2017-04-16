const connection = require('./connection')
const url = connection.URL.SERVER

const ACCOUNT = {
  username: process.env.USERNAME || 'admin',
  password: process.env.PASSWORD || 'change_this'
}

const SECRET = {
  JWT: process.env.JWT_SECRET || 'super_jwt_secret',
  SESSION: process.env.SESSION_SECRET || 'super_session_secret'
}

const API_KEY = {
  SETUP: process.env.API_KEY_SETUP || 'super_setup',
  DEV: process.env.API_KEY_DEV || 'super_development',
  TEST: process.env.API_KEY_TEST || 'super_test',
  STAGING: process.env.API_KEY_STAGING || 'super_staging',
  PRODUCTION: process.env.API_KEY_PRODUCTION || 'super_production'
}

const MAIL = {
  MAILGUN: {
    API_KEY: process.env.MAILGUN_API_KEY || 'change_this',
    DOMAIN: process.env.MAILGUN_DOMAIN || 'change_this',
    SENDER: process.env.MAILGUN_SENDER || 'change_this'
  },
  SENDGRID: {
    API_KEY: process.env.SENDGRID_API_KEY || 'change_this',
    DOMAIN: process.env.SENDGRID_DOMAIN || 'change_this',
    SENDER: process.env.SENDGRID_SENDER || 'change_this'
  }
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
  CLIENT_ID: process.env.GOOGLE_ID || 'change_this.apps.googleusercontent.com',
  CLIENT_SECRET: process.env.GOOGLE_SECRET || 'change_this-SFd',
  CALLBACK: `${url}/auth/google/callback`
}

module.exports = {
  ACCOUNT,
  SECRET,
  API_KEY,
  MAIL,
  GITHUB,
  FACEBOOK,
  TWITTER,
  GOOGLE
}
