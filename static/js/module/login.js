'use strict';

app.module(function(E, ajax) {
  var module = {};

  module.display = function(container) {
    form({
      action: 'login',
      method: 'post',
      title: 'Login',
      inputs: [{
        param: 'id',
        label: 'Username'
      }, {
        param: 'password',
        label: 'Password'
      }],
      submit: {
        label: 'Login'
      },
      parent: container
    }).then(function() {
      app.load('dashboard');
    });

    form({
      action: 'user',
      method: 'put',
      title: 'Register',
      inputs: [{
        param: 'id',
        label: 'Username'
      }, {
        param: 'password',
        label: 'Password',
        type: 'password',
      }, {
        param: 'name',
        label: 'Name'
      }, {
        param: 'email',
        label: 'Email'
      }],
      submit: {
        label: 'Login'
      },
      parent: container
    }).then(function() {
      console.log('register');
    });
  }

  return module;
});
