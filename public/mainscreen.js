'use strict';
//////////////////////////////////////////////////////////////
///////////////        Fetch Functions          /////////////
////////////////////////////////////////////////////////////
/* add data to the database chatroom */
function addToData(element) {
  const obj = {
    title: element.find('#title').val().toLowerCase(),
    category: element.find('#category').val().toLowerCase()
  };
  element.find('#title').val('');
  element.find('#category').val('');
  let username = 'loco4';
  let password = 'dance';
  return fetch('https://jabber-jam.herokuapp.com/chatrooms', {
    method: 'POST',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(username + ':' + password)
    }),
    body: JSON.stringify(obj)
  }).then(res => {
    if (!res.ok) {
      return Promise.reject(res.statusText);
    }
    return res.json();
  });
}

/*getting chatroom documents from database*/
function getDataChatroom() {
  return fetch('https://jabber-jam.herokuapp.com/chatrooms', {
    method: 'GET',
    mode: 'cors',
    headers: new Headers({'Content-Type': 'application/json'})
  }).then(res => {
    if (!res.ok) {
      return Promise.reject(res.statusText);
    }
    return res.json();
  });
}

/*getting distinct category from the database*/
function getDataCategory() {
  return fetch('https://jabber-jam.herokuapp.com/chatrooms/distinct', {
    method: 'GET',
    mode: 'cors',
    headers: new Headers({'Content-Type': 'application/json'})
  }).then(res => {
    if (!res.ok) {
      return Promise.reject(res.statusText);
    }
    return res.json();
  });
}

/*get chatroom by id */
function getChatroomById(id) {
  return fetch(`https://jabber-jam.herokuapp.com/chatrooms/${id}`, {
    method: 'GET',
    mode: 'cors',
    headers: new Headers({'Content-Type': 'application/json'})
  }).then(res => {
    if (!res.ok) {
      return Promise.reject(res.statusText);
    }
    return res.json();
  });
}

/* update messages in db*/
function addMsgToDb(state, message) {
  state.sentMessages.push({id: state.userId, message: message});
  const object = {
    id: state.chatId,
    messages: state.sentMessages
  };

  // let username = 'loco4';
  // let password = 'dance';
  return fetch(`https://jabber-jam.herokuapp.com/chatrooms/${state.chatId}`, {
    method: 'PUT',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json',
      // 'Authorization': 'Basic ' + btoa(username + ':' + password)
    }),
    body: JSON.stringify(object)
  }).then(res => {
    if (!res.ok) {
      return Promise.reject(res.statusText);
    }
    return res.json();
  });
}

/*update the category in the DB */
function addCatToDb(state, category) {
  state.category = category;
  const object = {
    id: state.chatId,
    category: state.category
  };

  let username = 'loco4';
  let password = 'dance';

  return fetch(`https://jabber-jam.herokuapp.com/chatrooms/${state.chatId}`, {
    method: 'PUT',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(username + ':' + password)
    }),
    body: JSON.stringify(object)
  }).then(res => {
    if (!res.ok) {
      return Promise.reject(res.statusText);
    }
    return res.json();
  });
}

/*update the title in the DB */
function addTitleToDb(state, title) {
  state.title = title;
  const object = {
    id: state.chatId,
    title: state.title
  };

  let username = 'loco4';
  let password = 'dance';
  return fetch(`https://jabber-jam.herokuapp.com/chatrooms/${state.chatId}`, {
    method: 'PUT',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(username + ':' + password)
    }),
    body: JSON.stringify(object)
  }).then(res => {
    if (!res.ok) {
      return Promise.reject(res.statusText);
    }
    return res.json();
  });
}

/*Delete the chatroom from the database and
  go back to the main screen */
function deleteFromDb(state) {
  let username = 'loco4';
  let password = 'dance';
  return fetch(`https://jabber-jam.herokuapp.com/chatrooms/${state.chatId}`, {
    method: 'DELETE',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(username + ':' + password)
    })
  }).then(() => {
    alert(`You have deleted the chatroom with title ${state.title} with category ${state.category}`);
    renderHideMainShowChat(state, $('.main_hide_show'), $('.single_chatroom'));
    mainScreenInit(state, $('.list_chatroom'), $('.category_list'), $('.single_chatroom'));
  });
}

///////////////////////////////////////////////////////////////////////////////
///////////          Continuation with the Fetch Functions       /////////////
/////////////////////////////////////////////////////////////////////////////
/*Main Screen Init*/
function mainScreenInit(state, chatroomElement, categoryElement, hideChatElement) {
  hideChatroom(hideChatElement);
  Promise.all([
    showDistinctChatroom(state, categoryElement),
    showFilteredOrAllChatrooms(state, chatroomElement)
  ]);
}

/* show all the distinct category */
function showDistinctChatroom(state, element) {
  getDataCategory(state).then(resQ => {
    state.categoryList = resQ;
    renderCategoryList(state, element);
  });
}

