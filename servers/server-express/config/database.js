const connection = require('./connection')

const DATABASE_NAME = ''
const NEDB_PATH = './data' + DATABASE_NAME
const MONGODB_URI = 'mongodb://' + connection.HOST + '/' + DATABASE_NAME

module.exports = {
  NEDB_PATH,
  MONGODB_URI
}
