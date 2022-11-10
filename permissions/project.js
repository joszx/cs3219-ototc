const { ROLE } = require("../data");

// admins can view all projects, while normal users can only view projects with their name
function scopedProjects(user, projects) {
  if (user.role === ROLE.ADMIN) {
    return projects;
  } else {
    return projects.filter((project) => project.name === user.name);
  }
}

// for GET request for a specific project
// use this to check if user is admin, or if the project is under the user's name
function canViewProject(user, project) {
  return user.role === ROLE.ADMIN || project.name === user.name;
}

// for DELETE request for a specific project
// use this to limit only users can delete their own projects, not even admin can delete other peoples projects
function canDeleteProject(user, project) {
  return project.name === user.name;
}

module.exports = {
  scopedProjects,
};