/* show all chatrooms or filtered chatroom list */
function showFilteredOrAllChatrooms(state, chatroomElement, categoryElement) {
  getDataChatroom(state).then(resQ => {
    let chatroomArr;
    if (!categoryElement) {
      state.chatroomList = resQ;
      chatroomArr = state.chatroomList;
    } else {
      chatroomArr = filterChatroom(state, categoryElement.text(), resQ);
    }
    renderChatroomList(state, chatroomElement, chatroomArr);
  });
}

/*Initialize the chatroom page */
function initChatroom(state, element) {
  getChatroomById(element.attr('data-id')).then(resQ => {
    setInitialState(state, resQ);
    renderChatroomPage(appState, $('.conversation'), $('.delete_update'));
    renderHideMainShowChat(appState, $('.main_hide_show'), $('.single_chatroom'));
  });
}

/*Set the updated category value to the state category value */
function setCatValue(state, sentElement, titleElement) {
  addCatToDb(state, sentElement.val()).then(resUpd => {
    setStateToUpdCat(state, resUpd);
    renderUpdTitleCat(state, titleElement);
  });
}

/*Set the title category value to the title category value */
function setTitleValue(state, sentElement, titleElement) {
  addTitleToDb(state, sentElement.val()).then(resUpd => {
    setStateToUpdTitle(state, resUpd);
    renderUpdTitleCat(state, titleElement);
  });
}

/* after you send the message, render the chatroom message */
function setUpdatedMessages(state, sentVal, messageElement) {
  getChatroomById(state.chatId).then(resGet => {
    setSentMsgToRes(state, resGet);
    return addMsgToDb(state, sentVal);
  }).then(resUpd => {
    setSentMsgToRes(state, resUpd);
    renderChatroomMessages(state, messageElement);
  }).catch(err => {
    alert('This chatroom has been deleted');
    console.log(err);
    renderHideMainShowChat(state, $('.main_hide_show'), $('.single_chatroom'));
    mainScreenInit(state, $('.list_chatroom'), $('.category_list'), $('.single_chatroom'));
    // state.sentMessages = [];
    // state.chatId ='';
    // renderChatroomPage(state, $('.conversation'),$('.delete_update'));
  });
}

//////////////////////////////////////////////////////////////
///////////////        State Modification       /////////////
////////////////////////////////////////////////////////////
/*filter chatrooms*/
function filterChatroom(state, category, arr) {
  state.chatroomList = arr;
  state.filterChatroomList = state.chatroomList.filter(el => {
    return el.category === category;
  });
  return state.filterChatroomList;
}

/*set the state to the inital chatroom page state */
function setInitialState(state, res) {
  state.chatId = res.id;
  state.sentMessages = res.messages;
  state.title = res.title;
  state.category = res.category;
}

/*Set state sentMessages to res.messages */
function setSentMsgToRes(state, res) {
  state.sentMessages = res.messages;
}

/*Set state Userid to a random number (user tracker) */
function setUserId(state) {
  state.userId = Math.floor(Math.random() * 100);
}

/*Set state title to res title */
function setStateToUpdTitle(state, res) {
  state.title = res.title;
}

/*Set state category to res category */
function setStateToUpdCat(state, res) {
  state.category = res.category;
}

/*Checks if this screen is main screen or not */
function changeShowHide(state) {
  state.isMainScreen
    ? state.isMainScreen = false
    : state.isMainScreen = true;
  return state;
}

/*Reset state*/
function resetState(state) {
  state.chatId = '';
  state.sentMessages = [];
}
//////////////////////////////////////////////////////////////
///////////////          Render                 /////////////
////////////////////////////////////////////////////////////
/*render the list to show filtered chatrooms or all chatrooms */
function renderChatroomList(state, chatroomElement, chatroomArr) {
  let htmlStr = `<p>Chatroom List</p>
          <ul>`;
  const mappedChat = chatroomArr.map(el => {
    return `<li data-id=${el.id}>${el.title}</li>`;
  }).join('\n\t');
  htmlStr += mappedChat + '</ul>';
  chatroomElement.html(htmlStr);
}

/* renders the distinct category */
function renderCategoryList(state, element) {
  let htmlStr = `<p>Categories</p>
        <ul>`;
  const mappedCategory = state.categoryList.map(el => {
    return `<li>${el}</li>`;
  }).join('\n\t');
  htmlStr += mappedCategory + '</ul>';
  element.html(htmlStr);
}

/*hide and show screens */
function renderHideMainShowChat(state, mainElement, showElement) {
  if (state.isMainScreen) {
    changeShowHide(state);
    mainElement.hide();
    showElement.show();
  } else {
    changeShowHide(state);
    mainElement.show();
    showElement.hide();
  }
}

/*hides chatroom screen*/
function hideChatroom(element) {
  element.hide();
}

/*Initial chatroom messages */
function renderChatroomPage(state, msgElement, titleCatElement) {
  renderChatroomMessages(state, msgElement);
  renderUpdTitleCat(state, titleCatElement);
}

