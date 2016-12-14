require('dotenv-extended').load()
const server = require(process.env.SERVER_DIR + 'server')

const chai = require('chai')
const chaiHTTP = require('chai-http')
const expect = chai.expect
chai.use(chaiHTTP)

// -----------------------------------------------------------------------------

var res
const data = {
  'name': 'New',
  'email': 'new@new.com',
  'username': 'new',
  'password': 'newnewnew'
}

// -----------------------------------------------------------------------------

describe('auth', () => {
  describe('setup', () => {
    it('expect ok to load', (done) => {
      expect(server).to.be.ok
      done()
    })

    it('expect accounts collection is emptied first', (done) => {
      chai.request(server).delete('/api/accounts/actions/empty')
      .set('X-API-Key', process.env.API_KEY_TEST)
      .then(response => done())
      .catch(err => { done(err) })
    })
  })

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

    // -------------------------------------------------------------------------

    describe.skip('with a new account data', () => {
      before(() => {
        chai.request(server).post('/auth/signup').send(data)
        .then(response => { res = response })
        .catch(err => { res = err })
      })

      it('execute request', (done) => {
        setTimeout(() => done(), 1)
      })

      it('expect json object that contains specific keys', (done) => {
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.all.keys('id', 'm', 'name', 'email', 'username', 'password')
        done()
      })

      it('expect success info', (done) => {
        expect(res.status).to.equal(201)
        expect(res.body).to.have.property('id').to.include('success')
        expect(res.body).to.have.property('m').to.include('signed up')
        expect(res.body).to.have.property('name').to.equal(data.name)
        expect(res.body).to.have.property('email').to.equal(data.email)
        expect(res.body).to.have.property('username').to.equal(data.username)
        expect(res.body).to.have.property('password').to.include('encrypt')
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
