'use strict';
const express = require('express');
const morgan = require('morgan');
const app = express();
const userRouter = require('./routes/userRoutes');
const chatRouter = require('./routes/chatRoutes');
const {DATABASE_URL, PORT} = require('./config');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;

mongoose.Promise = global.Promise;

app.use(cors());
// app.use(setCorsHeaders);
// app.use(express.static('public'));
app.use('/', express.static(__dirname + '/public'));
app.use('/src', express.static(__dirname + '/src'));
app.use('/views', express.static(__dirname + '/src/views'));
app.use('/users', userRouter);
app.use('/chatrooms', chatRouter);
app.use(morgan('common'));

// function setCorsHeaders(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
//   next();
// }

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/index.html');
});

let server;
function runServer(databaseUrl = DATABASE_URL, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      }).on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = {
  app,
  runServer,
  closeServer
};

// app.listen(process.env.PORT || 8080);
//
// module.exports = {app};
