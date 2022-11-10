const jwt = require("jsonwebtoken");

function authUser(req, res, next) {
  if (req.user == null) {
    res.status(401);
    return res.send("You are not a user, you need to log in");
  }

  next();
}

function authRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      res.status(403);
      return res.send("Not enough permissions");
    }

    next();
  };
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    res.status(401);
    return res.send("You need a token for authentication, please log in");
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.status(401);
      return res.send("Authentication failed"); // authentication failed
    }
    // successful authentication
    req.user = user;
    next();
  });
}

module.exports = {
  authUser,
  authRole,
  authenticateToken,
};
