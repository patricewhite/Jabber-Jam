const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();
const mongoose = require('mongoose');

const{ChatRoom} = require('../models/chatroom');
router.use(jsonParser);

////////////////////// Post for ChatRoom ////////////////////////
router.post('/',(req,res) => {
  const requiredFields = ['title', 'category'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    console.log(field);
    if (!(field in req.body)) {
      const message = `Missing ${field} in request body.`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  ChatRoom.create({
    title: req.body.title,
    category: req.body.category,
  })
  .then(
    chats => {
      console.log(chats);
      res.status(201).json(chats.apiRepr());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});


//////////////////// GET for ChatRoom /////////////////////

router.get('/', (req,res) => {
  ChatRoom
    .find()
    .exec()
    .then(chats => {
      res.json({
        posts: chats.map(
          (chats) => chats.apiRepr())
      });
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
      });
})

////////////////////PUT for ChatRoom /////////////////////////

router.put('/:id', (req, res) => {

})






module.exports = router;
