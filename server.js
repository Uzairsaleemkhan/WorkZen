// Imported external and internal modules
const router = require('./routes/index');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app= express();
app.use(bodyParser.json())
app.use(cors());
app.use(router);
module.exports = app;
