'use strict';

app.registerModule(function(E, ajax) {
  var module = {};

  module.display = function(container) {
    Promise.all([
      ajax.get('teams'),
      ajax.get('projects'),
      ajax.get('classes')
    ]).then(function(data) {
      var teams = data[0];
      var projects = data[1];
      var classes = data[2];
      console.log(teams, projects, classes);
    }, function() {
      app.loadModule('login');
    });
  };

  return module;
});
