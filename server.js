'use strict';
var express = require('express');
var app = express();
app.use(express.static('public'));

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/index.html');
});

app.listen(process.env.PORT || 8080);

module.exports = {app}
