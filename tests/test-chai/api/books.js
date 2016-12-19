require('dotenv-extended').load()
const server = require(process.env.SERVER_DIR + 'server')

const chai = require('chai')
const chaiHTTP = require('chai-http')
const expect = chai.expect
chai.use(chaiHTTP)

// -----------------------------------------------------------------------------

describe('books', () => {
  let res

  // -------------------------------------------------------------------------
  describe('seed', () => {
    // -------------------------------------------------------------------------
    describe('some books', () => {
      it('expect to seed', (done) => {
        chai.request(server).post('/api/books/actions/seed')
        .set('X-API-Key', process.env.API_KEY_SETUP)
        .then(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.all.keys('books')
          expect(res.body).to.have.deep.property('books.id').to.include('success')
          expect(res.body).to.have.deep.property('books.m').to.include('some')
          done()
        })
        .catch(err => { done(err) })
      })
    })
  })
})
