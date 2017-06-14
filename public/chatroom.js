'use strict';

//state mod function
function getMessages(state){
  return fetch('https://jabber-jam.herokuapp.com/chatrooms'), {
    method: 'GET',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': "application/json"
    })
  })
  then(res => {
    if(!res.ok) {
      return Promise.reject(res.statusText);
    }
    return res.json();
  });
}

//render function
function renderMessages(state,element){
  getMessages(state)
  .then(resM => {
    state.sentMessages
  })
}
