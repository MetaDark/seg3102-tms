'use strict';

app.module(function(E, ajax) {
  var module = {};

  module.display = function(container) {
    var login = form({
      title: 'Login',
      action: 'login',
      method: 'post',
      inputs: [{
        param: 'id',
        label: 'Username'
      }, {
        param: 'password',
        label: 'Password',
        type: 'password'
      }],
      submit: {
        label: 'Login',
        then: function() {
          app.load('dashboard');
        }
      },
      parent: container
    });

    var register = form({
      title: 'Register',
      action: 'user',
      method: 'put',
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
        label: 'Register'
      },
      parent: container
    });
  }

  return module;
});
