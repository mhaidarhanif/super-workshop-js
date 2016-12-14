require('dotenv-extended').load()
const server = require(process.env.SERVER_DIR + 'server')

const chai = require('chai')
const chaiHTTP = require('chai-http')
const expect = chai.expect
chai.use(chaiHTTP)

// -----------------------------------------------------------------------------

describe('accounts', () => {
  var res

  // ---------------------------------------------------------------------------

  describe('setup', () => {
    it('expect ok to load', (done) => {
      expect(server).to.be.ok
      done()
    })

    it('expect accounts collection is emptied first', (done) => {
      chai.request(server).delete('/api/accounts/actions/empty')
      .set('X-API-Key', process.env.API_KEY_TEST)
      .then(response => done())
      .catch(error => { console.error(error.response.body); done(error) })
    })
  })

  // -------------------------------------------------------------------------

  describe('seed', () => {
    // -------------------------------------------------------------------------

    describe.skip('super accounts', () => {
      it('expect to seed super', (done) => {
        chai.request(server).post('/api/accounts/actions/setup')
        .set('X-API-Key', process.env.API_KEY_SETUP)
        .then(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.all.keys('counters', 'accounts')
          expect(res.body).to.have.deep.property('counters.id').to.include('success')
          expect(res.body).to.have.deep.property('counters.m').to.include('counter')
          expect(res.body).to.have.deep.property('accounts.id').to.include('success')
          expect(res.body).to.have.deep.property('accounts.m').to.include('super')
          done()
        })
        .catch(error => {
          done(error)
        })
      })
    })
    // -------------------------------------------------------------------------
    describe.skip('normal accounts', () => {
      it('expect to seed', (done) => {
        chai.request(server).post('/api/accounts/actions/seed')
        .set('X-API-Key', process.env.API_KEY_SETUP)
        .then(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.all.keys('accounts')
          expect(res.body).to.have.deep.property('accounts.id').to.include('success')
          expect(res.body).to.have.deep.property('accounts.m').to.include('normal')
          done()
        })
        .catch(error => {
          done(error)
        })
      })
    })
  })
})
