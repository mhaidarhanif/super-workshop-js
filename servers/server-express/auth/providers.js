const GitHubStrategy = require('passport-github').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const TwitterStrategy = require('passport-twitter').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
// const JwtStrategy = require('passport-jwt').Strategy
// const ExtractJwt = require('passport-jwt').ExtractJwt

const Account = require('../api/accounts/model')

// -----------------------------------------------------------------------------

const github = (req, accessToken, refreshToken, profile, done) => {
  if (profile) {
    Account.findOneAndUpdate({
      username: req.decoded.username
    }, {
      // username: profile.username,
      image: profile.photos[0].value,
      provider: profile.provider,
      github: {
        id: profile.id,
        name: profile.displayName,
        username: profile.username,
        email: profile.emails[0].value
      }
    }, {
      upsert: true
    },
      done()
    )
  } else {
    done(new Error('Your email privacy settings prevent you.'), null)
  }
}

const facebook = (req, accessToken, refreshToken, profile, done) => {
  if (profile) {
    Account.findOneAndUpdate({
      username: req.decoded.username
    }, {
      // username: profile.username,
      image: profile.photos[0].value,
      provider: profile.provider,
      facebook: {
        id: profile.id,
        name: profile.displayName,
        username: profile.displayName.toLowerCase().replace(/\s+/g, ''),
        email: profile.emails[0].value
      }
    }, {
      upsert: true
    },
      done()
    )
  } else {
    done(new Error('Your email privacy settings prevent you.'), null)
  }
}

// BE AWARE, AVOID: (req, accessToken, refreshToken, profile, done)
// You cannot just assign email deliberately
// need to contain this format: profile.emails[0].value
const twitter = (req, token, tokenSecret, profile, done) => {
  if (profile) {
    Account.findOneAndUpdate({
      username: req.decoded.username
    }, {
      // username: profile.username,
      image: profile.photos[0].value,
      provider: profile.provider,
      twitter: {
        id: profile.id,
        name: profile.displayName,
        username: profile.username,
        email: profile.username + '@twitter.com'
      }
    }, {
      upsert: true
    },
      done()
    )
  } else {
    done(new Error('Profile not found.'), null)
  }
}

const google = (req, accessToken, refreshToken, profile, done) => {
  if (profile) {
    Account.findOneAndUpdate({
      username: req.decoded.username
    }, {
      // username: profile.username,
      image: profile.photos[0].value,
      provider: profile.provider,
      google: {
        id: profile.id,
        name: profile.displayName,
        username: profile.displayName,
        email: profile.emails[0].value
      }
    }, {
      upsert: true
    },
      done()
    )
  } else {
    done(new Error('Your email privacy settings prevent you.'), null)
  }
}

// -----------------------------------------------------------------------------

const providers = {
  github,
  facebook,
  twitter,
  google
}

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

