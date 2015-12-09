function Alert(params) {
  if (!params) {
    params = {};
  }

  if (params.timeout === true) {
    this.timeout = 1000;
  } else {
    this.timeout = params.timeout;
  }

  this.elem = E('div', {
    className: 'alert alert-' + (params.type || 'success')
  });

  E('button', {
    className: 'close',
    textContent: '×',
    onclick: this.close.bind(this),
    parent: this.elem
  });

  E('p', {
    className: 'message',
    innerHTML: params.message,
    parent: this.elem
  });
}

Alert.prototype.open = function() {
  var alert = this;

  document.body.appendChild(this.elem);
  this.elem.animate([
    {opacity: 0},
    {opacity: 1},
  ], 150).onfinish = function() {
    if (alert.timeout) {
      setTimeout(function() {
        alert.close();
      }, alert.timeout);
    }
  };
};

Alert.prototype.close = function() {
  var alert = this;

  this.elem.animate([
    {opacity: 1, transform: 'scale(1)'},
    {opacity: 1, transform: 'scale(1.1)'},
    {opacity: 0, transform: 'scale(0.3)'},
  ], 150).onfinish = function() {
    var parent = alert.elem.parentElement;
    if (parent) {
      parent.removeChild(alert.elem);
    }
  }
};
