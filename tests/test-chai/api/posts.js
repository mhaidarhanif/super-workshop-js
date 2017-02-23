require('dotenv-extended').load()
const server = require(process.env.SERVER_DIR + 'server')

// -----------------------------------------------------------------------------

const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-http'))
chai.use(require('chai-arrays'))

// -----------------------------------------------------------------------------

const resource = `post`
const resources = `${resource}s`
const endpoint = `/api/${resources}`

// -----------------------------------------------------------------------------

const faker = require('faker')
const Chance = require('chance')
const chance = new Chance()

const newData = {
  title: faker.lorem.sentence(),
  content: faker.lorem.paragraph()
}

// -----------------------------------------------------------------------------

describe('posts', () => {
  let token = ''
  let decoded = {}

  describe('AUTH', () => {
    describe('get an auth token first', () => {
      it('expect to have a response token', (done) => {
        chai.request(server).post(`/auth/signin`)
          .send({
            username: 'admin',
            password: 'adminadmin'
          })
          .then(res => {
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.all.keys('token')
            token = res.body.token
            done()
          })
          .catch(err => {
            done(err)
          })
      })
    })

    describe('get a decoded token payload', () => {
      it('expect to have a profile', (done) => {
        chai.request(server).post(`/auth/is-authenticated`)
          .set('Authorization', `Bearer ${token}`)
          .then(res => {
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.all.keys('decoded')
            expect(res.body).to.have.deep.property('decoded.sub')
            expect(res.body).to.have.deep.property('decoded.m')
            decoded = res.body.decoded
            done()
          })
          .catch(err => {
            done(err)
          })
      })
    })
  })

  // -------------------------------------------------------------------------
  describe.skip('SEED', () => {
    // -------------------------------------------------------------------------
    describe('some posts', () => {
      it('expect to seed some posts', (done) => {
        chai.request(server).post(`${endpoint}/actions/seed`)
          .set('X-API-Key', process.env.API_KEY_SETUP)
          .then(res => {
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.all.keys('posts')
            expect(res.body).to.have.deep.property('posts.id').to.include('success')
            expect(res.body).to.have.deep.property('posts.m').to.include('posts')
            done()
          })
          .catch(err => {
            done(err)
          })
      })
    })
  })

  // -------------------------------------------------------------------------
  describe('POST', () => {
    // -------------------------------------------------------------------------
    describe('a post', () => {
      let res

      it(`execute POST request to ${endpoint}`, (done) => {
        chai.request(server).post(`${endpoint}`)
          .set('Authorization', `Bearer ${token}`)
          .send(newData)
          .then(response => { res = response; done() })
          .catch(err => { res = err; done(err) })
      })

      it('expect to have a response with specific properties', (done) => {
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

      it(`expect the created ${resource} to be the same with input`, (done) => {
        expect(res.body.title).to.be.equal(newData.title)
        expect(res.body.content).to.be.equal(newData.content)
        expect(res.body.status).to.be.equal('draft')
        expect(res.body.createdBy[0]).to.be.equal(decoded.sub)
        done()
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
  describe('DELETE', () => {
    // -------------------------------------------------------------------------
    describe('all posts', () => {
      it('expect all posts to be empty after deleted', (done) => {
        chai.request(server).delete(`${endpoint}/actions/delete`)
          .set('X-API-Key', process.env.API_KEY_SETUP)
          .then(res => {
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
