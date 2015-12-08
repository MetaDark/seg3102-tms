var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('db/db.sqlite3');

var crypto = require('crypto');
var session = require('express-session');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(session({
  secret: 'super secret',
  name: 'tms_session',
  saveUninitialized: false,
  resave: false
}));

app.use(express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));

/* Register User */
app.put('/ajax/user', function(req, res) {
  var params = req.body;
  var invalid = [];
  if (!params.id)  {
    invalid.push('id');
  }

  if (!params.password)  {
    invalid.push('password');
  }

  if (!params.name)  {
    invalid.push('name');
  }

  if (!params.email)  {
    invalid.push('email');
  }

  if (invalid.length > 0) {
    res.status(400).json({invalid: invalid});
    return;
  }
  
  var query =
        'INSERT INTO users (id, password, salt, name, email) ' +
        'VALUES ($id, $password, $salt, $name, $email)';

  var salt = crypto.randomBytes(32);
  var hashedPassword =
        crypto.createHash('sha256')
        .update(params.password + salt)
        .digest('binary');
  
  db.run(query, {
    $id: params.id,
    $password: hashedPassword,
    $salt: salt,
    $name: params.name,
    $email: params.email
  }, function(err) {
    if (err) {
      res.status(500).json(err);
      return;
    }

    res.json();
  });
});

/* Instructor Login / Student Login */
app.post('/ajax/login', function(req, res) {
  // Temporary hack to always login as me
  // req.session.userId = '7238982';
  // res.json();
  // retur;n
  
  var params = req.body;
  var query = 'SELECT id, password, salt FROM users WHERE id = $id';
  db.all(query, {
    $id: params.id
  }, function(err, users) {
    if (err) {
      res.status(500).json(err);
      return;
    }

    if (users.length === 0)  {
      res.status(400).json({invalid: ['id']});
      return;
    }

    var user = users[0];
    var hashedPassword =
          crypto.createHash('sha256')
          .update(params.password + user.salt)
          .digest('binary');

    if (hashedPassword !== user.password) {
      res.status(400).json({invalid: ['password']});
      return;
    }

    req.session.userId = user.id;
    res.json();
  });
});

/* Instructor Logout / Student Logout */
app.post('/ajax/logout', function(req, res) {
  req.session.destroy();
  res.json();
});

/* Obtain list of classes that user is a member of */
app.get('/ajax/classes', function(req, res) {
  if (!req.session.userId) {
    res.status(401).json();
    return;
  }

  var query =
        'SELECT classes.* ' +
        'FROM classes, class_members WHERE ' +
        'class_members.member_id = $user_id AND ' +
        'class_members.class_id = classes.id';

  db.all(query, {
    $user_id: req.session.userId
  }, function(err, classes) {
    if (err) {
      res.status(500).json(err);
      return;
    }

    res.json(classes);
  });
});

/* Create Project */
app.put('/ajax/project', function(req, res) {
  if (!req.session.userId) {
    res.status(401).json();
    return;
  }

  var params = req.body;
  var invalid = [];

  if (!params.name)  {
    invalid.push('name');
  }

  if (!params.minTeamSize) {
    invalid.push('minTeamSize');
  }

  if (!params.maxTeamSize) {
    invalid.push('maxTeamSize');
  }

  if (invalid.length > 0) {
    res.status(400).json({invalid: invalid});
    return;
  }
  
  var query =
        'INSERT INTO projects ' +
        '(name, description, min_team_size, max_team_size, class_id)' +
        'VALUES($name, $description, $min_team_size, $max_team_size, $class_id)';

  db.run(query, {
    $name: params.name,
    $description: params.description,
    $min_team_size: params.minTeamSize,
    $max_team_size: params.maxTeamSize,
    $class_id: 'SEG3102A'
  }, function(err, classes) {
    if (err) {
      console.log(err);
      res.status(500).json(err);
      return;
    }

    res.json();
  });
});

/* Edit Project */
app.post('/ajax/project', function(req, res) {
  if (!req.session.userId) {
    res.status(401).json();
    return;
  }

  res.send('Edit project');
});

/* List projects */
app.get('/ajax/projects', function(req, res) {
  if (!req.session.userId) {
    res.status(401).json();
    return;
  }

  var query =
        'SELECT projects.* ' +
        'FROM projects, classes WHERE ' +
        'classes.instructor_id = $user_id AND ' +
        'classes.id = projects.class_id';

  db.all(query, {
    $user_id: req.session.userId
  }, function(err, classes) {
    if (err) {
      res.status(500).json(err);
      return;
    }

    res.json(classes);
  });
});

/* Create Team */
app.put('/ajax/team', function(req, res) {
  if (!req.session.userId) {
    res.status(401).json();
    return;
  }

  res.send('Team created');
});

/* Edit Team */
app.post('/ajax/team', function(req, res) {
  if (!req.session.userId) {
    res.status(401).json();
    return;
  }

  res.send('Edit team');
});

/* Join Team */
app.post('/ajax/team/join', function(req, res) {
  if (!req.session.userId) {
    res.status(401).json();
    return;
  }

  res.send('Joined Team');
});

/* Leave Team */
app.post('/ajax/team/leave', function(req, res) {
  if (!req.session.userId) {
    res.status(401).json();
    return;
  }
  
  res.send('Left Team');
});

/* List Teams */
app.get('/ajax/teams', function(req, res) {
  if (!req.session.userId) {
    res.status(401).json();
    return;
  }

  var query =
        'SELECT teams.* ' +
        'FROM teams, team_members WHERE ' +
        'team_members.member_id = $user_id AND ' +
        'team_members.team_id = teams.id';

  db.all(query, {
    $user_id: req.session.userId
  }, function(err, classes) {
    if (err) {
      res.status(500).json(err);
      return;
    }

    res.json(classes);
  });
});

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('TMS app listening at http://%s:%s', host, port);
});
