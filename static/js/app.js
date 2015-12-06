'use strict';

var app = (function(window, document, E, data) {
  var app = {};
  var defaultModule = 'register';

  app.start = function() {
    function hashchange() {
      var id = window.location.hash.slice(1);
      if (!id) id = defaultModule;
      app.loadModule(id, true);
    }
    
    window.addEventListener('hashchange', hashchange, false);
    hashchange();
  };
  
  app.registerModule = function(register) {
    register(E, data).display(document.body);
  };
  
  app.loadModule = function(id, replace) {
    document.body.innerHTML = '';
    
    if (replace) {
      history.replaceState(null, null, '#' + id);
    } else {
      history.pushState(null, null, '#' + id);
    }
    
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
