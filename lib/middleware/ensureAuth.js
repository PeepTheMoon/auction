const User = require('../models/User');

//allows us to read the username and password in the url to authorize that the user is in our database and converts the hashed password back into a regular string
const usernameAndPasswordReader = authorization => {
  const [username, password] = Buffer
    .from(authorization.split(' ')[1], 'base64')
    .toString()
    .split(':');

  return {
    username,
    password
  };
};

//takes the username and password from the header, converts it from a hash to an object with just the username and password and sets that to our user so that our user's activity is assigned to them
const ensureAuth = (req, res, next) => {
  const { username, password } = usernameAndPasswordReader(req.headers.authorization);

  User
    .authorized(username, password)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(next);
};

module.exports = {
  usernameAndPasswordReader,
  ensureAuth
};
