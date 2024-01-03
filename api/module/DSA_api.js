import express from "express";
import DAS_Contrl from "../controllers/DSA_Controller.js";

const DSA_Data = express.Router();

DSA_Data.get("/listSub", DAS_Contrl.detailSubs).get(
  "/listLine",
  DAS_Contrl.detailLines
);

export default DSA_Data;
