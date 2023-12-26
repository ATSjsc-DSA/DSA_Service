"use strict";

const express = require("express");
const router = express.Router();
const DAS_Data = require("../api/module/DSA_api");

router.use("/dsa", DAS_Data);

module.exports = router;
