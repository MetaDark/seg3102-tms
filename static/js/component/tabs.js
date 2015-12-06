function Tabs(params) {
  this.elem = E('div', {
    id: params.id,
    className: params.className,
    parent: params.parent
  });

  this.nav = E('ul', {
    className: 'nav nav-tabs',
    parent: this.elem
  });

  this.content = E('div', {
    className: 'tab-content',
    parent: this.elem
  });

  this.active = null;
  this.tabMap = {};
}

Tabs.prototype.add = function(name, content) {
  var tabs = this;

  var elem = E('li', {
    children: [E('a', {
      textContent: name,
      style: {
        cursor: 'pointer'
      },
      onclick: function(e) {
        tabs.focus(name);
        e.preventDefault();
      }
    })],
    parent: this.nav
  });

  var pane = E('div', {
    className: 'tab-pane',
    children: [content],
    parent: this.content
  });

  var tab = {
    elem: elem,
    pane: pane
  };

  this.tabMap[name] = tab;
  if (!this.active) {
    this.focus(name);
  }
};

Tabs.prototype.focus = function(name) {
  var tab = this.tabMap[name];
  if (!tab) return;

  var active = this.active;
  if (active) {
    active.elem.classList.remove('active');
    active.pane.classList.remove('active');
  }

  tab.elem.classList.add('active');
  tab.pane.classList.add('active');
  this.active = tab;
};
