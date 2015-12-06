'use strict';

app.registerModule(function(E, data) {
  var module = {};

  module.display = function(container) {
    var login = E('div', {
      className: 'form',
      parent: container
    });

    var username = E('input', {
      type: 'text',
      placeholder: 'Username',
      parent: login
    });

    var password = E('input', {
      type: 'password',
      placeholder: 'Password',
      parent: login
    });

    var submit = E('input', {
      type: 'button',
      value: 'Login',
      onclick: function() {
        data.post('login', {
          id: username.value,
          password: password.value
        }).then(function() {
          app.loadModule('register');
        }, function(err) {
          console.log(err);
        });
      },
      parent: login
    });
  }

  return module;
});
