require('dotenv-extended').load()
const server = require(process.env.SERVER_DIR + 'server')

const chai = require('chai')
const chaiHTTP = require('chai-http')
const expect = chai.expect
chai.use(chaiHTTP)

// -----------------------------------------------------------------------------

describe.skip('posts', () => {
  // -------------------------------------------------------------------------
  describe('seed', () => {
    // -------------------------------------------------------------------------
    describe('some posts', () => {
      it('expect to seed', (done) => {
        chai.request(server).post('/api/posts/actions/seed')
          .set('X-API-Key', process.env.API_KEY_SETUP)
          .then(res => {
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.all.keys('posts')
            expect(res.body).to.have.deep.property('posts.id').to.include('success')
            expect(res.body).to.have.deep.property('posts.m').to.include('some')
            done()
          })
          .catch(err => {
            done(err)
          })
      })
    })
  })
  // -------------------------------------------------------------------------
  describe('get', () => {
    // -------------------------------------------------------------------------
    describe('some posts', () => {
      it('expect json object that contains specific keys', (done) => {
        chai.request(server).get('/api/posts')
          .set('X-API-Key', process.env.API_KEY_SETUP)
          .then(res => {
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.all.keys('posts')
            expect(res.body).to.have.deep.property('posts.id').to.include('success')
            expect(res.body).to.have.deep.property('posts.m').to.include('some')
            done()
          })
          .catch(err => {
            done(err)
          })
      })
    })

    // -------------------------------------------------------------------------
    describe('a post', () => {
      it('expect json object that contains specific keys', (done) => {
        chai.request(server).get('/api/posts/1')
          .set('X-API-Key', process.env.API_KEY_SETUP)
          .then(res => {
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.all.keys('posts')
            expect(res.body).to.have.deep.property('posts.id').to.include('success')
            expect(res.body).to.have.deep.property('posts.m').to.include('some')
            done()
          })
          .catch(err => {
            done(err)
          })
      })
    })
  })
})
