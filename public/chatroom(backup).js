'use strict';

//state mod function
function getMessages(state){
  return fetch('https://jabber-jam.herokuapp.com/chatrooms/59406dcccb46821720c90b29', {
    method: 'GET',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': "application/json"
    }),
  })
  .then(res => {
    if(!res.ok) {
      return Promise.reject(res.statusText);
    }
    return res.json();
  });
}

function createMessages(state){
  return fetch('https://jabber-jam.herokuapp.com/chatrooms/59406dcccb46821720c90b29', {
    method: 'POST',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': "application/json"
    }),
    body: JSON.stringify(object)
  })
  then(res => {
    if(!res.ok) {
      return Promise.reject(res.statusText);
    }
    return res.json();
  });
}
//render function
function renderRecievedMessages(state,element){
  getMessages(state)
  .then(resM => {
    console.log(resM);
    state.sentMessages = resM.messages;
    console.log(state.sentMessages);
    const message = state.sentMessages.map(el => {
      return `<li>${el}</li>`;
    }).join('\n');
    element.html(message);
  });
};

function renderSentMessages(state,element){
createMessages(state)
const object = {
  messages:[ ]
}

}

//eventlistener
function watchSubmit(){
  console.log('heyddddd');
  $('#button').on('submit', function(event){
    console.log('heyddddd');
    event.preventDefault();
    const message = $('#text').val();
    console.log("from chat",message)
    //renderSentMessages(appState, $('.conversation'));
  })
}

$(function() {
  renderRecievedMessages(appState, $('.conversation'));
  watchSubmit();
})
