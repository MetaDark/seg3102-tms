'use strict';

app.module(function(E, ajax) {
  var module = {};

  module.display = function(container) {
    var box = E('div', {
      className: 'box',
      parent: container
    });

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
          var loadDashbord = function() {
            box.parentElement.removeChild(box);
            app.load('dashboard');
          };

          if (box.animate) {
            var animation = box.animate([
              {opacity: 1, transform: 'translateX(0px)'},
              {opacity: 0, transform: 'translateX(-500px)'},
            ], 200);

            animation.onfinish = function() {
              loadDashbord();
            };
          } else {
            loadDashbord();
          }
        }
      },
      parent: box
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
      parent: box
    });
  }

  return module;
});
