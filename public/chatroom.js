'use strict';

(function($) {


  var client = {

    init: function() {
      client.getMessages();
      client.createMessages();
      client.renderRecievedMessages();
      client.renderSentMessages();
      client.watchSubmit();
    },
    //state mod function
    getMessages: function(state) {
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
    },
    createMessages: function(state){
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
    },
    //render function
    renderRecievedMessages: function(state, element){
      client.getMessages(state)
      .then(resM => {
        console.log(resM);
        state.sentMessages = resM.messages;
        console.log(state.sentMessages);
        const message = state.sentMessages.map(el => {
          return `<li>${el}</li>`;
        }).join('\n');
        element.html(message);
      });
    },
    renderSentMessages: function(state, element){
      client.createMessages(state)
      const object = {
        messages:[ ]
      }
    },
    //eventlistener
    watchSubmit: function(){
      $('#button').click( function(event){
        console.log('heyddddd');
        event.preventDefault();
        const message = $('#text').val();
        console.log("from chat",message)
        //renderSentMessages(appState, $('.conversation'));
      })

    }

  };

  $(window).on('load', function() {
    client.renderRecievedMessages(appState, $('.conversation'));
    client.init();

  });

})(window.jQuery);
