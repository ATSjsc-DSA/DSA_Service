import express from "express";
import TSA_Contrl from "../controllers/TSA_Controller.js";

const TSA_Data = express.Router();

TSA_Data.get("/sps/:_sps", TSA_Contrl.detailSPS);
TSA_Data.get("/gtth/:_gtth", TSA_Contrl.detailGTTH);
TSA_Data.get("/line/:_lineName", TSA_Contrl.detailLine);
TSA_Data.get("/line", TSA_Contrl.listlLine);

export default TSA_Data;
