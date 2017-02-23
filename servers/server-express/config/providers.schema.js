const Account = require('../api/accounts/model')

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

module.exports = {
  github,
  facebook,
  twitter,
  google
}
