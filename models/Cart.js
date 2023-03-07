const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  // products: [
  //   {
  //     product: { type: mongoose.Types.ObjectID, ref: 'Product' },
  //     count: { type: Number, default: 1 },
  //   },
  // ],
  products: [
    {
      idUser: String,
      idProduct: String,
      priceProduct: Number,
      count: Number,
      nameProduct: String,
      img: String,
    },
  ],
  // count: { type: Number, require: true },
});

module.exports = mongoose.model('Cart', cartSchema);
