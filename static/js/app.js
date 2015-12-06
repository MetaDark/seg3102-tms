'use strict';

var app = (function(window, document, E, ajax) {
  var app = {};
  
  var moduleContainer = null;
  var moduleDefault = 'login';
  var moduleCSS = [];

  app.start = function() {
    moduleContainer = document.body;
    
    function hashchange() {
      var id = window.location.hash.slice(1);
      app.loadModule(id, true);
    }
    
    window.addEventListener('hashchange', hashchange, false);
    hashchange();
  };
  
  app.loadModule = function(id, replace) {
    if (!id) id = moduleDefault;
    
    // Cleanup the previous module
    document.body.innerHTML = '';
    moduleCSS.forEach(function(css) {
      document.head.removeChild(css);
    });
    
    moduleCSS = [];
    
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
        E('div', {
          textContent: 'Page not found!',
          parent: moduleContainer
        });
        
        document.head.removeChild(script);
      }
    });
  };

  app.registerModule = function(register) {
    var module = register(E, ajax);
    if (module.css) {
      var numLeft = module.css.length;
      function cssLoaded() {
        if (--numLeft === 0) {
          module.display(moduleContainer);
        }
      }
      
      module.css.forEach(function(href) {
        var css = E('link', {
          href: href,
          rel: 'stylesheet',
          type: 'text/css',
          parent: document.head,
          onload: function() {
            moduleCSS.push(css);
            cssLoaded();
          },
          onerror: function() {
            document.head.removeChild(css);
            cssLoaded();
          }
        });
      });
    } else {
      module.display(moduleContainer);
    }
  };
  
  return app;
})(window, document, E, ajax);
