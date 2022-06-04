const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Reply must have some content']
  },
  upvotes: Number,
  code: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Reply must belong to a User']
  },
  username:String,
  doubt: {
    type: mongoose.Schema.ObjectId,
    ref: 'Doubt',
    required: [true, 'Reply must belong to a Doubt']
  },
  upvotedusers:[ {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  }],
  date:Date,
  dp:String
});

const Reply = mongoose.model('Reply', replySchema);

module.exports = Reply;
