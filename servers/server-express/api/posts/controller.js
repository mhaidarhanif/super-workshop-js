const mongoose = require('mongoose')
const R = require('ramda')
const Post = require('./model')
const seedData = require('./seed.json')
const Account = require('../accounts/model')
const AuthController = require('../../auth/controller')

const resource = `post`
const resources = `posts`

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
  } else if (!data) res.status(304).send({ id: `${resource}_data_failed`, m: message })
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
  } else if (!data) res.status(404).send({ id: `${resource}_data_failed`, m: message })
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
    mongoose.connection.db.dropCollection(`${resources}`, (err, result) => {
      if (err) res.status(400).send({ id: `${resources}_drop_error`, e: `${err}` })
      // console.log(`[x] Dropped collection: ${resources}`)

      // Get the users you're looking for...
      Account.findOne({ roles: { '$in': ['admin'] } }, (err, user) => {
        if (err) res.status(400).send({ id: 'posts_seed_find_users_error', m: err })
        else if (!user) res.status(400).send({ id: 'posts_seed_find_users_failed', m: 'Failed to find users.' })
        // console.log(`[i] ACCOUNT FOUND`)

        // Create via seed data
        Post.create(seedData, (err, data) => {
          if (err) res.status(400).send({ id: 'posts_seed_failed', m: 'Failed to seed posts.' })
          // console.log(`[i] DATA CREATED`)

          // Put the one account id into post owners field
          Post.update({}, {
            $addToSet: {
              'createdBy': user._id,
              'updatedBy': user._id
            }
          }, {
            multi: true, // add more than one items
            new: true,   // return updated data
            upsert: true // create new data if didn't exist yet
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
        // console.log('getPostsPaginated:', result.docs)
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
   * @api {get} /:id
   */
  getById: (req, res) => {
    Post.findOne({
      id: req.params.id
    }, (err, data) => {
      // console.log('getPostByID:', data)
      sendResponseNF(res, err, data, 'Failed to GET post by ID.')
    })
  },

  /* ---------------------------------------------------------------------------
   * @api {post} /
   */
  post: (req, res) => {
    const newData = {
      title: req.body.title,
      content: req.body.content,
      createdBy: req.decoded.sub,
      updatedBy: req.decoded.sub
    }

    Post.create(newData, (err, data) => {
      sendResponse(res, err, data, `Post with title ${req.body.title} is probably already exist.`)
    })
  },

  /* ---------------------------------------------------------------------------
   * @api {post} /search
   */
  search: (req, res) => {
    let post = {}
    if (req.body.id) post.id = new RegExp(req.body.id, 'i')
    if (req.body.title) post.title = new RegExp(req.body.title, 'i')
    if (req.body.content) post.content = new RegExp(req.body.content, 'i')
    // console.log({post})

    if (post.id) {
      Post.find(post, (err, data) => {
        sendResponse(res, err, data, `Failed to search posts with data: ${post}`)
      })
    } else {
      res.status(422).send({ id: 'post_search_no_data', m: `Failed to search posts with no data.` })
    }
  },

  /* ---------------------------------------------------------------------------
   * @api {delete} /:id
   */
  deleteById: (req, res) => {
    // Remove post from database
    Post.findOneAndRemove({
      id: req.params.id
    }, (err, data) => {
      // console.log('deletePostByID:', data)
      if (err) res.status(400).send({ id: 'post_delete_error', e: `Error: ${err}` })
      else if (!data) res.status(404).send({ id: 'post_delete_not_found', m: `No post found with ID '${req.params.id}'.` })
      else {
        res.status(201).send({
          m: `Post with ID '${req.params.id}' has been removed.`,
          post: data,
          i: null
        })
      }
    })
  },

  /* ---------------------------------------------------------------------------
   * @api {put} /:id
   */
  updateById: (req, res) => {
    // Prepare required data
    let post = {}
    if (req.body.id) post.id = req.body.id
    if (req.body.title) post.title = req.body.title
    if (req.body.content) post.content = req.body.content
    // console.log({post})

    // Update existing post data with new post data
    Post.findOneAndUpdate({
      id: req.params.id
    }, {
      $set: post,
      $addToSet: { // only add if not exist
        'updatedBy': req.decoded.sub
      }
    }, {
      new: true,    // return the modified document
      upsert: false // create new doc if not exist
    }, (err, data) => {
      sendResponseNF(res, err, data, `Failed to update post with ID '${req.params.id}'.`)
    })
  }

// PostController
}
