'use strict';

//////////////////////////////////////////////////////////////
///////////////          Helper Functions       /////////////
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

//////////////////////////////////////////////////////////////
///////////////        State Modification       /////////////
////////////////////////////////////////////////////////////
function getDataChatroom(state){

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

//////////////////////////////////////////////////////////////
///////////////          Render                 /////////////
////////////////////////////////////////////////////////////
function render(){

}

function renderChatroomList(state,element){
  getDataChatroom(state)
  .then(resQ=>{
    state.chatroomList = resQ;
    let htmlStr = `<p>Chatroom List</p>
          <ul>`;
    const mappedChat = state.chatroomList.map(el=>{
      return `<li><a href="chatroom.html" class="chatroom_link">${el.title}</a></li>`;
    }).join('\n\t');

    htmlStr += mappedChat + `</ul>`;
    element.html(htmlStr);
  });
}
//////////////////////////////////////////////////////////////
///////////////          Event Listeners        /////////////
////////////////////////////////////////////////////////////
function createChatroom(state){
  $('.chatroom_form').on('submit',function(event){
    event.preventDefault();
    addToData($('.chatroom_form'))
    .then((resQ)=>{
      alert(`You have created the chatroom with the title ${resQ.title} and category ${resQ.category}`);
      renderChatroomList(state,$('.list_chatroom'));
    });
  });
}

//////////////////////////////////////////////////////////////
///////////////          Callback Function      /////////////
////////////////////////////////////////////////////////////
$(function(){
  renderChatroomList(appState, $('.list_chatroom'));
  createChatroom(appState);
});