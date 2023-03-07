const express = require('express');
const controller = require('../controllers/productsController');
const isAuth = require('../middleware/isAuth');
const route = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/imgs');
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}_dateVal_${Date.now()}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else cb(null, false);
};
const imageUpload = multer({ storage: storage, fileFilter: fileFilter });

route.get('/products', controller.getAll);
route.get('/products/detail/:id', controller.getDetail);
route.get('/products/pagination/:queries?', controller.getPagination);
route.post(
  '/newproduct',
  isAuth.isAdmin,
  imageUpload.array('image'),
  controller.newProduct
);
route.post(
  '/editproduct/:id',
  isAuth.isAdmin,
  multer().none(),
  controller.editProduct
);

route.delete('/delproduct/:id', isAuth.isAdmin, controller.delProduct);

module.exports = route;
