import express from "express";
import VSA_Contrl from "../controllers/VSA_Controller.js";

const SSR_Data = express.Router();

SSR_Data.get("/areaList", VSA_Contrl.listArea)
  .get("/detail/:_area", VSA_Contrl.listBusbar)
  .post("/:_area", VSA_Contrl.detailBusbar)
  .delete(VSA_Contrl.delete);

export default SSR_Data;
