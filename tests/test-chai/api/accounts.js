require('dotenv-extended').load()
const server = require(process.env.SERVER_DIR + 'server')

const chai = require('chai')
const chaiHTTP = require('chai-http')
const expect = chai.expect

chai.use(chaiHTTP)

// -----------------------------------------------------------------------------

describe('accounts', () => {
  // -------------------------------------------------------------------------
  describe('seed', () => {
    // -------------------------------------------------------------------------
    describe('super accounts', () => {
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
        .catch(err => { done(err) })
      })
    })

    // -------------------------------------------------------------------------
    describe('normal accounts', () => {
      it('expect to seed normal', (done) => {
        chai.request(server).post('/api/accounts/actions/seed')
        .set('X-API-Key', process.env.API_KEY_SETUP)
        .then(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.all.keys('accounts')
          expect(res.body).to.have.deep.property('accounts.id').to.include('success')
          expect(res.body).to.have.deep.property('accounts.m').to.include('normal')
          setTimeout(() => done(), 1)
        })
        .catch(error => {
          done(error)
        })
      })
    })
  })
})
