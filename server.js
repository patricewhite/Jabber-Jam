'use strict';
const express = require('express');
const morgan = require('morgan');
const app = express();
const userRouter = require('./routes/userRoutes');
const {DATABASE_URL, PORT} = require('./config');

app.use(express.static('public'));
app.use('/users', userRouter);
app.use(morgan('common'));

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/index.html');
});


app.listen(process.env.PORT || 8080);

module.exports = {app};
