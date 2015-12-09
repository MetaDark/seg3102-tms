/* == Database Schema == */
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id text PRIMARY KEY,
  password blob NOT NULL,
  salt blob NOT NULL,
  name text NOT NULL,
  is_instructor bit NOT NULL,
  email text NOT NULL UNIQUE);

DROP TABLE IF EXISTS projects;
CREATE TABLE projects (
  id integer NOT NULL PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  min_team_size integer NOT NULL,
  max_team_size integer NOT NULL);

DROP TABLE IF EXISTS teams;
CREATE TABLE teams (
  id integer NOT NULL PRIMARY KEY,
  name text NOT NULL,
  project_id integer NOT NULL,
  liason_id text NOT NULL,
  FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY(liason_id) REFERENCES users(id) ON DELETE CASCADE);

DROP TABLE IF EXISTS team_members;
CREATE TABLE team_members (
  team_id integer NOT NULL,
  member_id text NOT NULL,
  accepted bit NOT NULL,
  UNIQUE(team_id, member_id),
  FOREIGN KEY(team_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY(member_id) REFERENCES users(id) ON DELETE CASCADE);

/* == Dummy Data == */
INSERT INTO users (id, password, salt, name, email, is_instructor)
    VALUES('instructor', '', '', 'Instructor', 'instructor@uottawa.ca', 1);
