'use strict';

//////////////////////////////////////////////////////////////
///////////////        Fetch Functions          /////////////
////////////////////////////////////////////////////////////
/* add data to the database chatroom */
function addToData(element){
  const obj = {
    title:element.find('#title').val(),
    category:element.find('#category').val()
  };
  return fetch('https://jabber-jam.herokuapp.com/chatrooms',{
    method: 'POST',
    mode:'cors',
    headers: new Headers({
      'Content-Type': 'application/json'
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

/* adding updated messages,title, and category to db*/
function addMsgToDb(state,message){
  state.sentMessages.push({id:state.userId,message:message});
  const object = {
    id: state.chatId,
    messages:state.sentMessages
  };

  return fetch(`https://jabber-jam.herokuapp.com/chatrooms/${state.chatId}`, {
    method: 'PUT',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json'
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

function addCatToDb(state,category){
  state.category = category;
  const object ={
    id: state.chatId,
    category:state.category    
  };

  return fetch(`https://jabber-jam.herokuapp.com/chatrooms/${state.chatId}`, {
    method: 'PUT',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json'
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

function addTitleToDb(state,title){
  state.title = title;
  const object ={
    id: state.chatId,
    title:state.title    
  };

  return fetch(`https://jabber-jam.herokuapp.com/chatrooms/${state.chatId}`, {
    method: 'PUT',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json'
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

function deleteFromDb(state){
  return fetch(`https://jabber-jam.herokuapp.com/chatrooms/${state.chatId}`, {
    method: 'DELETE',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
  .then(()=>{
    alert(`You have deleted the chatroom with title ${state.title} with category ${state.category}`);
    renderHideMainShowChat(state,$('.main_hide_show'),$('.single_chatroom'));
    render(state,$('.list_chatroom'),$('.category_list'),$('.single_chatroom'));
  });
}

function setTitleValue(state,sentElement,titleElement){
  addTitleToDb(state,sentElement.val())
  .then(resUpd=>{
    setStateToUpdTitle(state,resUpd);
    renderUpdTitleCat(state,titleElement);
  });
}

function setCatValue(state,sentElement,titleElement){
  addCatToDb(state,sentElement.val())
  .then(resUpd=>{
    setStateToUpdCat(state,resUpd);
    renderUpdTitleCat(state,titleElement);
  });
}

function initChatroom(state,element){
  getChatroomById(element.attr('data-id'))
  .then(resQ =>{
    setInitialState(state,resQ);
    renderChatroomPage(appState, $('.conversation'),$('.delete_update'));
    renderHideMainShowChat(appState,$('.main_hide_show'),$('.single_chatroom'));
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

/*set the state to the inital chatroom page state */
function setInitialState(state,res){
  state.chatId = res.id;
  state.sentMessages = res.messages;
  state.title = res.title;
  state.category = res.category;
}

/*Set state sentMessages to res.messages */
function setSentMsgToRes(state,res){
  state.sentMessages = res.messages;
}

/*Set state Userid to a random number (user tracker) */
function setUserId(state){
  state.userId = Math.floor(Math.random()*100);
}

/*Set state title to res title */
function setStateToUpdTitle(state,res){
  state.title = res.title;
}

/*Set state category to res category */
function setStateToUpdCat(state,res){
  state.category = res.category;
}

/*Checks if this screen is main screen or not */
function changeShowHide(state){
  state.isMainScreen? state.isMainScreen= false: state.isMainScreen = true;
  return state;
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
    htmlStr += mappedCategory + '</ul>';
    element.html(htmlStr);
  });
}

/*hide and show screens */
function renderHideMainShowChat(state,mainElement,showElement){
  if(state.isMainScreen){
    changeShowHide(state);
    mainElement.hide();
    showElement.show();  
  }else{
    changeShowHide(state);
    mainElement.show();
    showElement.hide();     
  }
}

/*hides chatroom screen*/
function hideChatroom(element){
  element.hide();
}

/*Initial chatroom messages */
function renderChatroomPage(state,msgElement,titleCatElement){
  renderChatroomMessages(state,msgElement);
  renderUpdTitleCat(state,titleCatElement);
}

/* after you send the message, render the chatroom message */
function setUpdatedMessages(state,sentVal,messageElement){
  getChatroomById(state.chatId)
  .then(resGet=>{
    
    console.log('get',resGet);
    setSentMsgToRes(state,resGet);
    console.log(sentVal);
    return addMsgToDb(state,sentVal);
  })
  .then(resUpd=>{
    console.log('upd',resUpd);
    setSentMsgToRes(state,resUpd);
    renderChatroomMessages(state,messageElement); 
  });
}

/*render chatroom messages */
function renderChatroomMessages(state,messageElement){
  let msg;
  if(state.sentMessages.length > 0){
    msg = state.sentMessages.map(el => {
      return `<li>${el.id}: ${el.message}</li>`;
    }).join('\n');
  }
  messageElement.html(msg);   
}

/*rendering the updated title and cat*/
function renderUpdTitleCat(state,titleCatElement){
  const htmlStr = `
        <ul>
          <li class ="updT">${state.title}</li>
          <input type="text" id="updateTitle" name="updateTitle" placeholder="Change Title">
          <li class = "updCat">${state.category}</li>
          <input type="text" id="updateCat" name="updateCat" placeholder="Change Category">
          <li class = "deleteChat">Delete Chatroom</li>
        </ul>`;   
  titleCatElement.html(htmlStr);
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
    initChatroom(state,$(this));
  });
}

/*update the chatroom message once you click */
function updChatroomMsgClick(state){
  $('.messages').on('click','#button',function(event){
    event.preventDefault();
    setUpdatedMessages(state,$('#text').val(),$('.conversation'));
    $('#text').val('');
  });
}

/*update the chatroom message once you press enter key */
function updChatroomMsgEnter(state){
  $('.messages').on('keypress','#text', function (e) {
    var key = e.which;
    if(key === 13)  // the enter key code
    {
      event.preventDefault();
      setUpdatedMessages(state,$('#text').val(),$('.conversation'));
      $('#text').val('');
    }
  });
}

/*update the title once you press enter key */
function updTitleEnter(state){
  $('.delete_update').on('keypress', '#updateTitle', function (e) {
    var key = e.which;
    if(key === 13)  // the enter key code
    {
      event.preventDefault();
      setTitleValue(state,$('#updateTitle'),$('.delete_update'));
      $('#updateTitle').val('');
    }
  });  
}

/*update the category once you press enter key */
function updCatEnter(state){
  $('.delete_update').on('keypress', '#updateCat', function (e) {
    var key = e.which;
    if(key === 13)  // the enter key code
    {
      event.preventDefault();
      setCatValue(state,$('#updateCat'),$('.delete_update'));
      $('#updateCat').val('');
    }
  });  
}
function delChatroom(state){
  $('.delete_update').on('click','.deleteChat',function(event){
    deleteFromDb(state);
  });
}
//////////////////////////////////////////////////////////////
///////////////          Callback Function      /////////////
////////////////////////////////////////////////////////////
$(function(){
  setUserId(appState);
  render(appState,$('.list_chatroom'),$('.category_list'),$('.single_chatroom'));
  createChatroom(appState);
  showFilterChatroom(appState);
  showAllChatrooms(appState);
  hideMainScreen(appState);
  updChatroomMsgClick(appState);
  updChatroomMsgEnter(appState);
  updTitleEnter(appState);
  updCatEnter(appState);
  delChatroom(appState);
});