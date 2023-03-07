const express = require('express');

const route = express.Router();
const controller = require('../controllers/orderController');
const isAuth = require('../middleware/isAuth');

route.post('/email/:queries?', controller.postEmail);
route.get('/histories/detail/:id', controller.historyDetail);
route.get('/histories/:queries?', controller.getHistory);
route.get('/orders/month/:month', isAuth.isStaff, controller.orderByMonth);
route.get('/orders', isAuth.isStaff, controller.getAllOrder);

module.exports = route;
