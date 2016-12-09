const server = require('./server')

const env = process.env
const node_env = process.env.NODE_ENV
const url = process.env.URL
const host = process.env.HOST || 'localhost'
const port = process.env.PORT || '3000'

server.listen(port, host, (err) => {
  if (err) console.log(err)
  console.log(`[i] server-express is running on ${url}
    NODE_ENV: ${node_env}`)
  // console.log(env)
})
