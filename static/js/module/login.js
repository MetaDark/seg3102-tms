'use strict';

app.registerModule(function(E, data) {
  var module = {};

  module.display = function(container) {
    var login = E('div', {
      className: 'form',
      parent: container
    });

    E('h2', {
      textContent: 'Login',
      parent: login
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
          app.loadModule('dashboard');
        }, function(err) {
          var input = null;
          switch (err.param) {
          case 'username':
            input = username;
            break;
          case 'password':
            input = password;
            break;
          }

          if (input) {
            input.classList.add('invalid');
            input.focus();
          }
        });
      },
      parent: login
    });
  }

  return module;
});
