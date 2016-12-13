const meta = require('./package.json')
const connection = require('./config/connection')
const database = require('./config/database')
const credential = require('./config/credential')

module.exports = {

  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration
   */
  apps: [
    {
      name: meta.name,
      script: meta.main,
      node_args: '--harmony',
      watch: [meta.name, 'server.js', 'api'],
      ignore_watch: ['node_modules'],
      watch_options: {
        followSymlinks: false
      },
      env: {
        COMMON_VARIABLE: 'true',
        NAME: meta.name,
        HOST: connection.HOST,
        PORT: connection.PORT,
        URL: connection.URL,
        NEDB_PATH: database.NEDB_PATH,
        MONGODB_URI: database.MONGODB_URI,
        JWT_SECRET: credential.SECRET.JWT,
        SESSION_SECRET: credential.SECRET.SESSION,
        API_KEY_DEV: credential.API_KEY.DEV,
        API_KEY_TEST: credential.API_KEY.TEST,
        API_KEY_STAGING: credential.API_KEY.STAGING,
        API_KEY_PRODUCTION: credential.API_KEY.PRODUCTION,
        GITHUB_CLIENT_ID: credential.GITHUB.CLIENT_ID,
        GITHUB_CLIENT_SECRET: credential.GITHUB.CLIENT_SECRET,
        GITHUB_CALLBACK: credential.GITHUB.CALLBACK,
        FACEBOOK_APP_ID: credential.FACEBOOK.APP_ID,
        FACEBOOK_APP_SECRET: credential.FACEBOOK.APP_SECRET,
        FACEBOOK_CALLBACK: credential.FACEBOOK.CALLBACK,
        TWITTER_API_KEY: credential.TWITTER.API_KEY,
        TWITTER_API_SECRET: credential.TWITTER.API_SECRET,
        TWITTER_CALLBACK: credential.TWITTER.CALLBACK,
        GOOGLE_CLIENT_ID: credential.GOOGLE.CLIENT_ID,
        GOOGLE_CLIENT_SECRET: credential.GOOGLE.CLIENT_SECRET,
        GOOGLE_CALLBACK: credential.GOOGLE.CALLBACK
      },
      env_dev: {
        NODE_ENV: 'dev'
      },
      env_staging: {
        NODE_ENV: 'staging'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment
   */
  deploy: {
    dev: {
      user: 'node',
      host: '0.0.0.0',
      ref: 'origin/master',
      repo: meta.repository.url,
      path: '~/www/super-workshop-js/dev',
      'post-deploy': 'cd servers/server-express && npm install && pm2 startOrRestart ecosystem.js --env dev',
      env: {
        NODE_ENV: 'dev'
      }
    },
    staging: {
      user: 'node',
      host: '0.0.0.0',
      ref: 'origin/master',
      repo: meta.repository.url,
      path: '~/www/super-workshop-js/staging',
      'post-deploy': 'cd servers/server-express && npm install && pm2 startOrRestart ecosystem.js --env staging',
      env: {
        NODE_ENV: 'dev'
      }
    },
    production: {
      user: 'node',
      host: '0.0.0.0',
      ref: 'origin/master',
      repo: meta.repository.url,
      path: '~/www/super-workshop-js/production',
      'post-deploy': 'cd servers/server-express && npm install && pm2 startOrRestart ecosystem.js --env production',
      env: {
        NODE_ENV: 'production'
      }
    }
  }

}
