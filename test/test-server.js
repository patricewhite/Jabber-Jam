const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const faker = require('faker');
const mongoose = require('mongoose');

const{closeServer, runServer, app} = require('../server');
const{ChatRoom, User} = require('../models/chatroom');
const {TEST_DATABASE_URL} = require('../config');
const {DATABASE_URL} = require('../config');
chai.use(chaiHttp);

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
              .then(result => resolve(result))
              .catch(err => reject(err));
  });
}

const USER = {
  username: faker.internet.userName(),
  password: 'password',
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email()
};

function seedUser(){
  const newUser = {
    username: USER.username,
    firstName: USER.firstName,
    lastName: USER.lastName,
    email: USER.email
  };
  return User.hashPassword(USER.password)
    .then(hash => {
      newUser.password = hash;
      return User.create(newUser);
    });
}

function seedChatroom(){
  const seedData = [];
  for (let i =1; i <= 10; i++){
    seedData.push({
      users: [{username: faker.internet.userName()}],
      messages: [faker.lorem.sentence()],
      title: faker.lorem.words(),
      category: faker.lorem.words()
    });
  }

  return ChatRoom.insertMany(seedData);
}

describe('Testing root endpoint',function(){
  it('should verify you hit root url', function(){
    return chai.request(app)
      .get('/')
      .then(res => {
        res.should.have.status(200);
      });
  });
});
describe('ChatRoom API resource', function(){

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return Promise.all([seedUser(), seedChatroom()]);
  });

  afterEach(function() {
    // tear down database so we ensure no state from this test
    // effects any coming after.
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe('Get endpoint for chatroom', function(){
    it('should return all exisitng chatrooms', function(){

      let res;
      return chai.request(app)
      .get('/chatrooms')
      .then(_res => {
        res = _res;
        res.should.have.status(200);
        res.body.length.should.be.at.least(1);
        return ChatRoom.find().count().exec();
      })
      .then(count => {
        console.log('count',count);
        res.body.should.have.lengthOf(count);
      });
    });

    it('should return chats with the correct fields', function(){

      let resChat;
      return chai.request(app)
      .get('/chatrooms')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.at.least(1);

        res.body.forEach(function(chat) {
          chat.should.be.a('object');
          chat.should.include.key('id', 'users', 'messages', 'title', 'category');
        });
        resChat = res.body[0];
        return ChatRoom.findById(resChat.id).exec();
      })
      .then(function(chat) {
        console.log('chat',chat);
        resChat.users[0].username.should.equal(chat.users[0].username);
        resChat.messages[0].should.equal(chat.messages[0]);
        resChat.title.should.equal(chat.title);
        resChat.category.should.equal(chat.category);
      });
    });



  });




});
