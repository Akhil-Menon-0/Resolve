const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Doubt must have a title']
  },
  description: String,
  tags: String,
  image: String,
  views: Number,
  num_of_replies: Number,
  username: String,
  code: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Doubt must belong to a user']
  },
  replies: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Reply'
  }],
  date:Date,
  dp:String
});

const Doubt = mongoose.model('Doubt', doubtSchema);

module.exports = Doubt;