/*render chatroom messages */
function renderChatroomMessages(state, messageElement) {
  let msg;
  if (state.sentMessages.length > 0) {
    msg = state.sentMessages.map(el => {
      return `<li>${el.id}: ${el.message}</li>`;
    }).join('\n');
  }
  messageElement.html(msg);
}

/*rendering the updated title and cat*/
function renderUpdTitleCat(state, titleCatElement) {
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

/*rendering the nav bar so username shows */
// function renderNavBar(state, element){
//   const message = `
//       <li class="nav_el"><a href="mainScreen.html" class="home">Jabber Jam</a></li>
//       <li class="nav_user"><p class="username">${state.userId}</p></li>`;
//   element.html(message);
// }

//////////////////////////////////////////////////////////////
///////////////          Event Listeners        /////////////
////////////////////////////////////////////////////////////
/* creates a chat room in the database */
function createChatroom(state) {
  $('.chatroom_form').on('submit', function(event) {
    event.preventDefault();
    addToData($('.chatroom_form')).then((resQ) => {
      alert(`You have created the chatroom with the title ${resQ.title} and category ${resQ.category}`);
      mainScreenInit(state, $('.list_chatroom'), $('.category_list'), $('.single_chatroom'));
    });
  });
}

/* Show filter chatrooms */
function showFilterChatroom(state) {
  $('.category_list').on('click', 'li', function(event) {
    showFilteredOrAllChatrooms(state, $('.list_chatroom'), $(this));
  });
}

/*show all chatrooms */
function showAllChatrooms(state) {
  $('.category_list').on('click', 'p', function(event) {
    showFilteredOrAllChatrooms(state, $('.list_chatroom'));
  });
}

/*hide mainscreen */
function hideMainScreen(state) {
  $('.list_chatroom').on('click', 'li', function(event) {
    initChatroom(state, $(this));
  });
}

/*update the chatroom message once you click */
function updChatroomMsgClick(state) {
  $('.messages').on('click', '#button', function(event) {
    event.preventDefault();
    setUpdatedMessages(state, $('#text').val(), $('.conversation'));
    $('#text').val('');
  });
}

/*update the chatroom message once you press enter key */
function updChatroomMsgEnter(state) {
  $('.messages').on('keypress', '#text', function(e) {
    var key = e.which;
    if (key === 13) { // the enter key code
      event.preventDefault();
      setUpdatedMessages(state, $('#text').val(), $('.conversation'));
      $('#text').val('');
    }
  });
}

/*update the title once you press enter key */
function
updTitleEnter(state) {
  $('.delete_update').on('keypress', '#updateTitle', function(e) {
    var key = e.which;
    if (key === 13) { // the enter key code
      event.preventDefault();
      setTitleValue(state, $('#updateTitle'), $('.delete_update'));
      $('#updateTitle').val('');
    }
  });
}

/*update the category once you press enter key */
function
updCatEnter(state) {
  $('.delete_update').on('keypress', '#updateCat', function(e) {
    varkey = e.which;
    if (key === 13) { // the enter key codeevent.
      preventDefault();
      setCatValue(state, $('#updateCat'), $('.delete_update'));
      $('#updateCat').val('');
    }
  });
}

/*Delete Chatroom */
function
delChatroom(state) {
  $('.delete_update').on('click', '.deleteChat', function(event) {
    deleteFromDb(state);
  });
}

/*go back to main screen */
function
goBackToMain(state) {
  $('.go_back_to_main').on('click', 'p', function(event) {
    renderHideMainShowChat(state, $('.main_hide_show'), $('.single_chatroom'));
    mainScreenInit(state, $('.list_chatroom'), $('.category_list'), $('.single_chatroom'));
    // state.sentMessages = [];
    // state.chatId ='';
    // renderChatroomPage(state, $('.conversation'),$('.delete_update'));
  });
}

//////////////////////////////////////////////////////////////
///////////////     Grouping EventListeners     /////////////
////////////////////////////////////////////////////////////
/*Initialize the page */
function
initPage(state) {
  mainScreenInit(state, $('.list_chatroom'), $('.category_list'), $('.single_chatroom'));
}

/*Stores all the filter or all chatrooms functions */
function
categoryListStorage(state) {
  showFilterChatroom(state);
  showAllChatrooms(state);
}

/* Stores all the update functions */
function
updateStorage(state) {
  updChatroomMsgClick(state);
  updChatroomMsgEnter(state);
  updTitleEnter(state);
  updCatEnter(state);
}

//////////////////////////////////////////////////////////////
///////////////          Callback Function      /////////////
////////////////////////////////////////////////////////////
/* Callback function after DOM is ready */
$(function() {
  setUserId(appState);
  initPage(appState);
  createChatroom(appState);
  categoryListStorage(appState);
  hideMainScreen(appState);
  updateStorage(appState);
  delChatroom(appState);
  goBackToMain(appState);
  resetState(appState);
});
