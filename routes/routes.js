"use strict";
import express from "express";
import SSR_Data from "../api/module/SSR_api.js";
import DSA_Data from "../api/module/DSA_api.js";
import TSA_Data from "../api/module/TSA_api.js";
const routes = express.Router();

routes.use("/ssr", SSR_Data);
routes.use("/tsa", TSA_Data);
routes.use("/dsa", DSA_Data);

export default routes;
