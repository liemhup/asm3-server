const { default: mongoose } = require('mongoose');
const chatRoomModel = require('../models/ChatRoom');
const io = require('../socket');

exports.createRoom = async (req, res, next) => {
  if (!req.session.user) {
    const newRoom = new chatRoomModel({
      _id: new mongoose.Types.ObjectId(),
      message: [],
      // user: req.session.user._id,
    });
    await newRoom.save();
    res.status(200).send(newRoom);
  } else {
    const newRoom = new chatRoomModel({
      _id: new mongoose.Types.ObjectId(),
      message: [],
      user: req.session.user._id,
    });
    await newRoom.save();
    res.status(200).send(newRoom);
  }
};

exports.addMessage = async (req, res, next) => {
  const { is_admin, message, roomId } = req.query;
  if (roomId) {
    if (message === '==END ROOM==') {
      await chatRoomModel.findByIdAndDelete(roomId);
      io.getIo().emit('receive_message', req.query);
      res.end();
    } else {
      const roomById = await chatRoomModel.findByIdAndUpdate(roomId, {
        $push: { messages: { message, is_admin } },
      });
      io.getIo().emit('receive_message', req.query);
      res.status(200).send(roomById);
    }
  } else res.end();
};

exports.getMessage = async (req, res, next) => {
  const { roomId } = req.query;
  if (roomId) {
    const roomById = await chatRoomModel.findById(roomId);
    res.send(roomById);
  }
};

exports.getAllRoom = async (req, res, next) => {
  const allRooms = await chatRoomModel.find({});
  if (allRooms) {
    res.send(allRooms).end();
  } else res.end();
};

exports.getRoomById = async (req, res, next) => {
  if (req.params.id) {
    const roomById = await chatRoomModel.findById(req.params.id);
    res.status(200).send(roomById);
  }
};
