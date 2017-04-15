const reqip = require('request-ip')

module.exports = {

  // ---------------------------------------------------------------------------
  // PUBLIC
  // ---------------------------------------------------------------------------

  /*
   * Home
   */
  home: (req, res) => {
    res.send({
      id: 'root',
      m: `You might want to check ${req.protocol}://${req.get('host')}/api instead.`,
      name: process.env.NAME,
      url: `${req.protocol}://${req.get('host')}`
    })
  },

  /*
   * API
   */
  api: (req, res) => {
    res.send({
      id: 'api',
      name: process.env.NAME,
      description: `Welcome to the API that run with ${process.env.NAME}! This a quick help for you to consume the API.`,
      documentation: 'https://github.com/mhaidarh/super-workshop-js#readme',
      endpoints: {
        '/auth': 'Authentication',
        '/api/accounts': 'Accounts collection',
        '/api/books': 'Books collection',
        '/api/posts': 'Posts collection'
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
    res.send({
      id: 'ping_pong',
      m: `ping from ${reqip.getClientIp(req)}`
    })
  }

}
