// /* Obtain list of classes that user is a member of */
// app.get('/ajax/classes', function(req, res) {
//   if (!req.session.user) {
//     res.status(401).json();
//     return;
//   }

//   var query =
//         'SELECT classes.* ' +
//         'FROM classes, class_members WHERE ' +
//         'class_members.member_id = $user_id AND ' +
//         'class_members.class_id = classes.id';

//   db.all(query, {
//     $user_id: req.session.user.id
//   }, function(err, classes) {
//     if (err) {
//       console.log(err);
//       res.status(500).json();
//       return;
//     }

//     res.json(classes);
//   });
// });
