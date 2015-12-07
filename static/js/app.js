'use strict';

var app = (function(window, document, E, ajax) {
  var app = {};
  
  var moduleContainer = null;
  var moduleDefault = 'login';
  var moduleCSS = [];
  var currentModule = null;

  app.start = function() {
    moduleContainer = document.body;

    var hashchange = function() {
      var id = window.location.hash.slice(1);
      app.load(id);
    };
    
    window.addEventListener('hashchange', hashchange, false);
    hashchange();
  };
  
  app.load = function(id) {
    if (!id) id = moduleDefault;
    
    // Cleanup the previous module
    document.body.innerHTML = '';
    moduleCSS.forEach(function(css) {
      document.head.removeChild(css);
    });
    
    moduleCSS = [];

    if (!currentModule) {
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
        E('h1', {
          textContent: 'Page not found!',
          parent: moduleContainer
        });

        if (moduleContainer.animate) {
          moduleContainer.animate([
            {opacity: 0},
            {opacity: 1},
          ], 200);
        }
        
        document.head.removeChild(script);
      }
    });
  };

  app.module = function(register) {
    var module = register(E, ajax);

    var display = function() {
      module.display(moduleContainer);
      if (moduleContainer.animate) {
        moduleContainer.animate([
          {opacity: 0},
          {opacity: 1},
        ], 200);
      }
    };
    
    if (module.css) {
      var numLeft = module.css.length;
      var cssLoaded = function(css, success) {
        if (success) {
          moduleCSS.push(css);
        } else {
          document.head.removeChild(css);
        }
        
        if (--numLeft === 0) {
          display();
        }
      };
      
      module.css.forEach(function(href) {
        var css = E('link', {
          href: href,
          rel: 'stylesheet',
          type: 'text/css',
          parent: document.head,
          onload: function() {
            cssLoaded(css, true);
          },
          onerror: function() {
            cssLoaded(css, false);
          }
        });
      });
    } else {
      display();
    }
    
    currentModule = module;
  };
  
  return app;
})(window, document, E, ajax);
