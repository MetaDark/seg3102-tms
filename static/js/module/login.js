'use strict';

app.module(function(E, ajax) {
  var module = {
    css: ['css/module/login.css']
  };

  module.display = function(container) {
    var floatingBox = E('div', {
      className: 'floating-box',
      parent: container
    });

    var modal = E('div', {
      className: 'login modal-dialog',
      parent: floatingBox
    });

    E('h2', {
      className: 'login-title',
      textContent: 'TMS',
      parent: modal
    });

    var content = E('div', {
      className: 'login-content modal-content',
      parent: modal,
    });

    var tabs = new Tabs({
      parent: content
    });

    var login = form({
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
        then: function(user) {
          app.user = user;
          modal.animate([
            {transform: 'translateX(0px)'},
            {transform: 'translateX(-500px)'},
          ], 150).onfinish = function() {
            modal.parentElement.removeChild(modal);
            app.load('dashboard');
          };
        }
      }
    });

    tabs.add('Login', login);

    var register = form({
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
        label: 'Register',
        then: function() {
          tabs.focus('Login');
        }
      }
    });

    tabs.add('Register', register);
  }

  return module;
});
