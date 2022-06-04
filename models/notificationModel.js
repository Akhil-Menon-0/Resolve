const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: String,
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  initiator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  owner_username: String,
  initiator_username: String,
  seen: Boolean,
  date: Date,
  doubt: {
    type: mongoose.Schema.ObjectId,
    ref: 'Doubt',
  },
  doubt_title: String
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
