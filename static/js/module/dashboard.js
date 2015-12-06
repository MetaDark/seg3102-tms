'use strict';

app.module(function(E, ajax) {
  var module = {};

  module.display = function(container) {
    var dashboardModal = E('div', {
      className: 'dashboard modal-dialog',
      parent: container
    });

    var modalContent = E('div', {
      className: 'dashboard-content modal-content',
      parent: dashboardModal,
    });

    ajax.get('classes').then(function(classes) {
      classes.forEach(function (clas) {
        E('div', {
          textContent: clas.name + ' - ' + clas.instructor_id,
          parent: modalContent
        });
      });
    });
  };

  return module;
});
