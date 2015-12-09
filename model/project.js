// /* Create Project */
// app.put('/ajax/project', function(req, res) {
//   if (!req.session.user) {
//     res.status(401).json();
//     return;
//   }

//   var params = req.body;
//   var invalid = [];

//   if (!params.name)  {
//     invalid.push('name');
//   }

//   if (!params.min_team_size) {
//     invalid.push('min_team_size');
//   }

//   if (!params.max_team_size) {
//     invalid.push('max_team_size');
//   }

//   if (invalid.length > 0) {
//     res.status(400).json({invalid: invalid});
//     return;
//   }

//   // TODO: Validate that the user has permissions to create projects
//   var query =
//         'INSERT INTO projects ' +
//         '(name, description, min_team_size, max_team_size, class_id)' +
//         'VALUES($name, $description, $min_team_size, $max_team_size, $class_id)';

//   db.run(query, {
//     $name: params.name,
//     $description: params.description,
//     $min_team_size: params.min_team_size,
//     $max_team_size: params.max_team_size,
//     $class_id: 'SEG3102A'
//   }, function(err) {
//     if (err) {
//       console.log(err);
//       res.status(500).json();
//       return;
//     }

//     res.json();
//   });
// });

// /* Edit Project */
// app.post('/ajax/project', function(req, res) {
//   if (!req.session.user) {
//     res.status(401).json();
//     return;
//   }

//   var params = req.body;
//   var invalid = [];

//   if (!params.id) {
//     invalid.push('id');
//   }

//   if (!params.name) {
//     invalid.push('name');
//   }

//   if (!params.min_team_size) {
//     invalid.push('min_team_size');
//   }

//   if (!params.max_team_size) {
//     invalid.push('max_team_size');
//   }

//   if (invalid.length > 0) {
//     res.status(400).json({invalid: invalid});
//     return;
//   }

//   // TODO: Validate that the user has permissions to edit the project
//   var query =
//         'UPDATE projects SET ' +
//         'name=$name,' +
//         'description=$description,' +
//         'min_team_size=$min_team_size,' +
//         'max_team_size=$max_team_size ' +
//         'WHERE id = $id';

//   db.run(query, {
//     $id: params.id,
//     $name: params.name,
//     $description: params.description,
//     $min_team_size: params.min_team_size,
//     $max_team_size: params.max_team_size
//   }, function(err) {
//     if (err) {
//       console.log(err);
//       res.status(500).json();
//       return;
//     }

//     res.json();
//   });
// });

// app.delete('/ajax/project', function(req, res) {
//   if (!req.session.user) {
//     res.status(401).json();
//     return;
//   }

//   var params = req.body;
//   var invalid = [];

//   if (!params.id) {
//     invalid.push('id');
//   }

//   if (invalid.length > 0) {
//     res.status(400).json({invalid: invalid});
//     return;
//   }

//   // TODO: Validate that the user has permissions to delete the project
//   var query = 'DELETE FROM projects WHERE id = $id';
//   db.run(query, {
//     $id: params.id
//   }, function(err) {
//     if (err) {
//       console.log(err);
//       res.status(500).json();
//       return;
//     }

//     res.json();
//   });
// });

// /* List instructor's projects */
// app.get('/ajax/projects/mine', function(req, res) {
//   if (!req.session.user) {
//     res.status(401).json();
//     return;
//   }

//   if (!req.session.user.is_instructor) {
//     res.status(403).json();
//     return;
//   }

//   var query =
//         'SELECT projects.* ' +
//         'FROM projects, classes WHERE ' +
//         'classes.instructor_id = $user_id AND ' +
//         'classes.id = projects.class_id';

//   db.all(query, {
//     $user_id: req.session.user.id
//   }, function(err, projects) {
//     if (err) {
//       console.log(err);
//       res.status(500).json();
//       return;
//     }

//     res.json(projects);
//   });
// });

// /* List projects available to a student */
// app.get('/ajax/projects/available', function(req, res) {
//   if (!req.session.user) {
//     res.status(401).json();
//     return;
//   }

//   var query =
//         'SELECT projects.* ' +
//         'FROM projects, class_members WHERE ' +
//         'class_members.member_id = $user_id AND ' +
//         'class_members.class_id = projects.class_id';

//   db.all(query, function(err, projects) {
//     if (err) {
//       console.log(err);
//       res.status(500).json();
//       return;
//     }

//     res.json(projects);
//   });
// });
