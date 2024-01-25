import express from "express";
import createError from "http-errors";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import routes from "./routes/routes.js"; //importing route
/*database*/

// const path = require("path");
// const mongoose = require("mongoose");
// require("./helpers/connections_mongodb");

//csv

const app = express();

dotenv.config();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

console.log("start server api ...");

// Serve static files from the 'client/dist' directory
app.use(express.static('client'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});

app.use("/api", routes);

// Middleware handle 404 Not Found
app.use((req, res, next) => {
  next(createError.NotFound("This route does not exist."));
});

// Middleware handle other errors
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    success: false,
    error: err.message,
  });
});

app.listen(port);

console.log("RESTful API server started on: " + port);
