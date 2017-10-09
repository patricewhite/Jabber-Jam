'use strict';
//////////////////////////////////////////////////////////////
///////////////        State Modification    ////////////////
////////////////////////////////////////////////////////////
/*Changes Log In bool*/
function changeToLoginBool(state) {
  state.login = true;
  state.signUp = false;
  return state;
}

/*Changes Sign Up Bool */
function changeToSignUpBool(state) {
  state.login = false;
  state.signUp = true;
  return state;
}

//////////////////////////////////////////////////////////////
///////////////        Helper Functions      ////////////////
////////////////////////////////////////////////////////////
/*Store User Sign Up values */
function storeUserSignUpInfo() {
  const user = {
    username: $('#username').val(),
    password: $('#password').val(),
    firstName: $('#first-name').val(),
    lastName: $('#last-name').val(),
    email: $('#email').val()
  };
  return user;
}

/*Store User Login values */
function storeUserLoginInfo() {
  const user = {
    username: $('#username').val(),
    password: $('#password').val()
  };
  return user;
}

//////////////////////////////////////////////////////////////
///////////////        Fetch                 ////////////////
////////////////////////////////////////////////////////////
/*Fetch call for adding user into the database*/
function addUser(user) {
  return fetch('/users', {
    method: 'POST',
    headers: new Headers({'Content-Type': 'application/json'}),
    body: JSON.stringify(user)
  }).then(res => {
    if (!res.ok) {
      return Promise.reject(res.statusText);
    }
    return res.json();
  });
}

/*Fetch call for checking the user is correct */
function checkUser(user) {
  return fetch('/users', {
    method: 'GET',
    headers: new Headers({'Content-Type': 'application/json'})
  }).then(res => {
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    return res.json();
  }).catch(err => {
    console.error(err);
  });
}

//////////////////////////////////////////////////////////////
///////////////          Render                 /////////////
////////////////////////////////////////////////////////////
/* Renders the login and signup form*/
function render(state, element) {
  let formStr;
  if (state.signUp && state.login === false) {
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
  } else if (state.login && state.signUp === false) {
    formStr = `
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
/*Event Listener for the Log In on the nav bar */
function changeToLogin(state) {
  $('.login').on('click', function(event) {
    changeToLoginBool(state);
    render(state, $('.container'));
  });
}

/*Event Listener for the Sign Up on the nav bar */
function changeToSignUp(state) {
  $('.signup').on('click', function(event) {
    changeToSignUpBool(state);
    render(state, $('.container'));
  });
}

/*Event Listener for the changing to login screen after sign up */
function cLoginAfterSignUp(state) {
  $('.container').on('click', '.js-change-login', function(event) {
    event.preventDefault();
    changeToLoginBool(state);
    const user = storeUserSignUpInfo();
    addUser(user);
    render(state, $('.container'));
  });
}

/*Event Listener submitting the form and changing it to mainscreen */
function loggingIn(state) {
  $('.container').on('submit', '.login_form', function(event) {
    event.preventDefault();
    const user = storeUserLoginInfo();
    checkUser(user);
    render(state, $('.container'));
  });
}

//////////////////////////////////////////////////////////////
///////////////          Callback Function      /////////////
////////////////////////////////////////////////////////////
/* Callback function after DOM is ready */
$(function(event) {
  render(appState, $('.container'));
  changeToLogin(appState);
  changeToSignUp(appState);
  cLoginAfterSignUp(appState);
  loggingIn(appState);
});
