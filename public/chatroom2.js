'use strict';

///////////////////////////////////////////////////////////////////////////////
/////////////////////           fetch data functions        //////////////////
/////////////////////////////////////////////////////////////////////////////
/*Get the messages of this chatroom document from the database  */
function getMessages(){
  return fetch('https://jabber-jam.herokuapp.com/chatrooms/59406dcccb46821720c90b29', {
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
    id: '59406dcccb46821720c90b29',
    messages:state.sentMessages
  };
  return fetch('https://jabber-jam.herokuapp.com/chatrooms/59406dcccb46821720c90b29', {
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

///////////////////////////////////////////////////////////////////////////////
/////////////////////           state mod functions         //////////////////
/////////////////////////////////////////////////////////////////////////////
function setSentMsgToRes(state,res){
  state.sentMessages = res.messages;
}

///////////////////////////////////////////////////////////////////////////////
/////////////////////           render function             //////////////////
/////////////////////////////////////////////////////////////////////////////

function renderRecievedMessages(state,element){
  getMessages()
  .then(resM => {
    //console.log(resM);
    setSentMsgToRes(state,resM);
    //console.log(state.sentMessages);
    const message = state.sentMessages.map(el => {
      return `<li>${el}</li>`;
    }).join('\n');
    element.html(message);
  });
}
/* after you send the message, render the chatroom message */
function renderUpdatedMessages(state,sentElement,messageElement){
  addMessagesToDb(state,sentElement.val())
  .then(resUpd=>{
    setSentMsgToRes(state,resUpd);
    const message = state.sentMessages.map(el => {
      return `<li>${el}</li>`;
    }).join('\n');
    messageElement.html(message);   
  });
}

///////////////////////////////////////////////////////////////////////////////
/////////////////////           event listeners             //////////////////
/////////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////////
/////////////////////           callback functions          //////////////////
/////////////////////////////////////////////////////////////////////////////
$(function() {
  renderRecievedMessages(appState, $('.conversation'));
  updChatroomMsgClick(appState);
  updChatroomMsgEnter(appState);
});
