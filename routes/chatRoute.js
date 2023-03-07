const express = require('express');
const route = express.Router();
const controller = require('../controllers/chatController');
const isAuth = require('../middleware/isAuth');

route.post('/chatrooms/createNewRoom', controller.createRoom);
route.put('/chatrooms/addMessage/:queries?', controller.addMessage);
route.get('/chatrooms/getById/:queries?', controller.getMessage);
route.get('/chatrooms/allroom', isAuth.isStaff, controller.getAllRoom);
route.get('/chatrooms/room/:id', isAuth.isStaff, controller.getRoomById);
module.exports = route;
