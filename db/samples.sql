/* View all projects that a member can join */
SELECT projects.*
FROM projects, classes, class_members
WHERE
  class_members.member_id = '7238982' AND
  class_members.class_id = classes.id AND
  projects.class_id = classes.id;

/* Set instructor to have same credentials as 7238982  */
UPDATE users
SET
  password = (SELECT password from users WHERE id = '7238982'),
  salt = (SELECT salt from users WHERE id = '7238982')
WHERE id = 'instructor';
