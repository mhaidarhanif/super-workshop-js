require('dotenv-extended').load()
const server = require(process.env.SERVER_DIR + 'server')

const chai = require('chai')
const chaiHTTP = require('chai-http')
const expect = chai.expect
chai.use(chaiHTTP)

// -----------------------------------------------------------------------------

const faker = require('faker')
const Chance = require('chance')
const chance = new Chance()

const a = {}
a.first = faker.name.firstName()
a.last = faker.name.lastName()
a.name = `${a.first} ${a.last}`
a.username = a.first.toLowerCase()
a.email = `${a.username.toLowerCase()}@${a.last.toLowerCase()}.com`
a.password = faker.internet.password()
a.birthDate = chance.birthday({type: 'adult'})
a.image = faker.image.imageUrl()
a.roles = 'user'

// console.log(a)

// -----------------------------------------------------------------------------

describe('auth', () => {
  // ---------------------------------------------------------------------------

  describe('root', () => {
    before(() => {
      chai.request(server).get('/auth').then(response => { res = response })
    })

    it('execute request', (done) => {
      setTimeout(() => done(), 1)
    })

    it('expect json object that contains specific keys', (done) => {
      expect(res.body).to.be.an('object')
      expect(res.body).to.have.all.keys('id', 'm', 'i', 'endpoints')
      done()
    })

    it('expect info about auth', (done) => {
      expect(res.body).to.have.property('id', 'auth')
      expect(res.body).to.have.property('m').to.include('endpoints')
      expect(res.body.i).to.have.property('id').to.include('user')
      expect(res.body.i).to.have.property('m').to.include('token')
      done()
    })

    it('expect info about Auth endpoints', (done) => {
      expect(res.body.endpoints).to.have.property('/signup').to.include('up')
      expect(res.body.endpoints).to.have.property('/signin').to.include('in')
      expect(res.body.endpoints).to.have.property('/signout').to.include('out')
      expect(res.body.endpoints).to.have.property('/is-with-token').to.include('token')
      expect(res.body.endpoints).to.have.property('/is-account-exist').to.include('exist')
      expect(res.body.endpoints).to.have.property('/is-authenticated').to.include('authenticated')
      expect(res.body.endpoints).to.have.property('/is-admin').to.include('admin')
      done()
    })
  })

  // ---------------------------------------------------------------------------

  describe('sign up', () => {
    // -------------------------------------------------------------------------

    describe('with no data', () => {
      let res

      before(() => {
        chai.request(server).post('/auth/signup')
        .then(r => res = r)
        .catch(err => res = err)
      })

      it('execute request', (done) => {
        setTimeout(() => done(), 1)
      })

      it('expect json object that contains specific keys', (done) => {
        expect(res.status).to.equal(400)
        expect(res.response.body).to.be.an('object')
        expect(res.response.body).to.have.all.keys('id', 'm')
        done()
      })

      it('expect failure info', (done) => {
        expect(res.response.body).to.have.property('id').to.include('fail')
        expect(res.response.body).to.have.property('m').to.include('sign up')
        done()
      })
    })

    // -------------------------------------------------------------------------

    describe('with a new account data', () => {
      let res

      it('execute request', (done) => {
        chai.request(server).post('/auth/signup').send(a)
        .then(r => {
          res = r
          done()
        })
        .catch(err => {
          res = err
        })
      })

      it('expect json object that contains specific keys', (done) => {
        console.log('[i] account:', res.body)
        expect(res.status).to.equal(201)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.all.keys('id', 'm', 'name', 'email', 'username', 'password', 'roles')
        done()
      })

      it('expect success info', (done) => {
        expect(res.body).to.have.property('id').to.include('success')
        expect(res.body).to.have.property('m').to.include('signed up')
        expect(res.body).to.have.property('name').to.equal(a.name)
        expect(res.body).to.have.property('email').to.equal(a.email)
        expect(res.body).to.have.property('username').to.equal(a.username)
        // expect(res.body).to.have.property('roles').to.equal(a.roles)
        expect(res.body).to.have.property('password').to.include('ENCRYPT')
        done()
      })
    })

    // -------------------------------------------------------------------------

    describe.skip('with an existed account data', () => {
      before(() => {
        chai.request(server).post('/auth/signup')
        .then(response => { res = response })
        .catch(err => { res = err })
      })

      it('execute request', (done) => {
        setTimeout(() => done(), 1)
      })

      it('expect json object that contains specific keys', (done) => {
        expect(res.response.body).to.be.an('object')
        expect(res.response.body).to.have.all.keys('id', 'm')
        done()
      })

      it('expect failure info', (done) => {
        expect(res.status).to.equal(400)
        expect(res.response.body).to.have.property('id').to.include('fail')
        expect(res.response.body).to.have.property('m').to.include('sign up')
        done()
      })
    })
  })
})
