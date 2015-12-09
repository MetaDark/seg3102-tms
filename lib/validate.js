exports.validate = function(input, validation) {
  var errors = {};
  for (key in validation) {
    var error = validation[key](input[key]);
    if (error) {
      errors[key] = error;
    }
  }

  return errors;
}

exports.integer = function(value) {
  var test =
        typeof value === "number" &&
        isFinite(value) &&
        Math.floor(value) === value;

  if (!test) {
    'Expected integer'
  }
};

exports.string = function(value) {
  if (typeof value !== 'string') {
    return 'Expected string';
  }
};

exports.email = exports.string;
