const server = require('./server')

const url = process.env.URL
const host = process.env.HOST || 'localhost'
const port = process.env.PORT || '3000'

console.log(process.env.MONGODB_URI)

server.listen(port, host, (err) => {
  if (err) console.log(err)
  console.log(`[i] ${process.env.NAME} is running on ${url}`)
  console.log(`[i] NODE_ENV: ${process.env.NODE_ENV}`)
  console.log(`[i] MONGODB_URI: ${process.env.MONGODB_URI}`)
})
