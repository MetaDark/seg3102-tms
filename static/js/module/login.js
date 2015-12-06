'use strict';

app.module(function(E, ajax) {
  var module = {};

  module.display = function(container) {
    var loginModal = E('div', {
      className: 'login modal-dialog',
      parent: container
    });

    var modalContent = E('div', {
      className: 'login-content modal-content',
      parent: loginModal,
    });

    var tabs = new Tabs({
      parent: modalContent
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
        then: function() {
          var loadDashbord = function() {
            loginModal.parentElement.removeChild(loginModal);
            app.load('dashboard');
          };

          if (loginModal.animate) {
            var animation = loginModal.animate([
              {opacity: 1, transform: 'translateX(0px)'},
              {opacity: 0, transform: 'translateX(-500px)'},
            ], 150);

            animation.onfinish = function() {
              loadDashbord();
            };
          } else {
            loadDashbord();
          }
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
