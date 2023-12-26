"use strict";
const fs = require("fs");
const csv = require("csv-parser");
// const util = require("util");
// const mysql = require("mysql");
// const db = require("./../db");

// const table = "products";

module.exports = {
  get: (req, res) => {
    res.send("Hello World!");
  },
  detail: (req, res) => {
    const results = [];
    console.log("../../File");
    fs.createReadStream("File/products-10-rows.csv")
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        res.json(results);
      });
  },
  update: (req, res) => {
    res.send("Hello update!");
  },
  store: (req, res) => {
    res.send("Hello store!");
  },
  delete: (req, res) => {
    res.send("Hello delete!");
  },
};
