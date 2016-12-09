const connection = require('./connection')
const url = connection.URL

module.exports = {

  SECRET: {
    JWT: '',
    SESSION: ''
  },

  GITHUB: {
    CLIENT_ID: '',
    CLIENT_SECRET: '',
    CALLBACK: `${url}/auth/github/callback`
  },

  FACEBOOK: {
    APP_ID: '',
    APP_SECRET: '',
    CALLBACK: `${url}/auth/facebook/callback`
  },

  TWITTER: {
    API_KEY: '',
    API_SECRET: '',
    CALLBACK: `${url}/auth/twitter/callback`
  },

  GOOGLE: {
    CLIENT_ID: '',
    CLIENT_SECRET: '',
    CALLBACK: `${url}/auth/google/callback`
  }

}
