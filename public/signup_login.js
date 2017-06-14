'use strict';

//////////////////////////////////////////////////////////////
///////////////        State Modification       /////////////
////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////
///////////////          Render                 /////////////
////////////////////////////////////////////////////////////
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
      <form class="login_form" method="post" action="mainScreen.html">
        <fieldset name="login">
          <legend class="login_legend">Login</legend>
          <label for="username">Username</label>
          <input type="text" placeholder="hiChris" id="username" name="username" required/>
          <label for="password">Password</label>
          <input type="password" placeholder="password" id="password" name="password" required/>
        </fieldset>
        <button type='submit'>Login</button>
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
    state.login = true;
    state.signUp = false;
    render(state,$('.container'));
  });
}
//////////////////////////////////////////////////////////////
///////////////          Callback Function      /////////////
////////////////////////////////////////////////////////////
$(function(event){
  render(appState, $('.container'));
  changeToLogin(appState);
  changeToSignUp(appState);
  cLoginAfterSignUp(appState);
});
