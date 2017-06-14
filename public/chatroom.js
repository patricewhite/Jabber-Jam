'use strict';

//state mod function
function getMessages(state){
  return fetch('https://jabber-jam.herokuapp.com/chatrooms', {
    method: 'GET',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': "application/json"
    }),
  })
  then(res => {
    if(!res.ok) {
      return Promise.reject(res.statusText);
    }
    return res.json();
  });
}

// function createMessages(state){
//   return fetch('https://jabber-jam.herokuapp.com/chatrooms/59406dcccb46821720c90b29', {
//     method: 'POST',
//     mode: 'cors',
//     headers: new Headers({
//       'Content-Type': "application/json"
//     }),
//     body: JSON.stringify(object)
//   })
//   then(res => {
//     if(!res.ok) {
//       return Promise.reject(res.statusText);
//     }
//     return res.json();
//   });
// }
//render function
function renderRecievedMessages(state,element){
  getMessages(state)
  .then(resM => {
    const message = state.sentMessages.map(el => {
      return `<li>${el.messages}</li>`;
    }).join('\n');
    element.html(message);
  });
};

// function renderSentMessages(state,element){
//
// }
//eventlistener
function watchSubmit(state){
  $('#button').on('submit', function(event){
    event.preventDefault();
    renderRecievedMessages(appState, $('.conversation'));
  })
}

$(function() {
  renderRecievedMessages(appState, $('.conversation'));
  watchSubmit(appState);
})
