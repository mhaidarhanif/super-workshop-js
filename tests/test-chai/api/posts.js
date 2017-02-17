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

const resource = `post`
const resources = `${resource}s`
const endpoint = `/api/${resources}`

// -----------------------------------------------------------------------------

describe.only('posts', () => {
  // -------------------------------------------------------------------------
  describe('SEED', () => {
    // -------------------------------------------------------------------------
    describe('some posts', () => {
      it('expect to seed some posts', (done) => {
        chai.request(server).post(`${endpoint}/actions/seed`)
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
  describe.skip('POST', () => {
    let res
    // -------------------------------------------------------------------------
    describe('a post', () => {
      it('execute request', (done) => {
        chai.request(server).post(`${endpoint}`)
          .set({
            title: 'Hello World',
            content: 'Hello people of the world'
          })
          .then(response => {
            res = response
            done()
          })
          .catch(err => {
            done(err)
          })
      })

      it('expect to post a post', (done) => {
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property('_id')
        expect(res.body).to.have.property('id')
        expect(res.body).to.have.property('title')
        expect(res.body).to.have.property('content')
        expect(res.body).to.have.property('status')
        expect(res.body).to.have.property('createdBy')
        expect(res.body).to.have.property('updatedBy')
        expect(res.body).to.have.property('createdAt')
        expect(res.body).to.have.property('updatedAt')
      })

      it('expect the newly created post to be exact', (done) => {

      })
    })
  })

  // -------------------------------------------------------------------------
  describe('GET', () => {
    // -------------------------------------------------------------------------
    describe('some posts', () => {
      it('expect some posts contain specific keys', (done) => {
        chai.request(server).get(`${endpoint}`)
          .then(res => {
            expect(res.body).to.be.an('array')
            expect(res.body[0]).to.have.property('id')
            expect(res.body[0]).to.have.property('title')
            expect(res.body[0]).to.have.property('content')
            done()
          })
          .catch(err => {
            done(err)
          })
      })
      it('expect some posts have a specific length', (done) => {
        chai.request(server).get(`${endpoint}`)
          .then(res => {
            expect(res.body).to.be.an('array')
            expect(res.body).to.have.length.below(11)
            done()
          })
          .catch(err => {
            done(err)
          })
      })
    })

    // -------------------------------------------------------------------------
    describe('all posts', () => {
      it('expect all posts contains specific keys', (done) => {
        chai.request(server).get(`${endpoint}/all`)
          .then(res => {
            expect(res.body).to.be.an('array')
            expect(res.body[0]).to.have.property('id')
            expect(res.body[0]).to.have.property('title')
            expect(res.body[0]).to.have.property('content')
            done()
          })
          .catch(err => {
            done(err)
          })
      })
    })

    // -------------------------------------------------------------------------
    describe('a post', () => {
      it('expect a post contains specific keys', (done) => {
        chai.request(server).get(`${endpoint}`)
          .then(res => {
            chai.request(server).get(`${endpoint}/${res.body[0].id}`)
              .then(res => {
                expect(res.body).to.be.an('object')
                expect(res.body).to.have.property('_id')
                expect(res.body).to.have.property('id')
                expect(res.body).to.have.property('title')
                expect(res.body).to.have.property('content')
                expect(res.body).to.have.property('status')
                expect(res.body).to.have.property('createdBy')
                expect(res.body).to.have.property('updatedBy')
                expect(res.body).to.have.property('createdAt')
                expect(res.body).to.have.property('updatedAt')
                done()
              })
              .catch(err => {
                done(err)
              })
          })
          .catch(err => {
            done(err)
          })
      })
    })
  })

  // -------------------------------------------------------------------------
  describe.skip('DELETE', () => {
    // -------------------------------------------------------------------------
    describe('all posts', () => {
      it('expect all posts to be empty after deleted', (done) => {
        chai.request(server).delete(`${endpoint}/actions/delete`)
          .set('X-API-Key', process.env.API_KEY_SETUP)
          .then(res => {
            console.log(res.body)
            expect(res.body).to.be.an('object')
            done()
          })
          .catch(err => {
            done(err)
          })
      })
    })
  })
})
