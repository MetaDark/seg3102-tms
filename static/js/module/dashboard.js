'use strict';

app.module(function(E, ajax) {
  var module = {
    css: ['css/module/dashboard.css']
  };

  module.display = function(container) {
    navbar(container);

    var body = E('div', {
      className: 'modal-body',
      parent: container
    });

    ajax.get('classes').then(function(classes) {
      classes.push(classes[0]);
      classes.forEach(function (clas) {
        var panel = E('div', {
          className: 'panel panel-primary',
          parent: body
        });

        E('div', {
          className: 'panel-heading',
          children: [E('h2', {
            className: 'panel-title',
            textContent: clas.id + ' - ' + clas.instructor_id
          })],
          parent: panel
        })

        E('div', {
          className: 'panel-body',
          textContent: 'test',
          parent: panel
        });
      });
    });
  };

  function navbar(container) {
    var navbar = E('nav', {
      className: 'navbar navbar-inverse',
      parent: container
    });

    var header = E('div', {
      className: 'navbar-header',
      children: [E('div', {
        className: 'navbar-brand',
        textContent: 'TMS'
      })],
      parent: navbar
    });

    var collapse = E('div', {
      className: 'collapse navbar-collapse',
      parent: navbar
    });

    var nav = E('ul', {
      className: 'nav navbar-nav',
      parent: collapse
    });

    E('li', {
      className: 'active',
      children: [E('a', {
        href: '#projects',
        textContent: 'Projects'
      })],
      parent: nav
    });

    var controls = E('ul', {
      className: 'nav navbar-nav navbar-right',
      parent: collapse
    });

    E('li', {
      children: [E('div',  {
        className: 'btn btn-default',
        textContent: 'Logout',
        style: {
          marginTop: '15px',
          marginRight: '15px'
        },
        onclick: function() {
          ajax.post('logout').then(function() {
            app.load('login');
          });
        }
      })],
      parent: controls
    });
  }

  return module;
});
