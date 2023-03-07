// package
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const ExpSesssion = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const bodyParser = require('body-parser');

// Route
const userRoute = require('./routes/userRoute');
const productsRoute = require('./routes/productRoute');
const cartRoute = require('./routes/cartRoute');
const isAuth = require('./middleware/isAuth').isAuth;
const orderRoute = require('./routes/orderRoute');
const chatRoute = require('./routes/chatRoute');
//

app.use(
  ExpSesssion({
    name: 'session-id',
    secret: 'liemhup', // Secret key,
    saveUninitialized: false,
    resave: false,
    cookie: {
      sameSite: 'lax',
      secure: false,
      maxAge: 24 * 1000 * 60 * 60,
    },
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public/imgs', express.static(path.join(__dirname, 'public/imgs')));
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['POST', 'PUT', 'HEAD', 'GET', 'OPTIONS', 'DELETE'],
    credentials: true,
    allowedHeaders: ['*'],
  })
);

// use routes
app.use(userRoute);
app.use(chatRoute);
app.use(productsRoute);
app.use(isAuth, cartRoute);
app.use(isAuth, orderRoute);
// mongoose
mongoose
  .connect(
    `mongodb+srv://root:4wT3rjZ2ZuLF8W6h@cluster0.awvlw45.mongodb.net/asm3`
  )
  .then((result) => {
    const server = app.listen((port = 5000), () => {
      console.log('Start at port', port);
    });
    const socket = require('./socket');
    const io = socket.init(server);
    io.engine.on('initial_headers', (headers, req) => {
      headers['Access-Control-Allow-Origin'] = ['*'];
    });
    io.engine.on('headers', (headers, req) => {
      headers['Access-Control-Allow-Origin'] = ['*']; // url to all
    });
    io.on('connection', (socket) => {
      console.log('connected');
    });
  })
  .catch((err) => {
    throw Error('err');
  });
