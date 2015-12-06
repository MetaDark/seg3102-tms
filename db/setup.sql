/* == Database Schema == */
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id text PRIMARY KEY,
  password blob NOT NULL,
  salt blob NOT NULL,
  name text NOT NULL,
  email text NOT NULL UNIQUE);

DROP TABLE IF EXISTS classes;
CREATE TABLE classes (
  id text NOT NULL PRIMARY KEY,
  instructor_id text NOT NULL,
  name text NOT NULL,
  FOREIGN KEY(instructor_id) REFERENCES users(id));

DROP TABLE IF EXISTS class_members;
CREATE TABLE class_members (
  class_id text NOT NULL,
  member_id text NOT NULL,
  UNIQUE(class_id, member_id),
  FOREIGN KEY(class_id) REFERENCES classes(id),
  FOREIGN KEY(member_id) REFERENCES users(id));

DROP TABLE IF EXISTS projects;
CREATE TABLE projects (
  id integer NOT NULL PRIMARY KEY,
  name text NOT NULL,
  class_id text NOT NULL,
  FOREIGN KEY(class_id) REFERENCES classes(id));

DROP TABLE IF EXISTS teams;
CREATE TABLE teams (
  id integer NOT NULL PRIMARY KEY,
  name text NOT NULL,
  project_id integer NOT NULL,
  liason_id text NOT NULL,
  FOREIGN KEY(project_id) REFERENCES projects(id),
  FOREIGN KEY(liason_id) REFERENCES users(id));

DROP TABLE IF EXISTS team_members;
CREATE TABLE team_members (
  team_id integer NOT NULL,
  member_id text NOT NULL,
  UNIQUE(team_id, member_id),
  FOREIGN KEY(team_id) REFERENCES teams(id),
  FOREIGN KEY(member_id) REFERENCES users(id));

/* == Dummy Data == */
INSERT INTO users (id, password, salt, name, email)
    VALUES('instructor', '', '', 'Instructor', 'instructor@uottawa.ca');

INSERT INTO classes (id, instructor_id, name)
    VALUES('SEG3102A', 'instructor', 'SEG3102 Software Design and Architecture');

INSERT INTO projects (name, class_id)
    VALUES('TMS', 'SEG3102A');

INSERT INTO users (id, password, salt, name, email)
    VALUES('7238982', '', '', 'Kurt Bruneau', 'kbrun08@uottawa.ca');

INSERT INTO class_members (class_id, member_id)
    VALUES('SEG3102A', '7238982');
