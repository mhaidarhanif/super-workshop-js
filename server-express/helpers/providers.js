const Account = require('../models/account')

/*
TODO: Combine together account info that has the same email and provider id
*/

const github = function (req, accessToken, refreshToken, profile, done) {
  if (profile) {
    Account.findOneAndUpdate({
      $and: [
        { email: profile.emails[0].value },
        { provider: profile.provider }
      ]
    }, {
      // account.github.id: profile.id
      name: profile.displayName,
      username: profile.username,
      email: profile.emails[0].value,
      photo: profile.photos[0].value,
      provider: profile.provider
    }, {
      upsert: true
    },
      done
    )
  } else {
    done(new Error('Your email privacy settings prevent you.'), null)
  }
}

const facebook = function (req, accessToken, refreshToken, profile, done) {
  if (profile) {
    Account.findOneAndUpdate({
      $and: [
        { email: profile.emails[0].value },
        { provider: profile.provider }
      ]
    }, {
      // account.facebook.id: profile.id,
      name: profile.displayName,
      username: profile.displayName.toLowerCase().replace(/\s+/g, ''),
      email: profile.emails[0].value,
      photo: profile.photos[0].value,
      provider: profile.provider
    }, {
      upsert: true
    },
      done
    )
  } else {
    done(new Error('Your email privacy settings prevent you.'), null)
  }
}

// BE AWARE, AVOID: (req, accessToken, refreshToken, profile, done)
// You cannot just assign email deliberately
// need to contain this format: profile.emails[0].value
// TODO: use passport-twitter-email
const twitter = function (req, token, tokenSecret, profile, done) {
  if (profile) {
    Account.findOneAndUpdate({
      $and: [
        { email: profile.username + '@twitter.com' },
        { provider: profile.provider }
      ]
    }, {
      // account.twitter.id: profile.id,
      name: profile.displayName,
      username: profile.username,
      email: profile.username + '@twitter.com',
      photo: profile.photos[0].value,
      provider: profile.provider
    }, {
      upsert: true
    },
      done
    )
  } else {
    done(new Error('Profile not found.'), null)
  }
}

const google = function (req, accessToken, refreshToken, profile, done) {
  if (profile) {
    Account.findOneAndUpdate({
      $and: [
        { email: profile.emails[0].value },
        { provider: profile.provider }
      ]
    }, {
      // account.google.id: profile.id,
      name: profile.displayName,
      username: profile.displayName,
      email: profile.emails[0].value,
      photo: profile.photos[0].value,
      provider: profile.provider
    }, {
      upsert: true
    },
      done
    )
  } else {
    done(new Error('Your email privacy settings prevent you.'), null)
  }
}

module.exports = {
  github: github,
  facebook: facebook,
  twitter: twitter,
  google: google
}
