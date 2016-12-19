// PASSPORT
const GitHubStrategy = require('passport-github').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const TwitterStrategy = require('passport-twitter').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
// const JwtStrategy = require('passport-jwt').Strategy
// const ExtractJwt = require('passport-jwt').ExtractJwt
const providers = require('./providers.schema')

// -----------------------------------------------------------------------------
// CONFIGURE PASSPORT
// -----------------------------------------------------------------------------

module.exports = (passport) => {
  // ---------------------------------------------------------------------------
  // GITHUB
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK,
    passReqToCallback: true
  },
  providers.github))

  // ---------------------------------------------------------------------------
  // FACEBOOK
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: process.env.FACEBOOK_SCOPE,
    passReqToCallback: true
  },
  providers.facebook))

  // ---------------------------------------------------------------------------
  // TWITTER
  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_API_KEY,
    consumerSecret: process.env.TWITTER_API_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK,
    passReqToCallback: true
  },
  providers.twitter))

  // ---------------------------------------------------------------------------
  // GOOGLE
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK,
    passReqToCallback: true
  },
  providers.google))
}
