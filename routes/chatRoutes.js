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
      res.json(chats.map(chats => chats.apiRepr()));
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
      });
});

router.get('/:id', (req, res) => {
  ChatRoom
    .findById(req.params.id)
    .exec()
    .then( chats => {
      res.json(chats.apiRepr());
      })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
      });
});

////////////////////PUT for ChatRoom /////////////////////////

router.put('/:id', (req, res) => {
  if(!(req.params.id === req.body.id)){
    const message = (`Request path id (${req.params.id}) and reques body id
      (${req.body.id}) must match`);
    console.error(message);
    res.status(400).json({message: message});
  }
  
  const toUpdate = {};
  const updateableFields = ['title', 'category', 'messages', 'users'];

  updateableFields.forEach(field => {
    if( field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });
  ChatRoom
    .findByIdAndUpdate(req.params.id, {$set: toUpdate},{new:true})
    .exec()
    .then(chat => res.status(201).json(chat.apiRepr()))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

/////////////////////DELETE for ChatRoom /////////////////////////

router.delete('/:id', (req, res) => {
  ChatRoom
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(chat => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});


router.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

module.exports = router;
