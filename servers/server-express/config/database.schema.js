const DATABASE_NAME = 'super-workshop-js'

const NEDB_PATH = './data/' + DATABASE_NAME

const MONGODB_HOST = process.env.MONGO_HOST || 'localhost'
const MONGODB_PORT = process.env.MONGO_PORT || '27017'
const MONGODB_DATABASE = process.env.DATABASE_NAME || DATABASE_NAME
const MONGODB_USER = process.env.MONGO_USER || ''
const MONGODB_PASS = process.env.MONGO_PASS || ''

let MONGODB_URI = ''

if (MONGODB_USER === '') {
  MONGODB_URI = process.env.MONGO_URI || `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}`
} else if (MONGODB_USER !== '') {
  MONGODB_URI = process.env.MONGO_URI || `mongodb://${MONGODB_USER}:${MONGODB_PASS}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}`
}

module.exports = {
  NEDB_PATH,
  MONGODB_URI
}
