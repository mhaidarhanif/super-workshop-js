const PROTOCOL = 'http://'

const HOST = {
  SERVER: process.env.HOST_SERVER || 'localhost',
  CLIENT: process.env.HOST_CLIENT || 'localhost'
}

const PORT = {
  SERVER: process.env.PORT_SERVER || 3000,
  CLIENT: process.env.PORT_CLIENT || 8000
}

const URL = {
  SERVER: `${PROTOCOL}${HOST.SERVER}:${PORT.SERVER}`,
  CLIENT: `${PROTOCOL}${HOST.CLIENT}:${PORT.CLIENT}`
}

module.exports = {
  PROTOCOL,
  HOST,
  PORT,
  URL
}
