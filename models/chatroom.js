'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/////////////////////////////////////////////////////////////////////////////////////
///////////////           Chatroom Schema                  /////////////////////////
///////////////////////////////////////////////////////////////////////////////////
/*Chatroom Schema Format */
const chatRoomSchema = mongoose.Schema({
  users:[{username:String}],
  messages:[{id:Number, message:String}],
  title:{type:String, required:true},
  category:{type:String,required:true}
});

/*how information should look like when apiRepr on one of the chatroom documents */
chatRoomSchema.methods.apiRepr = function(){
  return {
    id: this._id,
    users:this.users,
    messages:this.messages,
    title:this.title,
    category:this.category
  };
};

/////////////////////////////////////////////////////////////////////////////////////
///////////////           User Schema                  /////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
/*User Schema Format */
const userSchema = mongoose.Schema({
  username:{type:String, required:true,unique:true},
  password:{type:String, required:true},
  firstName:String,
  lastName:String,
  chatroomId:[{id:mongoose.Schema.Types.ObjectId}],
  email:{type:String, required:true}
});

/*creates a fullName property for our schema*/
/*Also splits fullName property to the firstName and lastName property for our schema */
userSchema.virtual('fullName').get(function(){
  return `${this.firstName} ${this.lastName}`.trim();
}).set(function(fullName){
  const [first, last] = fullName.split(' ');
  this.firstName = first;
  this.lastName = last;
});

/*how information should look like when apiRepr on one of the userSchema documents */
userSchema.methods.apiRepr = function(){
  return {
    username: this.username,
    fullName: this.fullName,
    ownChatRoom: this.chatroomId,
    email: this.email
  };
};

/*one of userSchema documents will call this function check if the password is the same */
userSchema.methods.validatePassword = function(password){
  return bcrypt.compare(password,this.password);
};

/*Our user object will call this to hash one of our passwords */
userSchema.statics.hashPassword = function(password){
  return bcrypt.hash(password,10);
};

/*Linking User Schema to the User Schema in our database */
const User = mongoose.model('User',userSchema);

/*Linking Chatroom Schema to the Chatroom Schema in our database */
const ChatRoom = mongoose.model('ChatRoom',chatRoomSchema);

/*Exporting the Chatroom and User model that links to our database */
module.exports = {ChatRoom, User};
