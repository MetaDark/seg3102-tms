'use strict';

app.registerModule(function(E, data) {
  var module = {};

  module.display = function(container) {
    Promise.all([
      data.get('teams'),
      data.get('projects'),
      data.get('classes')
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
