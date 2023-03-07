const { default: mongoose } = require('mongoose');
const productsModel = require('../models/Product');

///

exports.getAll = async (req, res, next) => {
  const products = await productsModel.find();
  res.send(JSON.stringify(products));
};

exports.getDetail = async (req, res, next) => {
  const id = req.params.id;
  const productDetail = await productsModel.findById(id);
  res.send(JSON.stringify(productDetail));
};

exports.getPagination = async (req, res, next) => {
  const { category, count, page, search } = req.query;
  const ProductByCategory =
    category === 'all'
      ? await productsModel.find()
      : await productsModel.find({ category });

  const matchProduct = ProductByCategory.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );
  const neededProduct = matchProduct.slice(count * page - count, count);
  res.send(JSON.stringify(neededProduct));
};

exports.newProduct = async (req, res, next) => {
  const { name, price, short_desc, long_desc, category } = req.body;
  const images = [...req.files];
  console.log(req.files[0].path);
  const newProduct = new productsModel({
    _id: new mongoose.Types.ObjectId(),
    name,
    price,
    long_desc,
    short_desc,
    category,
    img1: images[0] ? `http://localhost:5000/${images[0].path}` : '',
    img2: images[1] ? `http://localhost:5000/${images[1].path}` : '',
    img3: images[2] ? `http://localhost:5000/${images[2].path}` : '',
    img4: images[3] ? `http://localhost:5000/${images[3].path}` : '',
  });
  await newProduct.save();
  res.end();
};

exports.editProduct = async (req, res, next) => {
  const id = req.params.id;

  const { name, price, short_desc, long_desc, category } = req.body;
  await productsModel.findByIdAndUpdate(id, {
    name: name,
    category: category,
    price: price,
    long_desc: long_desc,
    short_desc: short_desc,
  });
  res.status(200).end();
};

exports.delProduct = async (req, res, next) => {
  const id = req.params.id;
  await productsModel.findByIdAndDelete(id);
  const productList = await productsModel.find();
  res.status(200).send(productList);
};
