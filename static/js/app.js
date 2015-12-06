'use strict';

var app = (function(window, document, E, data) {
  var app = {};

  app.start = function() {
    var id = window.location.hash.slice(1);
    if (!id) {
      id = 'login';
    }

    app.loadModule(id);
  };
  
  app.registerModule = function(register) {
    document.body.innerHTML = '';
    register(E, data).display(document.body);
  };

  app.loadModule = function(id) {
    var script = E('script', {
      src: 'js/module/' + id + '.js',
      type: 'text/javascript',
      parent: document.head,
      onload: function() {
        document.head.removeChild(script);
      },
      onerror: function() {
        document.head.removeChild(script);
      }
    });
  };
  
  return app;
})(window, document, element.html, data);
