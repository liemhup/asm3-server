const userModel = require('../models/User');
const orderModel = require('../models/Order');
const { default: mongoose } = require('mongoose');
const validateCart = require('../helper/validateCart').validateCart;
const productModel = require('../models/Product');
const sendEmailHelper = require('../helper/sendMail').sendMailHandler;
const io = require('../socket');

exports.postEmail = async (req, res, next) => {
  const { address, fullname, idUser, phone, to } = req.query;
  const user = await userModel.findById(idUser).populate('cart');
  let billTotal = 0;
  if (user.cart) {
    const cart = user.cart;
    // validate cart helper
    const [isCartValid, afterOrder, outStockProduct] = await validateCart(cart);
    // neu du so luong hang
    if (isCartValid) {
      afterOrder.forEach(async (product) => {
        let filter = { _id: product.productId };
        let update = { $set: { count: product.count } };
        await productModel.updateMany(filter, update);
      });

      const newDate = new Date(Date.now());
      const formatedDate = newDate.toISOString().split('T')[0];
      const newOrder = new orderModel({
        _id: new mongoose.Types.ObjectId(),
        idUser,
        cart,
        address,
        total: billTotal,
        phone,
        delivery: false,
        status: false,
        fullname,
        date: formatedDate,
      });
      await newOrder.save();
      await user.updateOne({ $push: { order: newOrder } });
      sendEmailHelper(cart, address, fullname, idUser, phone, to);
      io.getIo().emit('receive_order');
      res.status(200);
    } else
      return res.status(601).send(`${outStockProduct} is out of stock`).end();
  }
  res.end();
};

exports.getHistory = async (req, res) => {
  const { idUser } = req.query;
  const userById = await userModel.findById(idUser).populate('order');
  res.status(200).send(userById.order);
};

exports.historyDetail = async (req, res) => {
  const { id } = req.params;
  const orderById = await orderModel.findById(id).populate('cart');
  console.log(orderById);
  res.status(200).send(orderById);
};

exports.getAllOrder = async (req, res) => {
  const orders = await orderModel.find().populate('idUser');
  res.send(orders).end();
};

exports.orderByMonth = async (req, res) => {
  const monthArr = req.params.month.split('-');
  const monthStart = `${monthArr[0]}-${monthArr[1]}-01`;
  const monthEnd = `${monthArr[0]}-${Number(monthArr[1]) + 1}-01`;
  const orderByMonth = await orderModel.find({
    date: { $gte: monthStart, $lte: monthEnd },
  });
  res.send(orderByMonth);
};
