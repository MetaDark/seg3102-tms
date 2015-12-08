function Modal(params) {
  var modal = this;

  this.elem = E('div', {
    className: 'floating-box'
  });

  this.dialog = E('div', {
    className: 'modal-dialog',
    parent: this.elem
  });

  this.content = E('div', {
    className: 'modal-content',
    parent: this.dialog,
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

  this.keydown = function(e) {
    var keyCode = e.keyCode;
    if (keyCode == 27) {
      modal.close();
      e.preventDefault();
      e.stopPropagation();
    }
  };
}

Modal.prototype.open = function() {
  document.body.appendChild(this.elem);
  window.addEventListener('keydown', this.keydown, false);
  this.dialog.animate([
    {opacity: 0},
    {opacity: 1},
  ], 150);
};

Modal.prototype.close = function() {
  var modal = this;

  this.dialog.animate([
    {opacity: 1, transform: 'scale(1)'},
    {opacity: 1, transform: 'scale(1.1)'},
    {opacity: 0, transform: 'scale(0.3)'},
  ], 150).onfinish = function() {
    document.body.removeChild(modal.elem);
  }

  window.removeEventListener('keydown', this.keydown);
};
