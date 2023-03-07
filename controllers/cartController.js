const userModel = require('../models/User');
const cartModel = require('../models/Cart');
const productModel = require('../models/Product');
const { default: mongoose } = require('mongoose');

exports.getCart = async (req, res) => {
  const idUser = req.query.idUser;
  const cart = await cartModel.findOne({ user: idUser }).populate({
    path: 'products',
    populate: { path: 'idProduct', model: 'Product' },
  });
  if (cart) res.send(JSON.stringify(cart.products));
  else res.send([]);
};

exports.addToCart = async (req, res, next) => {
  const { count, idProduct, idUser } = req.query;

  const product = await productModel.findById(idProduct);
  const cartByUser = await cartModel.findOne({ user: idUser });
  const toAddProduct = {
    idProduct,
    count,
    img: product.img1,
    priceProduct: product.price,
    nameProduct: product.name,
    idUser,
  };
  if (!cartByUser) {
    newCart = new cartModel({
      _id: new mongoose.Types.ObjectId(),
      products: [toAddProduct],
      user: idUser,
    });
    await newCart.save();
    await userModel.findByIdAndUpdate(idUser, { cart: newCart }, { new: true });
  } else {
    //cart exists for user
    let itemIndex = cartByUser.products.findIndex(
      (p) => p.idProduct == idProduct
    );

    if (itemIndex > -1) {
      //product exists in the cart, update the quantity
      let productItem = cartByUser.products[itemIndex];
      productItem.count += Number(count);
      cartByUser.products[itemIndex] = productItem;
    } else {
      //product does not exists in cart, add new item
      cartByUser.products.push({
        idProduct,
        count,
        nameProduct: product.name,
        priceProduct: product.price,
        img: product.img1,
        idUser,
      });
    }
    cart = await cartByUser.save();
    return res.status(201).send(cartByUser);
  }
};

exports.delToCart = async (req, res, next) => {
  const { idProduct, idUser } = req.query;
  const cartByUser = await cartModel.findOne({ user: idUser });
  const productIndex = cartByUser.products.findIndex(
    (product) => product.idProduct === idProduct
  );
  cartByUser.products.splice(productIndex, 1);
  await cartByUser.updateOne({ products: cartByUser.products });
  res.status(202).send(cartByUser);
};

exports.putToCart = async (req, res, next) => {
  const { count, idProduct } = req.query;
  const user = req.session.user;
  const cartToUpdate = await cartModel.findOne({ user: user._id });
  const cartClone = JSON.parse(JSON.stringify(cartToUpdate));
  cartClone.products.forEach((product) => {
    console.log(product.idProduct);
    if (product.idProduct === idProduct) product.count = count;
  });
  await cartToUpdate.updateOne({ products: cartClone.products }, { new: true });

  res.status(202).send(cartClone);
};
