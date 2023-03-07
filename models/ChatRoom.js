const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  messages: [],
});

module.exports = mongoose.model('Chat', ChatSchema);
