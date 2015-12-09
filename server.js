var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('db/db.sqlite3');

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var session = require('express-session');

var user = require('./model/user');
var project = require('./model/project');
var team = require('./model/team');

app.use(bodyParser.json());
app.use(session({
  secret: 'super secret',
  name: 'tms_session',
  saveUninitialized: false,
  resave: false
}));

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
// app.use(require('./controllers'));

function handleError(err, res) {
  if (err.type === 'validation') {
    res.status(400).json(err.obj);
  } else {
    res.status(500).json();
    console.error(err);
  }
}

/* Register User */
app.put('/ajax/user', function(req, res) {
  user.create(db, req.body, function(err) {
    if (err) {
      handleError(err, res);
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
  
  user.authenticate(db, req.body, function(err, user) {
    if (err) {
      handleError(err, res);
      return;
    }

    req.session.user = user;
    res.json(user);
  });
});

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('TMS app listening at http://%s:%s', host, port);
});
