'use strict';

app.registerModule(function(E, data) {
  var module = {};

  module.display = function(container) {
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
          console.log(response);
        }, function(err) {
          console.log('User already exists');
        });
      },
      parent: register
    });
  }

  return module;
});
