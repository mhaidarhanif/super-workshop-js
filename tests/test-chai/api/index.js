require('dotenv-extended').load()
const server = require(process.env.SERVER_DIR + 'server')

const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-http'))

// -----------------------------------------------------------------------------

describe('server-express', function () {
  let res

  // ---------------------------------------------------------------------------
  describe('setup', () => {
    it('expect ok to load', (done) => {
      expect(server).to.be.ok
      done()
    })
  })

  // ---------------------------------------------------------------------------
  describe('root', () => {
    it('expect json object that contains specific keys', (done) => {
      chai.request(server).get('/').then(res => {
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.all.keys('id', 'name', 'm', 'url')
        done()
      })
    })
  })

  // ---------------------------------------------------------------------------
  describe('ping', () => {
    before(() => {
      chai.request(server).get('/ping').then(response => { res = response })
    })

    it('execute request', (done) => {
      done()
    })

    it('expect json object that contains specific keys', (done) => {
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.all.keys('id', 'm')
      done()
    })

    it('expect info about ping', (done) => {
      expect(res.body).to.have.property('id', 'ping_pong')
      expect(res.body).to.have.property('m').to.include('ping')
      done()
    })
  })

  // ---------------------------------------------------------------------------
  describe('api', function () {
    before(() => {
      chai.request(server).get('/api').then(response => { res = response })
    })

    it('execute request', (done) => {
      done()
    })

    it('expect json object that contains specific keys', (done) => {
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.all.keys('id', 'name', 'description', 'documentation', 'endpoints', 'codes')
      done()
    })

    it('expect info about api', (done) => {
      expect(res.body).to.have.property('id', 'api')
      expect(res.body).to.have.property('name', process.env.NAME)
      done()
    })

    it('expect  info about API endpoints', (done) => {
      // console.log(res.body.endpoints)
      expect(res.body.endpoints).to.have.property('/auth').to.include('Authentication')
      expect(res.body.endpoints).to.have.property('/api/accounts').to.include('Accounts')
      expect(res.body.endpoints).to.have.property('/api/books').to.include('Books')
      done()
    })

    it('expect give info about API endpoints', (done) => {
      expect(res.body.codes).to.have.property('d').to.include('data')
      expect(res.body.codes).to.have.property('e').to.include('error')
      expect(res.body.codes).to.have.property('i').to.include('info')
      expect(res.body.codes).to.have.property('id').to.include('type')
      expect(res.body.codes).to.have.property('m').to.include('developer')
      expect(res.body.codes).to.have.property('s').to.include('success')
      done()
    })
  })
})
