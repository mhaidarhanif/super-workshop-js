const DATABASE_NAME = 'super_workshop'

// -----------------------------------------------------------------------------
// NEDB
// -----------------------------------------------------------------------------

const NEDB_PATH = './data/' + DATABASE_NAME

// -----------------------------------------------------------------------------
// MONGODB
// -----------------------------------------------------------------------------

const MONGODB_PROTOCOL = process.env.MONGODB_PROTOCOL || 'mongodb'
const MONGODB_HOST = process.env.MONGODB_HOST || 'localhost'
const MONGODB_PORT = process.env.MONGODB_PORT || '27017'
const MONGODB_DATABASE = process.env.DATABASE_NAME || DATABASE_NAME
const MONGODB_USER = process.env.MONGODB_USER || ''
const MONGODB_PASS = process.env.MONGODB_PASS || ''
const MONGODB_ATLAS_KEY = `change_this`

let MONGODB_URI = ''
if (MONGODB_USER === '') {
  MONGODB_URI = process.env.MONGODB_URI || `${MONGODB_PROTOCOL}://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}`
} else if (MONGODB_USER !== '') {
  MONGODB_URI = process.env.MONGODB_URI || `${MONGODB_PROTOCOL}://${MONGODB_USER}:${MONGODB_PASS}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}`
}

// -----------------------------------------------------------------------------
// MYSQL/MARIADB
// -----------------------------------------------------------------------------

const MYSQL_PROTOCOL = process.env.MYSQL_PROTOCOL || 'mysql'
const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost'
const MYSQL_PORT = process.env.MYSQL_PORT || '3306'
const MYSQL_DATABASE = process.env.DATABASE_NAME || DATABASE_NAME
const MYSQL_USER = process.env.MYSQL_USER || ''
const MYSQL_PASS = process.env.MYSQL_PASS || ''

let MYSQL_URI = ''
if (MYSQL_USER === '') {
  MYSQL_URI = process.env.MYSQL_URI || `${MYSQL_PROTOCOL}://${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DATABASE}`
} else if (MYSQL_USER !== '') {
  MYSQL_URI = process.env.MYSQL_URI || `${MYSQL_PROTOCOL}://${MYSQL_USER}:${MYSQL_PASS}@${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DATABASE}`
}

// -----------------------------------------------------------------------------
// POSTGRESQL
// -----------------------------------------------------------------------------

const POSTGRES_PROTOCOL = process.env.POSTGRES_PROTOCOL || 'postgres'
const POSTGRES_HOST = process.env.POSTGRES_HOST || 'localhost'
const POSTGRES_PORT = process.env.POSTGRES_PORT || '5432'
const POSTGRES_DATABASE = process.env.DATABASE_NAME || DATABASE_NAME
const POSTGRES_USER = process.env.POSTGRES_USER || ''
const POSTGRES_PASS = process.env.POSTGRES_PASS || ''

let POSTGRES_URI = ''
if (POSTGRES_USER === '') {
  POSTGRES_URI = process.env.POSTGRES_URI || `${POSTGRES_PROTOCOL}://${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DATABASE}`
} else if (POSTGRES_USER !== '') {
  POSTGRES_URI = process.env.POSTGRES_URI || `${POSTGRES_PROTOCOL}://${POSTGRES_USER}:${POSTGRES_PASS}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DATABASE}`
}

// -----------------------------------------------------------------------------
// REDIS
// -----------------------------------------------------------------------------

const REDIS_PROTOCOL = process.env.REDIS_PROTOCOL || 'redis'
const REDIS_HOST = process.env.REDIS_HOST || 'localhost'
const REDIS_PORT = process.env.REDIS_PORT || '6379'
const REDIS_DATABASE = process.env.DATABASE_NAME || DATABASE_NAME
const REDIS_USER = process.env.REDIS_USER || ''
const REDIS_PASS = process.env.REDIS_PASS || ''

let REDIS_URI = ''
if (REDIS_USER === '') {
  REDIS_URI = process.env.REDIS_URI || `${REDIS_PROTOCOL}://${REDIS_HOST}:${REDIS_PORT}/${REDIS_DATABASE}`
} else if (REDIS_USER !== '') {
  REDIS_URI = process.env.REDIS_URI || `${REDIS_PROTOCOL}://${REDIS_USER}:${REDIS_PASS}@${REDIS_HOST}:${REDIS_PORT}/${REDIS_DATABASE}`
}

// -----------------------------------------------------------------------------

module.exports = {
  NEDB_PATH,
  MONGODB_URI,
  MYSQL_URI,
  POSTGRES_URI,
  REDIS_URI
}
