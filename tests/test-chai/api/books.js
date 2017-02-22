require('dotenv-extended').load()
const server = require(process.env.SERVER_DIR + 'server')

// -----------------------------------------------------------------------------

const chai = require('chai')
const chaiHTTP = require('chai-http')
const chaiArrays = require('chai-arrays')
const expect = chai.expect

chai.use(chaiArrays)
chai.use(chaiHTTP)

// -----------------------------------------------------------------------------

const resource = `book`
const resources = `${resource}s`
const endpoint = `/api/${resources}`

// -----------------------------------------------------------------------------

describe('books', () => {
  // -------------------------------------------------------------------------
  describe('seed', () => {
    // -------------------------------------------------------------------------
    describe('a book', () => {
      it('expect to seed', (done) => {
        chai.request(server).post(`${endpoint}/actions/seed`)
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

    // -------------------------------------------------------------------------
    describe('a lot of books', () => {
      it('expect to seed', (done) => {
        chai.request(server).post(`${endpoint}/actions/seed-lot`)
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
