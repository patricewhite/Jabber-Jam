'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/////////////////////////////////////////////////////////////////////////////////////
///////////////           Chatroom Schema                  /////////////////////////
///////////////////////////////////////////////////////////////////////////////////
const chatRoomSchema = mongoose.Schema({
  users:[{username:String}],
  messages:[String],
  title:{type:String, required:true},
  category:{type:String,required:true}
});

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
const userSchema = mongoose.Schema({
  username:{type:String, required:true,unique:true},
  password:{type:String, required:true},
  firstName:String,
  lastName:String,
  //chatroomid:[{id:mongoose.Schema.type.objectID}],
  email:{type:String, required:true}
});

userSchema.virtual('fullName').get(function(){
  return `${this.firstName} ${this.lastName}`.trim();
}).set(function(fullName){
  const [first, last] = fullName.split(' ');
  this.firstName = first;
  this.lastName = last;
});

userSchema.methods.apiRepr = function(){
  return {
    username: this.username,
    fullname: this.fullname,
    email: this.email
  };
};

userSchema.methods.validatePassword = function(password){
  return bcrypt.compare(password,this.password);
};

userSchema.statics.hashPassword = function(password){
  return bcrypt.hash(password,10);
};

const User = mongoose.model('User',userSchema);
const ChatRoom = mongoose.model('ChatRoom',chatRoomSchema);

module.exports = {ChatRoom, User};
