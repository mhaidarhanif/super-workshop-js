require('dotenv-extended').load()
const server = require(process.env.SERVER_DIR + 'server')
const accountsController = require(process.env.SERVER_DIR + 'api/accounts/controller')

const chai = require('chai')
const chaiHTTP = require('chai-http')
const expect = chai.expect
chai.use(chaiHTTP)

// -----------------------------------------------------------------------------

const faker = require('faker')
const Chance = require('chance')
const chance = new Chance()

const account = {}
account.first = faker.name.firstName()
account.last = faker.name.lastName()
account.name = `${account.first} ${account.last}`
account.username = account.first.toLowerCase()
account.email = `${account.username.toLowerCase()}@${account.last.toLowerCase()}.com`
account.password = faker.internet.password()
account.birthDate = chance.birthday({type: 'adult'})
account.image = faker.image.imageUrl()
account.roles = 'user'

// console.log(account)

// -----------------------------------------------------------------------------

describe('auth', () => {
  // ---------------------------------------------------------------------------

  describe.skip('clear data', () => {
    it('execute delete accounts', (done) => {
      accountsController.deleteAccounts()
      done()
    })
  })

  // ---------------------------------------------------------------------------

  describe('root', () => {
    it('execute request', (done) => {
      chai.request(server).get('/auth')
      .then(response => { res = response; done() })
      .catch(err => { res = err })
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
      before(() => {
        chai.request(server).post('/auth/signup')
        .send({})
        .then(response => res = response)
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
      it('execute request', (done) => {
        chai.request(server).post('/auth/signup').send(account)
        .then(response => { res = response; done() })
        .catch(err => { done(err) })
      })

      it('expect json object that contains specific keys', (done) => {
        // console.log('[i] account:', res.body)
        expect(res.status).to.equal(201)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.all.keys('id', 'm', 'name', 'email', 'username', 'password', 'roles')
        done()
      })

      it('expect success info', (done) => {
        expect(res.body).to.have.property('id').to.include('success')
        expect(res.body).to.have.property('m').to.include('signed up')
        expect(res.body).to.have.property('name').to.equal(account.name)
        expect(res.body).to.have.property('email').to.equal(account.email)
        expect(res.body).to.have.property('username').to.equal(account.username)
        // expect(res.body).to.have.property('roles').to.equal(account.roles)
        expect(res.body).to.have.property('password').to.include('ENCRYPT')
        done()
      })
    })

    // -------------------------------------------------------------------------

    describe('with an existed account data', () => {
      // this will not reach the actual signup
      // since there is an auth.isAccountExist middleware

      before(() => {
        chai.request(server).post('/auth/signup').send(account)
        .then(response => res = response)
        .catch(err => res = err)
      })

      it('execute request', (done) => {
        setTimeout(() => done(), 10)
      })

      it('expect json object that contains specific keys', (done) => {
        expect(res.response.body).to.be.an('object')
        expect(res.response.body).to.have.all.keys('id', 'm')
        done()
      })

      it('expect failure info', (done) => {
        expect(res.status).to.equal(400)
        expect(res.response.body).to.have.property('id').to.include('exist')
        expect(res.response.body).to.have.property('m').to.include('exist')
        done()
      })
    })
  })

  // ---------------------------------------------------------------------------
  describe('sign in', () => {
    // -------------------------------------------------------------------------

    describe('with no username and password', () => {
      before(() => {
        chai.request(server).post('/auth/signin')
        .then(response => res = response)
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
        expect(res.response.body).to.have.property('id').to.include('no_username_password')
        expect(res.response.body).to.have.property('m').to.include('failed')
        done()
      })
    })
  })
})
