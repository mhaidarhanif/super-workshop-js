const mongoose = require('mongoose')
const R = require('ramda')
const Post = require('./model')
const seedData = require('./seed.json')
const Account = require('../accounts/model')

const model = `post`
const models = `posts`

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

// Send response when POST
const sendResponse = (res, err, data, message) => {
  if (err) {
    res.status(400).send({
      id: 'post_error',
      e: `${err}`,
      m: 'Probably a duplicated data issue. Please check the potential post data which probably the same.'
    })
  } else if (!data) res.status(304).send({ id: `${model}_data_failed`, m: message })
  else res.status(201).send(data)
}

// Send response when GET/PUT
const sendResponseNF = (res, err, data, message) => {
  if (err) {
    res.status(400).send({
      id: 'post_error',
      e: `${err}`,
      m: 'Something wrong. Try again.'
    })
  } else if (!data) res.status(404).send({ id: `${model}_data_failed`, m: message })
  else res.status(200).send(data)
}

// -----------------------------------------------------------------------------
// CONTROLLER
// -----------------------------------------------------------------------------

module.exports = {

  // ---------------------------------------------------------------------------
  // ADMINISTRATIVE
  // ---------------------------------------------------------------------------

  /* ---------------------------------------------------------------------------
   * @api {get} /actions/seed
   */
  seed: (req, res) => {
    // Drop posts collection
    mongoose.connection.db.dropCollection(`${models}`, (err, result) => {
      if (err) res.status(400).send({ id: `${models}_drop_error`, e: `${err}` })
      console.log(`[x] Dropped collection: ${models}`)

      // Get the users you're looking for...
      Account.findOne({ roles: 'user' }, (err, user) => {
        if (err) res.status(400).send({ id: 'posts_seed_find_users_error', m: err })
        if (!user) res.status(400).send({ id: 'posts_seed_find_users_failed', m: 'Failed to find users.' })

        console.log(`[i] ACCOUNT FOUND`)

        // Post seed posts
        Post.create(seedData, (err, data) => {
          if (err) res.status(400).send({ id: 'posts_seed_failed', m: 'Failed to seed posts.' })

          console.log(`[i] DATA CREATED`)

          // Put the one account id into post owners field
          Post.update({}, {
            $addToSet: { 'createdBy': user._id, 'updatedBy': user._id }
          }, {
            multi: true,
            new: true,
            upsert: true
          }, (err, info) => {
            if (err) {
              res.status(400).send({ id: 'account_post_error', e: `${err}`, m: 'Something wrong. Try again.' })
            } else if (!info) {
              res.status(404).send({ id: 'account_post_data_failed', m: `Failed to update posts' owners.` })
            } else {
              // --------------------
              // Finally send the info
              res.status(200).send({
                posts: { s: true, id: 'posts_seed_success', m: `Successfully seeded some posts.` }
              })
            }
          })
        })
      })
    })
  },

  /* ---------------------------------------------------------------------------
   * @api {delete} /
   */
  delete: (req, res) => {
    Post.remove().exec((err, data) => {
      // console.log('deletePosts:', data)
      if (err) res.status(400).send({ id: 'post_delete_error', e: `Error: ${err}` })
      else if (!data) res.status(404).send({ id: 'post_delete_failed', m: 'Data already empty.' })
      else res.status(200).send({ m: `All posts have been removed.` })
    })
  },

  // ---------------------------------------------------------------------------
  // PUBLIC
  // ---------------------------------------------------------------------------

  /* ---------------------------------------------------------------------------
   * @api {get} ?page=1
   */
  get: (req, res) => {
    Post
      .paginate({}, {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10
      })
      .then((result) => {
        console.log('getPostsPaginated:', result.docs)
        sendResponseNF(res, false, result.docs, 'Failed to get all posts with pagination.')
      })
      .catch((err) => {
        res.status(400).send({ id: 'posts_error', e: `${err}`, m: 'Failed to get all posts with pagination.' })
      })
  },

  /* ---------------------------------------------------------------------------
   * @api {get} /all
   */
  getAll: (req, res) => {
    Post
      .find({})
      .exec((err, data) => {
        // console.log('getPosts:', data)
        sendResponseNF(res, err, data, 'Failed to get all posts.')
      })
      .catch((err) => {
        res.status(400).send({ id: 'posts_error', e: `${err}`, m: 'Failed to get all posts without pagination.' })
      })
  },

  /* ---------------------------------------------------------------------------
   * @api {post} /
   */
  post: (req, res) => {
    const data = {}
    data.title = req.body.title
    data.content = req.body.content
    data.createdBy = req.decoded.sub
    data.updatedBy = req.decoded.sub

    Post.create(data, (err) => {
      sendResponse(res, err, data, `Post with title ${req.body.title} is probably already exist.`)
    })
  },

  /* ---------------------------------------------------------------------------
   * @api {post} /search
   */
  search: (req, res) => {
    let post = {}
    if (req.body.isbn) post.isbn = new RegExp(req.body.isbn, 'i')
    if (req.body.title) post.title = new RegExp(req.body.title, 'i')
    if (req.body.price) post.price = Number(req.body.price)
    console.log({post})

    if (!R.isEmpty(post)) {
      Post.find(post, (err, data) => {
        sendResponse(res, err, data, `Failed to search posts with data: ${post}`)
      })
    } else {
      res.status(422).send({ id: 'post_search_no_data', m: `Failed to search posts with no data.` })
    }
  },

  /* ---------------------------------------------------------------------------
   * @api {get} /:id
   */
  getById: (req, res) => {
    Post.findOne({
      isbn: req.params.id
    }, {
      '_id': 0
    }, (err, data) => {
      // console.log('getPostByID:', data)
      sendResponseNF(res, err, data, 'Failed to GET post by ID.')
    })
  },

  /* ---------------------------------------------------------------------------
   * @api {delete} /:isbn
   */
  deleteById: (req, res) => {
    let updated = {
      m: `Post with ID '${req.params.id}' has been removed.`,
      post: null,
      i: null
    }

    // Remove post from database
    Post.findOneAndRemove({
      isbn: req.params.id
    }, (err, data) => {
      // console.log('deletePostByID:', data)
      if (err) res.status(400).send({ id: 'post_delete_error', e: `Error: ${err}` })
      else if (!data) res.status(404).send({ id: 'post_delete_not_found', m: `No post found with ID '${req.params.id}'.` })
      else {
        updated.post = data
        res.status(201).send(updated)
      }
    })
  },

  /* ---------------------------------------------------------------------------
   * @api {put} /:isbn
   */
  updateById: (req, res) => {
    // Prepare required data
    let post = {}
    if (req.body.isbn) post.isbn = req.body.isbn
    if (req.body.title) post.title = req.body.title
    if (req.body.price) post.price = req.body.price
    console.log({post})

    // Check if the required data are exist
    if (!R.isEmpty(post)) {
      res.status(422).send({ id: 'post_update_no_data', m: `Failed to update post with no data.` })
    }

    // Update existing post data with new post data
    Post.findOneAndUpdate({
      isbn: req.params.id
    }, {
      $set: post,
      $addToSet: { // only add if not exist
        'updatedBy': req.decoded.id
      }
    }, {
      new: true,    // return the modified document
      upsert: false // create new doc if not exist
    }, (err, data) => {
      sendResponseNF(res, err, data, `Failed to update post with ID '${req.params.id}'.`)
    })
  },

  /* ---------------------------------------------------------------------------
   * @api {put} /:id/author
   */
  updateByIdAndAuthor: (req, res) => {
    // Prepare response data
    let updated = {
      s: true,
      m: 'Successfully updated post by ID to put with author ID.',
      post: null,
      account: null
    }

    // Assign accountId to post's owners
    Post.findOneAndUpdate({
      isbn: req.params.id
    }, {
      $addToSet: {
        'updatedBy': req.decoded.sub,
        'owners.$.owner': req.decoded.sub
      }
    }, {
      new: true,
      upsert: false
    }, (err, data) => {
      if (err) {
        res.status(400).send({
          id: 'post_error', e: `${err}`, m: 'Something wrong. Try again.'
        })
      } else if (!data) {
        res.status(404).send({
          id: 'post_data_failed',
          m: `Failed to update post with ID '${req.params.id}' and assign owner of accountId '${req.decoded.id}'.`
        })
      } else {
        updated.post = data
      }
    })

    // Assign post ID to account's posts
    Account.findOneAndUpdate({
      accountId: req.decoded.id
    }, {
      $addToSet: {
        'updatedBy': req.decoded.sub,
        'posts': String(req.params.id)
      }
    }, {
      new: true,
      upsert: false
    }, (err, data) => {
      if (err) {
        res.status(400).send({
          id: 'post_error', e: `${err}`, m: 'Something wrong. Try again.'
        })
      } else if (!data) {
        res.status(404).send({
          id: 'post_data_failed',
          m: `Failed to update account with id of '${req.decoded.USERNAME}' and assign post with ID '${req.params.id}'. Might not exist yet.`
        })
      } else {
        updated.account = data
      }
    })

    // Wait until all data have been updated
    // Finally send the updated post and account data
    // console.log(updated)
    setTimeout(() => { res.status(201).send(updated) }, 1000)
  }

// PostController
}
