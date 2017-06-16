'use strict';
//var base64js = require('base64-js')
//////////////////////////////////////////////////////////////
///////////////        Fetch Functions          /////////////
////////////////////////////////////////////////////////////
/* add data to the database chatroom */
function addToData(element){
  const obj = {
    title:element.find('#title').val(),
    category:element.find('#category').val()
  };

  let username = 'loco4';
  let password = 'dance';

  return fetch('https://jabber-jam.herokuapp.com/chatrooms',{
    method: 'POST',
    mode:'cors',
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization':'Basic ' + btoa(username + ":" + password)
    }),
    body: JSON.stringify(obj)
  })
  .then(res=>{
    if (!res.ok) {
      return Promise.reject(res.statusText);
    }
    return res.json();
  });
}

/*getting chatroom documents from database*/
function getDataChatroom(){
  return fetch('https://jabber-jam.herokuapp.com/chatrooms',{
    method: 'GET',
    mode:'cors',
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
  .then(res=>{
    if (!res.ok) {
      return Promise.reject(res.statusText);
    }
    return res.json();
  });
}

/*getting distinct category from the database*/
function getDataCategory(){
  return fetch('https://jabber-jam.herokuapp.com/chatrooms/distinct',{
    method: 'GET',
    mode:'cors',
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
  .then(res=>{
    if (!res.ok) {
      return Promise.reject(res.statusText);
    }
    return res.json();
  });
}

/*get chatroom by id */
function getChatroomById(id){
  return fetch(`https://jabber-jam.herokuapp.com/chatrooms/${id}`,{
    method: 'GET',
    mode:'cors',
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
  .then(res=>{
    if (!res.ok) {
      return Promise.reject(res.statusText);
    }
    return res.json();
  });
}

/*Get the messages of this chatroom document from the database  */
function getMessages(state){
  return fetch(`https://jabber-jam.herokuapp.com/chatrooms/${state.chatId}`, {
    method: 'GET',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
  })
  .then(res => {
    if(!res.ok) {
      return Promise.reject(res.statusText);
    }
    return res.json();
  });
}

/* adding updated messages to db*/
function addMessagesToDb(state,message){
  state.sentMessages.push(message);
  const object = {
    id: state.chatId,
    messages:state.sentMessages
  };

  let username = 'loco4';
  let password = 'dance';

  return fetch(`https://jabber-jam.herokuapp.com/chatrooms/${state.chatId}`, {
    method: 'PUT',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization':'Basic ' + btoa(username + ":" + password)
    }),
    body: JSON.stringify(object)
  })
  .then(res => {
    if(!res.ok) {
      return Promise.reject(res.statusText);
    }
    return res.json();
  });
}

//////////////////////////////////////////////////////////////
///////////////        State Modification       /////////////
////////////////////////////////////////////////////////////
/*filter chatrooms*/
function filterChatroom(state,category, arr){
  state.chatroomList = arr;
  state.filterChatroomList = state.chatroomList.filter(el=>{
    return el.category === category;
  });
  return state.filterChatroomList;
}

function setSentMsgToRes(state,res){
  state.sentMessages = res.messages;
}

function setUserId(state){
  state.userId = Math.floor(Math.random()*100);
}

//////////////////////////////////////////////////////////////
///////////////          Render                 /////////////
////////////////////////////////////////////////////////////
/*render the page*/
function render(state,chatroomElement,categoryElement,hideChatElement){
  hideChatroom(hideChatElement);
  Promise.all([renderCategoryList(state,categoryElement),
    renderChatroomList(state, chatroomElement)]);
}

/* show all chatrooms or filtered chatroom list */
function renderChatroomList(state,chatroomElement,categoryElement){
  getDataChatroom(state)
  .then(resQ=>{
    let chatroomArr;
    if(!categoryElement){
      state.chatroomList = resQ;
      chatroomArr = state.chatroomList;
    }else{
      chatroomArr = filterChatroom(state, categoryElement.text(),resQ);
    }
    let htmlStr = `<p>Chatroom List</p>
          <ul>`;
    const mappedChat = chatroomArr.map(el=>{
      return `<li data-id=${el.id}>${el.title}</li>`;
    }).join('\n\t');

    htmlStr += mappedChat + '</ul>';
    chatroomElement.html(htmlStr);
  });
}

/* show all the category */
function renderCategoryList(state,element){
  getDataCategory(state)
  .then(resQ =>{
    state.categoryList = resQ;
    let htmlStr = `<p>Categories</p>
          <ul>`;
    const mappedCategory = state.categoryList.map(el=>{
      return `<li>${el}</li>`;
    }).join('\n\t');
    htmlStr += mappedCategory + `</ul>`;
    element.html(htmlStr);
  });
}

function renderChatroom(state,element){
  getChatroomById(element.attr('data-id'))
  .then(resQ =>{
    console.log(resQ);
    state.chatId = resQ.id;
    state.sentMessages = resQ.messages;
    state.title = resQ.title;
    state.category = resQ.category;
    renderRecievedMessages(appState, $('.conversation'));
    $('.main_hide_show').hide();
    $('.single_chatroom').show();
  });
}

/*hides chatroom screen*/
function hideChatroom(element){
  element.hide();
}

/*Initial chatroom messages */
function renderRecievedMessages(state,element){
  getMessages(state)
  .then(resM => {
    setUserId(state);
    setSentMsgToRes(state,resM);
    let message;
    if(state.sentMessages.length > 0){
      message = state.sentMessages.map(el => {
        return `<li>${state.userId}: ${el}</li>`;
      }).join('\n');
    }
    element.html(message);
  });
}

/* after you send the message, render the chatroom message */
function renderUpdatedMessages(state,sentElement,messageElement){
  addMessagesToDb(state,sentElement.val())
  .then(resUpd=>{
    setSentMsgToRes(state,resUpd);
    const message = state.sentMessages.map(el => {
      return `<li>${state.userId}: ${el}</li>`;
    }).join('\n');
    messageElement.html(message);
  });
}

//////////////////////////////////////////////////////////////
///////////////          Event Listeners        /////////////
////////////////////////////////////////////////////////////
/* creates a chat room in the database */
function createChatroom(state){
  $('.chatroom_form').on('submit',function(event){
    event.preventDefault();
    addToData($('.chatroom_form'))
    .then((resQ)=>{
      alert(`You have created the chatroom with the title ${resQ.title} and category ${resQ.category}`);
      render(state,$('.list_chatroom'),$('.category_list'),$('.single_chatroom'));
    });
  });
}

/* Show filter chatrooms */
function showFilterChatroom(state){
  $('.category_list').on('click','li',function(event){
    renderChatroomList(state,$('.list_chatroom'),$(this));
  });
}

/*show all chatrooms */
function showAllChatrooms(state){
  $('.category_list').on('click','p',function(event){
    renderChatroomList(state,$('.list_chatroom'));
  });
}

/*hide mainscreen */
function hideMainScreen(state){
  $('.list_chatroom').on('click','li',function(event){
    renderChatroom(state,$(this));
  });
}

/*update the chatroom message once you click */
function updChatroomMsgClick(state){
  $('#button').on('click',function(event){
    event.preventDefault();
    renderUpdatedMessages(state,$('#text'),$('.conversation'));
    $('#text').val('');
  });
}

/*update the chatroom message once you click */
function updChatroomMsgEnter(state){
  $('.messages').keypress(function (e) {
    var key = e.which;
    if(key === 13)  // the enter key code
    {
      event.preventDefault();
      renderUpdatedMessages(state,$('#text'),$('.conversation'));
      $('#text').val('');
    }
  });
}

//////////////////////////////////////////////////////////////
///////////////          Callback Function      /////////////
////////////////////////////////////////////////////////////
$(function(){
  render(appState,$('.list_chatroom'),$('.category_list'),$('.single_chatroom'));
  createChatroom(appState);
  showFilterChatroom(appState);
  showAllChatrooms(appState);
  hideMainScreen(appState);
  updChatroomMsgClick(appState);
  updChatroomMsgEnter(appState);
});
