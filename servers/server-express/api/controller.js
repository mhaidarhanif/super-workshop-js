const reqip = require('request-ip')

module.exports = {

  // ---------------------------------------------------------------------------
  // PUBLIC
  // ---------------------------------------------------------------------------

  /*
   * Home
   */
  home: (req, res) => {
    res.json({
      id: 'home',
      m: `You might want to check ${process.env.HOST}:${process.env.PORT}/api instead.`
    })
  },

  /*
   * API
   */
  api: (req, res) => {
    res.json({
      name: 'Super Workshop JS',
      description: `Welcome to the API that run with ${process.env.NAME}! This a quick help for you to consume the API.`,
      documentation: 'https://github.com/mhaidarh/super-workshop-js#readme',
      endpoints: {
        auth: '/auth',
        accounts: '/api/accounts',
        books: '/api/books'
      },
      codes: {
        d: 'd indicates previous data that might already removed.',
        e: 'e indicates an error explanation.',
        i: 'i indicates an info or warning.',
        id: 'id indicates an info and error type.',
        m: 'm indicates a readable messsage from the API developer.',
        s: 's indicates a success flag, whether true or false.'
      }
    })
  },

  /*
   * Ping
   */
  ping: (req, res) => {
    console.log(`ping from ${reqip.getClientIp(req)}`)
    res.json({
      id: 'ping_pong',
      m: `ping from ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}`
    })
  }

}
