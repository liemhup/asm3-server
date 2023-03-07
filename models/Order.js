const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  idUser: String,
  cart: { type: mongoose.Types.ObjectId, ref: 'Cart' },
  address: {
    type: String,
  },
  total: {
    type: Number,
    require: true,
  },
  phone: Number,
  status: Boolean,
  delivery: Boolean,
  fullname: String,
  date: Date,
});

module.exports = mongoose.model('Order', orderSchema);
