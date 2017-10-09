'use strict';

/////////////////////////////////////////////////////////////////////////////////////
///////////////                  Imports                   /////////////////////////
///////////////////////////////////////////////////////////////////////////////////
/*Import Express middleware */
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();

/*Database Import */
const mongoose = require('mongoose');

/*Our Model Import*/
const {User} = require('../models/chatroom');

/////////////////////////////////////////////////////////////////////////////////////
///////////////                  Get Users                 /////////////////////////
///////////////////////////////////////////////////////////////////////////////////
/*Getting all users that exist */
router.get('/', jsonParser, (req, res) => {
  User.find().exec().then(users => {
    res.json(users.map(user => user.apiRepr()));
  }).catch(err => {
    console.err(err);
    res.status(500).json({message: 'Internal server error'});
  });
});

/////////////////////////////////////////////////////////////////////////////////////
///////////////                Post for Users                 //////////////////////
///////////////////////////////////////////////////////////////////////////////////
/*Adding users into the database*/
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['username', 'password', 'email'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing ${field} in request body.`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  let {
    username,
    password,
    firstName,
    lastName,
    chatroomId,
    email
  } = req.body;
  username = username.trim();
  password = password.trim();
  return User.find({username}).count().exec().then(count => {
    if (count > 0) {
      return res.status(400).json({message: 'username already taken'});
    }
    return User.hashPassword(password);
  }).then(hash => {
    return User.create({
      username,
      password: hash,
      firstName,
      lastName,
      chatroomId,
      email
    });
  }).then(user => {
    return res.status(201).json(user.apiRepr());
  }).catch(err => {
    console.error(err);
    res.status(500).json({message: 'Internal server error'});
  });
});

/////////////////////////////////////////////////////////////////////////////////////
///////////////                      Exporting Routers              ////////////////
///////////////////////////////////////////////////////////////////////////////////
/*Exporting routers */
module.exports = router;
