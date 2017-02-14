const mongoose = require('mongoose')
const sequence = require('mongoose-sequence')
const Schema = mongoose.Schema
const mongoosePaginate = require('mongoose-paginate')

const statusTypes = ['draft', 'private', 'public']

// -----------------------------------------------------------------------------

mongoosePaginate.paginate.options = {
  page: 1,
  limit: 10,
  sort: { updatedAt: -1 }
}

// -----------------------------------------------------------------------------

const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  url: String,
  status: [{
    type: String,
    lowercase: true,
    enum: statusTypes,
    default: 'draft'
  }],
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
PostSchema.plugin(sequence, { inc_field: 'postId' })

// -----------------------------------------------------------------------------
// PAGINATION
PostSchema.plugin(mongoosePaginate)

// -----------------------------------------------------------------------------
// POPULATE
PostSchema.pre('find', function (next) {
  this.populate('createdBy', 'username')
  this.populate('updatedBy', 'username')
  next()
})
PostSchema.pre('findOne', function (next) {
  // this.populate('createdBy', 'username')
  // this.populate('updatedBy', 'username')
  next()
})

// -----------------------------------------------------------------------------

module.exports = mongoose.model('Post', PostSchema)
