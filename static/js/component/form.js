function form(params) {
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

    var field = E('input', {
      id: input.id,
      className: ['form-control', input.className],
      type: input.type || 'text',
      placeholder: input.label,
      parent: group,
      onblur: function() {
        group.classList.remove('has-error');
      },
      onkeydown: function(e) {
        var keyCode = e.keyCode;
        if (e.keyCode == 13) {
          var next = inputs[i + 1];
          if (next) {
            next.field.focus();
          } else {
            submit.click();
          }
        }
      }
    });

    inputs.push({
      name: input.name,
      group: group,
      field: field
    });

    inputMap[params.name];
  });

  var submit = E('input', {
    className: 'btn btn-primary btn-block',
    type: 'button',
    value: 'Login',
    parent: form
  });

  var promise = new Promise(function(resolve, reject) {
    submit.onclick = function() {
      var obj = {};
      inputs.forEach(function(input) {
        obj[input.name] = input.field.value;
      });

      data[params.method || 'post'](params.action, obj)
        .then(resolve, function(err) {
          if (!err.invalid) {
            reject(err);
            return;
          }

          var focused = false;
          err.params.forEach(function(param) {
            var input = inputMap[param];
            if (input) {
              input.group.classList.add('has-error');
              if (!focused) {
                input.field.focus();
                focused = true;
              }
            }
          });
        });
    };
  });

  return promise;
}
