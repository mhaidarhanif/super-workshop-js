const server = require('./server')

const env = process.env
const app_name = process.env.NAME
const node_env = process.env.NODE_ENV
const url = process.env.URL
const host = process.env.HOST || 'localhost'
const port = process.env.PORT || '3000'

server.listen(port, host, (err) => {
  if (err) console.log(err)
  console.log(`[i] ${app_name} is running on ${url}
    NODE_ENV: ${node_env}`)
  // console.log(env)
})
