import express from "express";
import DAS_Contrl from "../controllers/DSA_Controller.js";

const DSA_Data = express.Router();

DSA_Data.get("/listSub", DAS_Contrl.detailSubs)
  .get("/listLine", DAS_Contrl.detailLines)
  .get("/dataSub", DAS_Contrl.infoSub)
  .get("/voltageStandards", DAS_Contrl.voltageStandards)
  .get("/lineLoadingStandards", DAS_Contrl.lineLoadingStandards)

  .get("/SSRStandards", DAS_Contrl.ssrStandards);

export default DSA_Data;
