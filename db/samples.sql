/* Set instructor to have same credentials as 7238982  */
UPDATE users
SET
  password = (SELECT password from users WHERE id = '7238982'),
  salt = (SELECT salt from users WHERE id = '7238982')
WHERE id = 'instructor';
