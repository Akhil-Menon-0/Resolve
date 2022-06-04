const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  content: String,
  occurences: Number
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
