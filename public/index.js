'use strict';

var userLoggedIn;

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  userLoggedIn = gapi.auth2;
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  //window.location.href = "mainScreen.html";
  loadTemplate();
}

function signOut() {
  var auth2 = userLoggedIn.getAuthInstance();
  auth2.signOut().then(function() {
    console.log('User signed out.');
  });
}

function loadTemplate() {
  let target = $(this).data('template');
  $.get('views/mainScreen.html', (data) => {
    $('#t-main_screen').html(data);
  });
}
