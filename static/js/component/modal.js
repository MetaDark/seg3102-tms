function Modal(params) {
  this.elem = E('div', {
    className: 'modal-dialog',
  });

  this.content = E('div', {
    className: 'modal-content',
    parent: this.elem,
  });

  this.header = E('div', {
    className: 'modal-header',
    parent: this.content
  });

  E('button', {
    className: 'close',
    textContent: '×',
    onclick: this.close.bind(this),
    parent: this.header
  });

  if (params.title) {
    E('h4', {
      className: 'modal-title',
      textContent: params.title,
      parent: this.header
    });
  }

  this.body = E('div', {
    className: 'modal-body',
    parent: this.content
  });
}

Modal.prototype.open = function() {
  document.body.appendChild(this.elem);
  if (this.elem.animate) {
    this.elem.animate([
      {opacity: 0},
      {opacity: 1},
    ], 150);
  }
};

Modal.prototype.close = function() {
  var modal = this;
  var close = function() {
    document.body.removeChild(modal.elem);
  };

  if (this.elem.animate) {
    var animation = this.elem.animate([
      {opacity: 1, transform: 'scale(1)'},
      {opacity: 1, transform: 'scale(1.1)'},
      {opacity: 0, transform: 'scale(0.3)'},
    ], 150);

    animation.onfinish = function() {
      close();
    };
  } else {
    close();
  }
};