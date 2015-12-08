function form(params) {
  if (!params.defaults) {
    params.defaults = {};
  }

  var form = E('div', {
    id: params.id,
    className: ['form', params.className],
    parent: params.parent
  });

  if (params.title) {
    E('h3', {
      textContent: params.title,
      parent: form
    });
  }

  var inputs = [];
  var inputMap = {};
  params.inputs.forEach(function(input, i) {
    var group = E('div', {
      className: 'form-group',
      parent: form
    });

    var value = params.defaults[input.param];

    var elem;
    switch(input.type) {
    case 'textarea':
      elem = E('textarea', {
        textContent: value
      });
      break;
    default:
      elem = E('input', {
        type: input.type,
        value: value
      });
      break;
    }

    elem.className = 'form-control';
    elem.placeholder = input.label;

    elem.onblur = function() {
      group.classList.remove('has-error');
    };

    elem.onkeydown = function(e) {
      var keyCode = e.keyCode;
      if (e.keyCode == 13) {
        var next = inputs[i + 1];
        if (next) {
          next.elem.focus();
        } else {
          submit.click();
        }
      }
    };

    group.appendChild(elem);

    var obj = {
      param: input.param,
      group: group,
      elem: elem
    };

    inputs.push(obj);
    inputMap[input.param] = obj;
  });

  var submit = E('input', {
    id: params.submit.id,
    className: ['btn btn-primary btn-block',
                params.submit.className],
    type: 'button',
    value: params.submit.label,
    onclick: function() {
      var data = {};
      inputs.forEach(function(input) {
        data[input.param] = input.elem.value;
      });

      ajax[params.method || 'post'](params.action, data)
        .then(params.submit.then, function(err) {
          var invalid = err.invalid;
          if (!invalid) {
            if (params.catch) {
              params.catch(err);
            }
            return;
          }

          var focused = false;
          invalid.forEach(function(param) {
            var input = inputMap[param];
            if (input) {
              input.group.classList.add('has-error');
              if (!focused) {
                input.elem.focus();
                focused = true;
              }
            }
          });
        });
    },
    parent: form
  });

  return form;
}
