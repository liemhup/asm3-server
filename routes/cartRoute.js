const express = require('express');
const controller = require('../controllers/cartController');
const route = express.Router();

route.delete('/carts/delete/:queries?', controller.delToCart);
route.post('/carts/add/:queries?', controller.addToCart);
route.put('/carts/update/:queries?', controller.putToCart);
route.get('/carts/:queries?', controller.getCart);
module.exports = route;
