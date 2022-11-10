require("dotenv").config();

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { authUser, authRole, authenticateToken } = require("./basicAuth");

const { ROLE, users, projects } = require("./data");
const { scopedProjects } = require("./permissions/project");

app.use(express.json());

app.use(setUser);

// home page for anybody
app.get("/", (req, res) => {
  res.send("Home page for everybody");
});

// get list of posts, for USERS or ADMINS
app.get("/projects", authenticateToken, (req, res) => {
  res.json(projects);
  //res.json(scopedProjects(req.user, projects));
});

// get list of users, for ADMINS only
app.get("/users", authenticateToken, authRole(ROLE.ADMIN), (req, res) => {
  res.json(users);
});

// create a new user
app.post("/register", async (req, res) => {
  // make for admin level authority only
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    console.log(hashedPassword);
    const user = {
      name: req.body.name,
      password: hashedPassword,
      role: req.body.role,
    };
    users.push(user);
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

app.post("/login", async (req, res) => {
  const user = users.find((user) => user.name === req.body.name);
  if (user == null) {
    return res.status(400).send("Cannot find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      // successful login, assign jwt token to user

      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      res.json({ accessToken: accessToken });
      // res.send("Successfully logged in");
    } else {
      res.status(401).send("Authentication failed");
    }
  } catch {
    res.status(500).send();
  }
});

function setUser(req, res, next) {
  const name = req.body.name;
  if (name) {
    req.user = users.find((user) => user.name === name);
  }
  next();
}

app.listen(4000);
