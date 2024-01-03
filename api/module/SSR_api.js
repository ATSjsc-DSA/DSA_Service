import express from "express";
import SSR_Contrl from "../controllers/SSR_Controller.js";

const SSR_Data = express.Router();

SSR_Data.get("/:_genName", SSR_Contrl.detail)
  .get("", SSR_Contrl.list)
  .put(SSR_Contrl.update)
  .delete(SSR_Contrl.delete);

export default SSR_Data;

