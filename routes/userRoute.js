const express = require('express');
const route = express.Router();
const { query } = require('express-validator');
const isAuth = require('../middleware/isAuth');
//
const userController = require('./../controllers/userController');
route.post('/users/adminlogin/:queries?', userController.adminLogin);
route.post(
  '/users/signup/:queries?',
  query('email').isEmail().normalizeEmail(),
  query('password').isLength({ min: 8 }),
  userController.signUp
);

route.post('/users/login/:queries?', userController.logIn);
route.get('/users/login', userController.getLogin);
route.get('/users/clients', isAuth.isStaff, userController.getClients);
route.get('/users/:id', isAuth.isAuth, userController.getUserDetail);
route.post('/users/logout', userController.postLogOut);

module.exports = route;
