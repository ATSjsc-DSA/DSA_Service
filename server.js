const express = require("express");
const createError = require("http-errors");
const cors = require("cors");

/*database*/

// const path = require("path");
// const mongoose = require("mongoose");
// require("./helpers/connections_mongodb");

//csv

const app = express();
const bodyParser = require("body-parser");
require("dotenv").load();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

console.log("start server api ...");

const routes = require("./routes/routes"); //importing route
app.use("/api", routes);

// Middleware handle 404 Not Found
app.use((req, res, next) => {
  next(createError.NotFound("This route does not exist."));
});

// Middleware handle other error
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    success: false,
    error: err.message,
  });
});

app.listen(port);

console.log("RESTful API server started on: " + port);
