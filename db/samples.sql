/* View all projects that a member can join */
SELECT projects.*
FROM projects, classes, class_members
WHERE
  class_members.member_id = '7238982' AND
  class_members.class_id = classes.id AND
  projects.class_id = classes.id;
