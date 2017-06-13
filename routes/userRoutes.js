const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');

const{User} = require('../models/chatroom');

//////////////////// Post for User/////////////////////////
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['username', 'password', 'email'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    console.log(field);
    if (!(field in req.body)) {
      const message = `Missing ${field} in request body.`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  User.create({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    fullName: req.body.fullName
  })
  .then(
    user => {
      console.log(user);
      res.status(201).json(user.apiRepr());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});




module.exports = router;
