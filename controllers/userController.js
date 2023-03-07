const { validationResult } = require('express-validator');
const { default: mongoose } = require('mongoose');
const userModel = require('./../models/User');
const bcrypt = require('bcrypt');

exports.signUp = async (req, res, next) => {
  const errs = validationResult(req);
  if (errs.isEmpty()) {
    const { email, fullname, password, phone } = req.query;
    const user = await userModel.findOne({ email });
    if (!user) {
      const newUser = new userModel({
        email,
        fullname,
        password,
        phone,
        _id: new mongoose.Types.ObjectId(),
        role: 'client',
      });
      newUser.save();
      res.status(200).end();
    } else {
      res.statusMessage =
        'This email is already in use. Please use another one.';
      res.status(507).end();
    }
  } else {
    console.log(errs);
    res.status(507).end();
  }
};

exports.logIn = async (req, res, next) => {
  // const origin = req.headers.origin.split(':')[2];
  const { email, password } = req.query;
  const userByEmail = await userModel.findOne({ email });
  if (!userByEmail) {
    res.statusMessage = 'Email does not match';
    return res.status(501).end();
  }
  bcrypt.compare(password, userByEmail.password).then((doMatch) => {
    if (!doMatch) {
      res.statusMessage = 'Wrong password, please try again';
      return res.status(502).end();
    }
    req.session.isAuth = true;
    req.session.user = userByEmail;
    res.status(200).send(JSON.stringify(userByEmail));
  });
};

exports.getLogin = async (req, res, next) => {
  if (req.session.user) res.send(JSON.stringify(req.session.user));
};

exports.getUserDetail = async (req, res, next) => {
  const id = req.params.id;
  const userById = await userModel.findById(id);
  res.send(JSON.stringify(userById));
};

exports.adminLogin = async (req, res, next) => {
  const { email, password } = req.query;
  const userByEmail = await userModel.findOne({ email });
  if (userByEmail) {
    bcrypt.compare(password, userByEmail.password).then((doMatch) => {
      if (!doMatch) {
        res.statusMessage = 'Wrong password, please try again';
        return res.status(502).end();
      } else {
        //trung mat khau
        console.log(userByEmail.role);
        if (userByEmail.role === 'admin') {
          req.session.isAuth = true;
          req.session.role = 'admin';
          req.session.user = userByEmail;
          res.status(200).send(JSON.stringify(userByEmail));
        } else if (userByEmail.role === 'staff') {
          req.session.isAuth = true;
          req.session.role = 'staff';
          req.session.user = userByEmail;
          res.status(200).send(JSON.stringify(userByEmail));
        } else {
          res.statusMessage = `You don't have permission to access`;
          return res.status(401).end();
        }
      }
    });
  }
};

exports.getClients = async (req, res, next) => {
  const clients = await userModel.countDocuments({ role: 'client' });
  // const clients = await userModel.find({ role: 'client' });
  console.log(clients);
  res.status(200).send(JSON.stringify(clients));
};

exports.postLogOut = async (req, res, next) => {
  console.log(req.session);
  req.session.destroy();
  console.log(res.session);
  console.log(res.cookies);
  res.end();
};
