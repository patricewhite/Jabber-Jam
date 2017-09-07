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
const {ChatRoom, User} = require('../models/chatroom');

/*applying jsonParser to our routes that use router */
router.use(jsonParser);

/*Password Import stuff */
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const BearerStrategy = require('passport-http-bearer').Strategy;
//
// let secret = {
//   CLIENT_ID: process.env.CLIENT_ID,
//   CLIENT_SECRET: process.env.CLIENT_SECRET,
//   DATABASE_URL: process.env.DATABASE_URL
// };

// if (process.env.NODE_ENV !== 'production') {
//   secret = require('../secret');
// }

// passport.use(new GoogleStrategy({
//   clientID: secret.CLIENT_ID,
//   clientSecret: secret.CLIENT_SECRET,
//   callbackURL: '/api/auth/google/callback'
// }, (accessToken, refreshToken, profile, cb) => {
//   User.findOneAndUpdate({
//     googleId: profile.id
//   }, {
//     $set: {
//       googleId: profile.id,
//       accessToken: accessToken
//     }
//   }, {
//     new: true,
//     upsert: true
//   }, (err, user) => {
//     console.log('!!!!!!!!!', user);
//     return cb(err, user);
//   });
// }));
//
// passport.use(new BearerStrategy((token, done) => {
//   User.findOne({
//     accessToken: token
//   }, (err, user) => {
//     if (err) {
//       return done(err);
//     }
//     if (!user) {
//       return done(null, false);
//     }
//     return done(null, user, {scope: 'all'});
//   });
// }));

/////////////////////////////////////////////////////////////////////////////////////
///////////////                Oauth Endpoints             /////////////////////////
///////////////////////////////////////////////////////////////////////////////////

// router.get('/api/auth/google', passport.authenticate('google', {scope: ['profile']}));
//
// router.get('/api/auth/google/callback', passport.authenticate('google', {
//   failureRedirect: '/',
//   session: false
// }), (req, res) => {
//   res.cookie('accessToken', req.user.accessToken, {expires: 0});
//   res.redirect('/');
// });
//
// router.get('/api/auth/logout', (req, res) => {
//   req.logout();
//   res.clearCookie('accessToken');
//   res.redirect('/');
// });
//
// router.get('/api/me', passport.authenticate('bearer', {session: false}), (req, res) => res.json({googleId: req.user.googleId}));

/////////////////////////////////////////////////////////////////////////////////////
///////////////                  Post Chatroom             /////////////////////////
///////////////////////////////////////////////////////////////////////////////////
/*Creating and adding it into database */
router.post('/', (req, res) => {
  const requiredFields = ['title', 'category'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing ${field} in request body.`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  ChatRoom.create({title: req.body.title, category: req.body.category}).then(chats => {
    res.status(201).json(chats.apiRepr());
  }).catch(err => {
    console.error(err);
    res.status(500).json({message: 'Internal server error'});
  });
});

/////////////////////////////////////////////////////////////////////////////////////
///////////////                  Get Chatroom             /////////////////////////
///////////////////////////////////////////////////////////////////////////////////
/*Getting all the chatrooms */
router.get('/', (req, res) => {
  ChatRoom.find().exec().then(chats => {
    res.json(chats.map(chats => chats.apiRepr()));
  }).catch(err => {
    console.error(err);
    res.status(500).json({message: 'Internal server error'});
  });
});

/*Getting all distinct categories */
router.get('/distinct', (req, res) => {
  ChatRoom.distinct("category").exec().then(chats => {
    console.log("chats", chats)
    res.json(chats);
  }).catch(err => {
    console.log(err);
    res.status(500).json({message: 'Internal server error'});
  });
});

/*Getting a specific chatroom */
router.get('/:id', (req, res) => {
  ChatRoom.findById(req.params.id).exec().then(chats => {
    res.json(chats.apiRepr());
  }).catch(err => {
    console.error(err);
    res.status(500).json({message: 'Internal server error'});
  });
});

/////////////////////////////////////////////////////////////////////////////////////
///////////////                  Put for Chatroom          /////////////////////////
///////////////////////////////////////////////////////////////////////////////////
/*Updating a document in the database */
router.put('/:id', (req, res) => {
  if (!(req.params.id === req.body.id)) {
    const message = (`Request path id (${req.params.id}) and request body id
      (${req.body.id}) must match`);
    console.error(message);
    res.status(400).json({message: message});
  }
  const toUpdate = {};
  const updateableFields = ['title', 'category', 'messages', 'users'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });
  ChatRoom.findByIdAndUpdate(req.params.id, {
    $set: toUpdate
  }, {new: true}).exec().then(chat => res.status(201).json(chat.apiRepr())).catch(err => res.status(500).json({message: 'Internal server error'}));
});

/////////////////////////////////////////////////////////////////////////////////////
///////////////               Delete for Chatroom          /////////////////////////
///////////////////////////////////////////////////////////////////////////////////
/*Deleting a document in the database*/
router.delete('/:id', (req, res) => {
  ChatRoom.findByIdAndRemove(req.params.id).exec().then(chat => res.status(204).end()).catch(err => res.status(500).json({message: 'Internal server error'}));
});

/////////////////////////////////////////////////////////////////////////////////////
///////////////               Page Not Found               /////////////////////////
///////////////////////////////////////////////////////////////////////////////////
/*Page Not Found */
router.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

/////////////////////////////////////////////////////////////////////////////////////
///////////////                      Exporting Routers              ////////////////
///////////////////////////////////////////////////////////////////////////////////
/*Exporting routers */
module.exports = router;
