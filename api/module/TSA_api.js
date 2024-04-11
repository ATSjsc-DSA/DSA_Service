import express from "express";
import TSA_Contrl from "../controllers/TSA_Controller.js";

const TSA_Data = express.Router();

TSA_Data.get("/sps/:_sps", TSA_Contrl.detailSPS);
TSA_Data.get("/tttg/TransferCapacity/:_line", TSA_Contrl.detailTTTG);
TSA_Data.get("/tttg/TransferCapacity", TSA_Contrl.transferCapacity);
TSA_Data.get("/tttg/listTypeLine", TSA_Contrl.listTypeLine);
TSA_Data.get("/line/:_lineName", TSA_Contrl.detailLine);
TSA_Data.get("/listLine/:_typeLine", TSA_Contrl.listlLineWithType);

export default TSA_Data;
