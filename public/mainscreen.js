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

// /*Get the messages of this chatroom document from the database  */
// function getMessagesTitleCat(state){
//   return fetch(`https://jabber-jam.herokuapp.com/chatrooms/${state.chatId}`, {
//     method: 'GET',
//     mode: 'cors',
//     headers: new Headers({
//       'Content-Type': 'application/json'
//     }),
//   })
//   .then(res => {
//     if(!res.ok) {
//       return Promise.reject(res.statusText);
//     }
//     return res.json();
//   });
// }

/* adding updated messages,title, and category to db*/
function addMsgTitleCatToDb(state,title, category,message){
  // state.sentMessages.push(message);
  // const object = {
  //   id: state.chatId,
  //   messages:state.sentMessages
  // };
  console.log(state.chatId);
  const object = diffUpdTitCatMsg(state,title,category,message);
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

function setInitialState(state,res){
  state.chatId = res.id;
  state.sentMessages = res.messages;
  state.title = res.title;
  state.category = res.category;
}

function setSentMsgToRes(state,res){
  state.sentMessages = res.messages;
}

function setUserId(state){
  state.userId = Math.floor(Math.random()*100);
}

/*see which field to update*/
function diffUpdTitCatMsg(state,title,category,message){
  let updObj;
  if(message){
    state.sentMessages.push(message);
    updObj = {
      id: state.chatId,
      messages:state.sentMessages
    };
  }else if(category){
    updObj ={
      id: state.chatId,
      category:state.category    
    };
  }else if(title){
    updObj = {
      id: state.chatId,
      title:state.title
    };
  }
  return updObj;
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

function renderChatroom(state,element){
  getChatroomById(element.attr('data-id'))
  .then(resQ =>{
    setInitialState(state,resQ);
    renderChatroomPage(appState, $('.conversation'),$('.delete_update'));
    $('.main_hide_show').hide();
    $('.single_chatroom').show();
  });
}

/*hides chatroom screen*/
function hideChatroom(element){
  element.hide();
}

/*Initial chatroom messages */
function renderChatroomPage(state,msgElement,titleCatElement){
  setUserId(state);
  let msg;
  if(state.sentMessages.length > 0){
    msg = state.sentMessages.map(el => {
      return `<li>${state.userId}: ${el.message}</li>`;
    }).join('\n');
  }
  msgElement.html(msg);
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

/* after you send the message, render the chatroom message */
function renderUpdatedMessages(state,sentElement,messageElement){
  addMsgTitleCatToDb(state,null,null,sentElement.val())
  .then(resUpd=>{
    setSentMsgToRes(state,resUpd);
    const msg = state.sentMessages.map(el => {
      return `<li>${state.userId}: ${el.message}</li>`;
    }).join('\n');
    messageElement.html(msg);   
  });
}

/*rendering the updated title */
function renderUpdTitle(state,sentElement,titleElement){
  addMsgTitleCatToDb(state,sentElement.val(),null,null)
  .then(resUpd=>{
    setStateToUpdTitle(state,resUpd);
    const htmlStr = `
        <ul>
          <li class ="updT">${state.title}</li>
          <input type="text" id="updateTitle" name="updateTitle" placeholder="Change Title">
          <li class = "updCat">${state.category}</li>
          <input type="text" id="updateCat" name="updateCat" placeholder="Change Category">
          <li class = "deleteChat">Delete Chatroom</li>
        </ul>`;   
    titleElement.html(htmlStr);
  });
}
function renderUpdCat(state,sentElement,catElement){
  addMsgTitleCatToDb(state,null,sentElement.val(),null)
  .then(resUpd=>{
    setStateToUpdCat(state,resUpd);
    const htmlStr = `
        <ul>
          <li class ="updT">${state.title}</li>
          <input type="text" id="updateTitle" name="updateTitle" placeholder="Change Title">
          <li class = "updCat">${state.category}</li>
          <input type="text" id="updateCat" name="updateCat" placeholder="Change Category">
          <li class = "deleteChat">Delete Chatroom</li>
        </ul>`;   
    catElement.html(htmlStr);
  });  
}
function setStateToUpdTitle(state,res){
  state.title = res.title;
}
function setStateToUpdCat(state,res){
  state.category = res.category;
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

/*update the chatroom message once you press enter key */
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

/*update the title once you press enter key */
function updTitleEnter(state){
  $('.delete_update').keypress(function (e) {
    var key = e.which;
    if(key === 13)  // the enter key code
    {
      event.preventDefault();
      renderUpdatedMessages(state,$('#updateTitle'),$('.updT'));
      $('#updateTitle').val('');
    }
  });  
}

/*update the category once you press enter key */
function updCatEnter(state){
  $('.delete_update').keypress(function (e) {
    var key = e.which;
    if(key === 13)  // the enter key code
    {
      event.preventDefault();
      renderUpdatedMessages(state,$('#updateCat'),$('.updCat'));
      $('#updateCat').val('');
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
  updTitleEnter(appState);
  updCatEnter(appState);
});