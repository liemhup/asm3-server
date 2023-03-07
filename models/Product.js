const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  category: {
    type: String,
    require: true,
  },
  long_desc: {
    type: String,
  },
  name: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  short_desc: {
    type: String,
  },
  img1: {
    type: String,
    require: true,
  },
  img2: {
    type: String,
    require: true,
  },
  img3: {
    type: String,
    require: true,
  },
  img4: {
    type: String,
    require: true,
  },
  count: {
    type: Number,
    require: true,
    min: 0,
  },
});

module.exports = mongoose.model('Product', productSchema);
