const express = require("express");
const router = express.Router();
const DAS_Contrl = require("../controllers/DSA_Controller");

router
  .get("", DAS_Contrl.detail)
  .put(DAS_Contrl.update)
  .delete(DAS_Contrl.delete);

module.exports = router;
