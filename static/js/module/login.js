'use strict';

app.registerModule(function(E, data) {
  var module = {};

  function login(container) {
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

    return login;
  }

  function register(container) {
    var register = E('div', {
      className: 'form',
      parent: container
    });

    E('h2', {
      textContent: 'Register',
      parent: register
    });

    var username = E('input', {
      type: 'text',
      placeholder: 'Username',
      parent: register
    });

    var password = E('input', {
      type: 'password',
      placeholder: 'Password',
      parent: register
    });

    var name = E('input', {
      type: 'text',
      placeholder: 'Name',
      parent: register
    });

    var email = E('input', {
      type: 'text',
      placeholder: 'Email',
      parent: register
    });

    var submit = E('input', {
      type: 'button',
      value: 'Register',
      onclick: function() {
        data.put('user', {
          id: username.value,
          password: password.value,
          name: name.value,
          email: email.value
        }).then(function(response) {
          console.log('switch to login');
        });
      },
      parent: register
    });

    return register;
  };

  module.display = function(container) {
    login(container);
    register(container);
  }

  return module;
});
