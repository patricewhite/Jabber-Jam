const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();

const{Users} = require('../models/models');


router.post('/users',jsonParser, (req, res) => {
  // const requiredFields = ['username'];
  // for (let i = 0; i < requiredFields.length; i++) {
  //   const field = requiredFields[i];
  //   if (!(field in req.body)) {
  //     const message = `Missing ${field} in request body.`;
  //     console.error(message);
  //     return res.status(400).send(message);
  //   }
  // }

  const user = Users.create(req.body.username);
  res.status(201).json(user);
});










module.exports = router;
