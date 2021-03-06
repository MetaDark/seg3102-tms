'use strict';

var app = (function(window, document, E, ajax) {
  var app = {};

  var moduleContainer = null;
  var moduleDefault = 'login';
  var currentModule = null;

  app.start = function() {
    moduleContainer = E('div', {
      className: 'module-container',
      parent: document.body
    });

    // Handle hash changes
    var hashchange = function() {
      var id = window.location.hash.slice(1);
      app.load(id);
    };
    
    window.addEventListener('hashchange', hashchange, false);

    // Handle ajax errors
    ajax.onerror = function(xhr) {
      if (xhr.status === 401) {
        delete app.user;
        app.load('login');
        new Alert({
          message: 'Your session has expired',
          type: 'info'
        }).open();
      } else if (xhr.status !== 400) {
        new Alert({
          message: xhr.status + ' Error!',
          type: 'danger'
        }).open();
      }
    };

    // Authenticate the user, otherwise redirect to login module
    ajax.post('login').then(function(user) {
      app.user = user;
      hashchange();
    }, function() {
      app.load('login'); 
    });
  };
  
  app.load = function(id) {
    if (!id) id = moduleDefault;

    var load = function() {
      var lastModule = currentModule;
      currentModule = {
        id: id,
        obj: null,
        css: []
      };
      
      if (lastModule) {
        // Cleanup last module
        moduleContainer.innerHTML = '';
        lastModule.css.forEach(function(css) {
          document.head.removeChild(css);
        });
        
        history.pushState(null, null, '#' + id);
      } else {
        history.replaceState(null, null, '#' + id);
      }
      
      var script = E('script', {
        src: 'js/module/' + id + '.js',
        type: 'text/javascript',
        parent: document.head,
        onload: function() {
          document.head.removeChild(this);
          this.onload = false;
        },
        onerror: function() {
          E('h1', {
            textContent: 'Page not found!',
            parent: moduleContainer
          });

          moduleContainer.animate([
            {opacity: 0},
            {opacity: 1},
          ], 150);
          
          document.head.removeChild(this);
          this.onerror = false;
        }
      });
    };
    
    if (currentModule) {
      moduleContainer.animate([
        {opacity: 1},
        {opacity: 0},
      ], 150).onfinish = function() {
        load();
      };
    } else {
      load();
    }
  };

  app.reload = function() {
    app.load(currentModule.id);
  };

  app.module = function(register) {
    var module = register(E, ajax);

    var display = function() {
      module.display(moduleContainer);
      moduleContainer.animate([
        {opacity: 0},
        {opacity: 1},
      ], 150);
    };
    
    if (module.css) {
      var numLeft = module.css.length;
      var cssLoaded = function(css, success) {
        if (success) {
          currentModule.css.push(css);
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
            cssLoaded(this, true);
            this.onload = null;
          },
          onerror: function() {
            cssLoaded(this, false);
            this.onerror = null;
          }
        });
      });
    } else {
      display();
    }
    
    currentModule.obj = module;
  };
  
  return app;
})(window, document, E, ajax);
