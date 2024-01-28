// Imported external and internal modules
const route = require('./route/index.js');
const express = require("express");
const cors = require("cors");
const app= express();
app.use(cors());
app.use(route);
app.listen(5000,()=>{
    console.log('app is running')
});


/*
Authentication Routes:

User Registration:
POST /api/register


User Login:
POST /api/login


User Logout:
POST /api/logout




Project Routes:

Create Project:
POST /api/projects


Get All Projects:
GET /api/projects


Get Project by ID:
GET /api/projects/:projectId


Update Project:
PUT /api/projects/:projectId


Delete Project:
DELETE /api/projects/:projectId


Task Routes:


Create Task:
POST /api/projects/:projectId/tasks


Get All Tasks for a Project:
GET /api/projects/:projectId/tasks


Get Task by ID:
GET /api/projects/:projectId/tasks/:taskId


Update Task:
PUT /api/projects/:projectId/tasks/:taskId


Delete Task:
DELETE /api/projects/:projectId/tasks/:taskId

User Roles Routes:


Assign User to Project:
POST /api/projects/:projectId/users/:userId



Remove User from Project:
DELETE /api/projects/:projectId/users/:userId


Update User Role in Project:
PUT /api/projects/:projectId/users/:userId/role



Miscellaneous Routes:


Get User Profile:
GET /api/users/:userId


Update User Profile:
PUT /api/users/:userId


Change Password:
PUT /api/users/:userId/change-password


Forgot Password (if needed):
POST /api/forgot-password


Reset Password (if needed):
POST /api/reset-password
*/