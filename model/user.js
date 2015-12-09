var validate = require('../lib/validate');
var crypto = require('crypto');

exports.create = function(db, input, cb) {
  var err = validate(input, {
    id: validate.integer,
    password: validate.string,
    name: validate.string,
    email: validate.email
  });

  if (err) {
    cb({type: 'validation', obj: err});
    return;
  }
  
  var salt = crypto.randomBytes(32);
  var hashedPassword =
        crypto.createHash('sha256')
        .update(input.password + salt)
        .digest('binary');

  var query =
        'INSERT INTO users (id, password, salt, name, email, is_instructor) ' +
        'VALUES ($id, $password, $salt, $name, $email, $is_instructor)';

  db.run(query, {
    $id: input.id,
    $password: hashedPassword,
    $salt: salt,
    $name: input.name,
    $email: input.email,
    $is_instructor: false
  }, function(err) {
    cb({type: 'database', obj: err});
  });
};

exports.authenticate = function(db, input, cb) {
  var err = validate(input, {
    id: validate.integer
  });

  if (err) {
    cb({type: 'validation', obj: err});
    return;
  }
  
  var query = 'SELECT * FROM users WHERE id = $id LIMIT 1';
  
  db.all(query, {
    $id: params.id
  }, function(err, users) {
    if (err) {
      cb({type: 'database', obj: err});
      return;
    }

    if (users.length === 0) {
      cb({type: 'validation', obj: {'id': 'Invalid username'}});
      return;
    }

    var user = users[0];
    var hashedPassword =
          crypto.createHash('sha256')
          .update(params.password + user.salt)
          .digest('binary');

    if (hashedPassword !== user.password) {
      cb({type: 'validation', obj: {'password': 'Incorrect password'}});
      return;
    }

    cb(null, {
      id: user.id,
      name: user.name,
      is_instructor: user.is_instructor
    });
  });
};


// app.put('/ajax/user', function(req, res) {
//   var params = req.body;
//   var invalid = [];
//     if (!params.id)  {
//     invalid.push('id');
//   }

//   if (!params.password)  {
//     invalid.push('password');
//   }

//   if (!params.name)  {
//     invalid.push('name');
//   }

//   if (!params.email)  {
//     invalid.push('email');
//   }

//   if (invalid.length > 0) {
//     res.status(400).json({invalid: invalid});
//     return;
//   }

//   var query =
//         'INSERT INTO users (id, password, salt, name, email, is_instructor) ' +
//         'VALUES ($id, $password, $salt, $name, $email, $is_instructor)';

//   var salt = crypto.randomBytes(32);
//   var hashedPassword =
//         crypto.createHash('sha256')
//         .update(params.password + salt)
//         .digest('binary');

//   db.run(query, {
//     $id: params.id,
//     $password: hashedPassword,
//     $salt: salt,
//     $name: params.name,
//     $email: params.email,
//     $is_instructor: false
//   }, function(err) {
//     if (err) {
//       console.log(err);
//       res.status(500).json();
//       return;
//     }

//     res.json();
//   });
// });


// app.post('/ajax/login', function(req, res) {
//   if (req.session.user) {
//     res.json(req.session.user);
//     return;
//   }

//   var params = req.body;
//   var query = 'SELECT * FROM users WHERE id = $id LIMIT 1';

//   db.all(query, {
//     $id: params.id
//   }, function(err, users) {
//     if (err) {
//       console.log(err);
//       res.status(500).json();
//       return;
//     }

//     if (users.length === 0)  {
//       res.status(400).json({invalid: ['id']});
//       return;
//     }

//     var user = users[0];
//     var hashedPassword =
//           crypto.createHash('sha256')
//           .update(params.password + user.salt)
//           .digest('binary');

//     if (hashedPassword !== user.password) {
//       res.status(400).json({invalid: ['password']});
//       return;
//     }

//     req.session.user = {
//       id: user.id,
//       name: user.name,
//       is_instructor: user.is_instructor
//     };

//     res.json(req.session.user);
//   });
// });

// /* Instructor Logout / Student Logout */
// app.post('/ajax/logout', function(req, res) {
//   req.session.destroy();
//   res.json();
// });
