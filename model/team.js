// /* Create Team */
// app.put('/ajax/team', function(req, res) {
//   if (!req.session.user) {
//     res.status(401).json();
//     return;
//   }

//   if (!req.session.user) {
//     res.status(401).json();
//     return;
//   }

//   var params = req.body;
//   var invalid = [];

//   if (!params.name)  {
//     invalid.push('name');
//   }

//   if (!params.project_id)  {
//     invalid.push('project_id');
//   }

//   if (invalid.length > 0) {
//     res.status(400).json({invalid: invalid});
//     return;
//   }

//   var query =
//         'INSERT INTO teams ' +
//         '(name, project_id, liason_id)' +
//         'VALUES($name, $project_id, $liason_id)';

//   db.run(query, {
//     $name: params.name,
//     $project_id: params.project_id,
//     $liason_id: req.session.user.id
//   }, function(err) {
//     if (err) {
//       console.log(err);
//       res.status(500).json();
//       return;
//     }

//     res.json();
//   });
// });

// /* Edit Team */
// app.post('/ajax/team', function(req, res) {
//   if (!req.session.user) {
//     res.status(401).json();
//     return;
//   }

//   res.send('Edit team');
// });

// /* Join Team */
// app.post('/ajax/team/join', function(req, res) {
//   if (!req.session.user) {
//     res.status(401).json();
//     return;
//   }

//   res.send('Joined Team');
// });

// /* Leave Team */
// app.post('/ajax/team/leave', function(req, res) {
//   if (!req.session.user) {
//     res.status(401).json();
//     return;
//   }

//   res.send('Left Team');
// });

// /* List Teams */
// app.get('/ajax/teams', function(req, res) {
//   if (!req.session.user) {
//     res.status(401).json();
//     return;
//   }

//   var query =
//         'SELECT teams.* ' +
//         'FROM teams, team_members WHERE ' +
//         'team_members.member_id = $user_id AND ' +
//         'team_members.team_id = teams.id';

//   db.all(query, {
//     $user_id: req.session.user.id
//   }, function(err, teams) {
//     if (err) {
//       console.log(err);
//       res.status(500).json();
//       return;
//     }

//     res.json(teams);
//   });
// });
