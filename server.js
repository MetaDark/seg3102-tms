// TODO: Refactor, this file is starting to get pretty large

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

app.use(express.static(__dirname + '/public'));
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
        'INSERT INTO users (id, password, salt, name, email, is_instructor) ' +
        'VALUES ($id, $password, $salt, $name, $email, $is_instructor)';

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
    $email: params.email,
    $is_instructor: false
  }, function(err) {
    if (err) {
      console.log(err);
      res.status(500).json();
      return;
    }

    res.json();
  });
});

/* Instructor Login / Student Login */
app.post('/ajax/login', function(req, res) {
  if (req.session.user) {
    res.json(req.session.user);  
    return;
  }
  
  var params = req.body;
  var query = 'SELECT * FROM users WHERE id = $id LIMIT 1';
  
  db.all(query, {
    $id: params.id
  }, function(err, users) {
    if (err) {
      console.log(err);
      res.status(500).json();
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

    req.session.user = {
      id: user.id,
      name: user.name,
      is_instructor: user.is_instructor
    };
    
    res.json(req.session.user);
  });
});

/* Instructor Logout / Student Logout */
app.post('/ajax/logout', function(req, res) {
  req.session.destroy();
  res.json();
});

/* Create Project */
app.put('/ajax/project', function(req, res) {
  if (!req.session.user) {
    res.status(401).json();
    return;
  }

  var params = req.body;
  var invalid = [];

  if (!params.name)  {
    invalid.push('name');
  }

  if (!params.min_team_size) {
    invalid.push('min_team_size');
  }

  if (!params.max_team_size) {
    invalid.push('max_team_size');
  }

  if (invalid.length > 0) {
    res.status(400).json({invalid: invalid});
    return;
  }

  // TODO: Validate that the user has permissions to create projects
  var query =
        'INSERT INTO projects ' +
        '(name, description, min_team_size, max_team_size)' +
        'VALUES($name, $description, $min_team_size, $max_team_size)';

  db.run(query, {
    $name: params.name,
    $description: params.description,
    $min_team_size: params.min_team_size,
    $max_team_size: params.max_team_size
  }, function(err) {
    if (err) {
      console.log(err);
      res.status(500).json();
      return;
    }

    res.json();
  });
});

/* Edit Project */
app.post('/ajax/project', function(req, res) {
  if (!req.session.user) {
    res.status(401).json();
    return;
  }

  var params = req.body;
  var invalid = [];

  if (!params.id) {
    invalid.push('id');
  }
  
  if (!params.name) {
    invalid.push('name');
  }

  if (!params.min_team_size) {
    invalid.push('min_team_size');
  }

  if (!params.max_team_size) {
    invalid.push('max_team_size');
  }

  if (invalid.length > 0) {
    res.status(400).json({invalid: invalid});
    return;
  }

  // TODO: Validate that the user has permissions to edit the project
  var query =
        'UPDATE projects SET ' +
        'name=$name,' +
        'description=$description,' +
        'min_team_size=$min_team_size,' +
        'max_team_size=$max_team_size ' +
        'WHERE id = $id';

  db.run(query, {
    $id: params.id,
    $name: params.name,
    $description: params.description,
    $min_team_size: params.min_team_size,
    $max_team_size: params.max_team_size
  }, function(err) {
    if (err) {
      console.log(err);
      res.status(500).json();
      return;
    }

    res.json();
  });
});

/* Delete Project */
app.delete('/ajax/project', function(req, res) {
  if (!req.session.user) {
    res.status(401).json();
    return;
  }

  var params = req.body;
  var invalid = [];

  if (!params.id) {
    invalid.push('id');
  }

  if (invalid.length > 0) {
    res.status(400).json({invalid: invalid});
    return;
  }

  // TODO: Validate that the user has permissions to delete the project
  var query = 'DELETE FROM projects WHERE id = $id';
  db.run(query, {
    $id: params.id
  }, function(err) {
    if (err) {
      console.log(err);
      res.status(500).json();
      return;
    }

    res.json();
  });
});

/* List projects */
app.get('/ajax/projects', function(req, res) {
  if (!req.session.user) {
    res.status(401).json();
    return;
  }

  var query = 'SELECT * FROM projects';
  db.all(query, function(err, projects) {
    if (err) {
      console.log(err);
      res.status(500).json();
      return;
    }

    res.json(projects);
  });
});

/* Create Team */
app.put('/ajax/team', function(req, res) {
  if (!req.session.user) {
    res.status(401).json();
    return;
  }

  var params = req.body;
  var invalid = [];

  if (!params.name)  {
    invalid.push('name');
  }

  if (!params.project_id)  {
    invalid.push('project_id');
  }

  if (invalid.length > 0) {
    res.status(400).json({invalid: invalid});
    return;
  }

  // TODO: Validate that the user has permissions to create teams
  var query =
        'INSERT INTO teams ' +
        '(name, project_id, liason_id)' +
        'VALUES($name, $project_id, $liason_id)';

  db.run(query, {
    $name: params.name,
    $project_id: params.project_id,
    $liason_id: req.session.user.id
  }, function(err) {
    if (err) {
      console.log(err);
      res.status(500).json();
      return;
    }

    res.json();
  });
});

/* Edit Team */
app.post('/ajax/team', function(req, res) {
  if (!req.session.user) {
    res.status(401).json();
    return;
  }

  var params = req.body;
  var invalid = [];

  if (!params.id) {
    invalid.push('id');
  }

  if (!params.name)  {
    invalid.push('name');
  }

  if (invalid.length > 0) {
    res.status(400).json({invalid: invalid});
    return;
  }

  // TODO: Validate that the user has permissions to edit the team
  var query =
        'UPDATE teams SET name=$name ' +
        'WHERE id = $id';

  db.run(query, {
    $id: params.id,
    $name: params.name
  }, function(err) {
    if (err) {
      console.log(err);
      res.status(500).json();
      return;
    }

    res.json();
  });
});

/* Delete Team */
app.delete('/ajax/team', function(req, res) {
  if (!req.session.user) {
    res.status(401).json();
    return;
  }

  var params = req.body;
  var invalid = [];

  if (!params.id) {
    invalid.push('id');
  }

  if (invalid.length > 0) {
    res.status(400).json({invalid: invalid});
    return;
  }

  // TODO: Validate that the user has permissions to delete the team
  var query = 'DELETE FROM teams WHERE id = $id';
  db.run(query, {
    $id: params.id
  }, function(err) {
    if (err) {
      console.log(err);
      res.status(500).json();
      return;
    }

    res.json();
  });
});

/* List Teams in a project */
app.get('/ajax/teams/project', function(req, res) {
  if (!req.session.user) {
    res.status(401).json();
    return;
  }

  var params = req.query;
  var invalid = [];

  if (!params.project_id)  {
    invalid.push('project_id');
  }

  if (invalid.length > 0) {
    res.status(400).json({invalid: invalid});
    return;
  }
  
  var query = 'SELECT * FROM teams WHERE project_id = $project_id';
  
  db.all(query, {
    $project_id: params.project_id,
  }, function(err, teams) {
    if (err) {
      console.log(err);
      res.status(500).json();
      return;
    }

    // Obtain each of the team members within each team
    var subquery =
          'SELECT users.id, users.name ' +
          'FROM team_members, users WHERE ' +
          'team_members.team_id = $team_id AND ' +
          'team_members.member_id = users.id';
    
    if (teams.length === 0) {
      res.json(teams);
    } else {
      var teamsLeft = teams.length;
      teams.forEach(function(team) {
        db.all(subquery, {
          $team_id: team.id
        }, function(err, members) {
          if (err) {
            console.log(err);
            res.status(500).json();
            return;
          }

          team.members = members;
          if (--teamsLeft === 0) {
            res.json(teams);
          }
        });
      });
    }
  });
});

/* Join Team */
app.put('/ajax/team_member', function(req, res) {
  if (!req.session.user) {
    res.status(401).json();
    return;
  }

  var params = req.body;
  var invalid = [];

  if (!params.team_id)  {
    invalid.push('team_id');
  }

  if (invalid.length > 0) {
    res.status(400).json({invalid: invalid});
    return;
  }

  db.serialize(function() {
    var input = {
      $team_id: params.team_id,
      $user_id: req.session.user.id
    };

    // Remove user from any previous teams
    var deleteQuery =
          'DELETE FROM team_members WHERE ' +
          'team_id = $team_id AND ' +
          'member_id = $user_id';
    
    db.run(deleteQuery, input, function(err) {
      if (err) {
        console.log(err);
        res.status(500).json();
        return;
      }
    });

    // Add them to the new team
    var addQuery =
          'INSERT INTO team_members ' +
          '(team_id, member_id, accepted) ' +
          'VALUES($team_id, $user_id, 0)';

    db.run(addQuery, input, function(err) {
      if (err) {
        console.log(err);
        res.status(500).json();
        return;
      }

      res.json();
    })
  });
});

/* Approve a member to join a team */
app.post('/ajax/team_member/approve', function(req, res) {
  if (!req.session.user) {
    res.status(401).json();
    return;
  }

  // TODO: Validate that the user has permissions to approve a team member
  var query =
        'UPDATE team_members SET accepted=1 ' +
        'WHERE id = $id';

  db.run(query, {
    $id: params.id
  }, function(err) {
    if (err) {
      console.log(err);
      res.status(500).json();
      return;
    }

    res.json();
  });
});

/* Leave Team */
app.delete('/ajax/team_member', function(req, res) {
  if (!req.session.user) {
    res.status(401).json();
    return;
  }

  var params = req.body;
  var invalid = [];

  if (!params.team_id)  {
    invalid.push('team_id');
  }

  if (invalid.length > 0) {
    res.status(400).json({invalid: invalid});
    return;
  }

  // TODO: Validate that the user has permissions to leave a team
  var query =
        'DELETE FROM team_members WHERE ' +
        'team_id = $team_id AND ' +
        'member_id = $user_id';

  db.run(query, {
    $team_id: params.team_id,
    $user_id: req.session.user.id
  }, function(err) {
    if (err) {
      console.log(err);
      res.status(500).json();
      return;
    }

    res.json();
  });
});

// Enable foreign keys on all all transactions
db.run('PRAGMA foreign_keys = ON', function(err) {
  if (err) {
    console.log(err);
    return;
  }
});

// Start the server
var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('TMS app listening at http://%s:%s', host, port);
});
