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
      id: 'root',
      m: `You might want to check ${process.env.URL}/api instead.`,
      name: process.env.NAME,
      url: process.env.URL
    })
  },

  /*
   * API
   */
  api: (req, res) => {
    res.json({
      id: 'api',
      name: process.env.NAME,
      description: `Welcome to the API that run with ${process.env.NAME}! This a quick help for you to consume the API.`,
      documentation: 'https://github.com/mhaidarh/super-workshop-js#readme',
      endpoints: {
        '/auth': 'Authentication',
        '/api/accounts': 'Accounts collection',
        '/api/books': 'Books collection'
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
    res.json({
      id: 'ping_pong',
      m: `ping from ${reqip.getClientIp(req)}`
    })
  }

}
