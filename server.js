'use strict';
const express = require('express');
const morgan = require('morgan');
const app = express();
const userRouter = require('./routes/userRoutes');
const chatRouter = require('./routes/chatRoutes');
const {DATABASE_URL, PORT} = require('./config');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

app.use(express.static('public'));
app.use('/users', userRouter);
app.use('/chatrooms', chatRouter);
app.use(morgan('common'));

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/index.html');
});

let server;
function runServer(databaseUrl=DATABASE_URL, port=PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
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

module.exports = {app, runServer, closeServer};

// app.listen(process.env.PORT || 8080);
//
// module.exports = {app};
