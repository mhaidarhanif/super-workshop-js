/*
Post is like a blog post
http://schema.org/BlogPosting
*/

const mongoose = require('mongoose')
const sequence = require('mongoose-sequence')
const Schema = mongoose.Schema
const mongoosePaginate = require('mongoose-paginate')

mongoosePaginate.paginate.options = {
  page: 1,
  limit: 10,
  sort: { updatedAt: -1 }
}

// -----------------------------------------------------------------------------
// PRECONFIGURATION

const modelName = 'Post'

const statusTypes = [
  'draft',
  'private',
  'public',
  'archived',
  'removed'
]

// -----------------------------------------------------------------------------

const schema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    lowercase: true,
    enum: statusTypes,
    default: 'draft'
  },
  url: {
    type: String,
    unique: true
  },
  createdBy: [{
    type: Schema.Types.ObjectId,
    ref: 'Account'
  }],
  updatedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'Account'
  }]
}, {
  timestamps: true
})

// -----------------------------------------------------------------------------
// AUTO INCREMENT ID
schema.plugin(sequence, { inc_field: 'id' })

// -----------------------------------------------------------------------------
// PAGINATION
schema.plugin(mongoosePaginate)

// -----------------------------------------------------------------------------
// VIRTUALS
// schema.virtual('author').set(function () {
//   this.author = this.createdBy
// })
// schema.virtual('author').get(function () {
//   return this.createdBy
// })

// -----------------------------------------------------------------------------
// POPULATE
schema.pre('find', function (next) {
  this.select({ __v: false })
  this.populate([
    {path: 'createdBy', select: 'username name'},
    {path: 'updatedBy', select: 'username name'}
  ])
  next()
})
schema.pre('findOne', function (next) {
  this.select({ __v: false })
  this.populate([
    {path: 'createdBy', select: 'username name'},
    {path: 'updatedBy', select: 'username name'}
  ])
  next()
})

// -----------------------------------------------------------------------------

module.exports = mongoose.model(modelName, schema)
