'use strict';

//////////////////////////////////////////////////////////////
///////////////        Fetch                 ////////////////
////////////////////////////////////////////////////////////
function addUser(user){

  //console.log('bbb', user);
  return fetch('http://localhost:8080/users', {
    method: 'POST',
    mode:'cors',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(user)
  })
  .then(res => {
    if(!res.ok){
      return Promise.reject(res.statusText);
    }
    return res.json();
  });
}


function checkUser(){
  return fetch('http://localhost:8080/users', {
    method: 'GET',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
    .then(res => {
      if(!res.ok){
        return Promise.reject(res.statusText);
      }
      return res.json();
    });
  };


//////////////////////////////////////////////////////////////
///////////////        State Modification       /////////////
////////////////////////////////////////////////////////////
function findUser(state, username){
  state.users.find(usr => {
    return usr.username === username;
  });
}
//////////////////////////////////////////////////////////////
///////////////          Render                 /////////////
////////////////////////////////////////////////////////////
function renderUserCheck(state, user){
  getUserData(state)
  .then(resU => {
    let usersArr;
    if(!user){
      alert("Incorrect usernname");
    }else{
      usersArr = findUser(state, user.text())
    }
  });
}

function render(state,element){
  let formStr;
  if(state.signUp && state.login ===false){
    formStr = `
    <form class="signup_form"action="index.html">
        <fieldset name="signup">
          <legend class="signup_legend">Sign Up</legend>
          <label for="first-name">First Name</label>
          <input type="text" placeholder="Chris" id="first-name" name="first-name"/>
          <label for="last-name">Last Name</label>
          <input type="text" placeholder="Klanac" id="last-name" name="last-name"/>
          <label for="username">Username</label>
          <input type="text" placeholder="hiChris" id="username" name="username" required/>
          <label for="password">Password</label>
          <input type="password" placeholder="password" id="password" name="password" required/>
          <label for="email">Email</label>
          <input type="email" placeholder="hiChris@gmail.com" id="email" name="email" required/>
        </fieldset>
        <button class="js-change-login" type='submit'>Sign Up</button>
      </form>`;
  }else if(state.login && state.signUp === false){
    formStr =`
      <form class="login_form" action="mainScreen.html">
        <fieldset name="login">
          <legend class="login_legend">Login</legend>
          <label for="username">Username</label>
          <input type="text" placeholder="hiChris" id="username" name="username" required/>
          <label for="password">Password</label>
          <input type="password" placeholder="password" id="password" name="password" required/>
        </fieldset>
        <button id='logIn' type='submit'>Login</button>
      </form>`;
  }
  element.html(formStr);
}
//////////////////////////////////////////////////////////////
///////////////          Event Listeners        /////////////
////////////////////////////////////////////////////////////
function changeToLogin(state){
  $('.login').on('click',function(event){
    state.login = true;
    state.signUp = false;
    render(state,$('.container'));
  });
}

function changeToSignUp(state){
  $('.signup').on('click',function(event){
    state.login = false;
    state.signUp = true;
    render(state,$('.container'));
  });
}

function cLoginAfterSignUp(state){
  $('.container').on('click','.js-change-login',function(event){
    event.preventDefault();
    const user = {};
    state.login = true;
    state.signUp = false;
    user['username'] = $('#username').val();
    user['password'] = $('#password').val();
    user['firstName'] = $('#first-name').val();
    user['lastName'] = $('#last-name').val();
    user['email'] = $('#email').val();
    addUser(user);
    console.log('aaaa', user);
    render(state,$('.container'));
  });
}

function loggingIn(state){
  $('.container').on('submit', '#logIn', function(event){
    event.preventDefault();
    const usr = {};
    usr['username'] = $('#username').val();
    usr['password'] = $('#password').val();
    console.log(usr);
    renderUserCheck(state)
    //hit datbase when clikcing button
    //re-check auth page on thinkful 


  })
}
//////////////////////////////////////////////////////////////
///////////////          Callback Function      /////////////
////////////////////////////////////////////////////////////
$(function(event){
  render(appState, $('.container'));
  changeToLogin(appState);
  changeToSignUp(appState);
  cLoginAfterSignUp(appState);
  loggingIn(appState);
});
