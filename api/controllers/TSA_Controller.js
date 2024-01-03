"use strict";
import stripBomStream from "strip-bom-stream";
import fs from "fs";
import csv from "csv-parser";
import resForm from "../../common/response.js";
import createError from "http-errors";

const TSA_Contrl = {
  get: (req, res, next) => {
    res.send("Hello World!");
  },
  detailSPS: async (req, res, next) => {
    const fileName = req.params._sps;
    const csvFilePath = `File/TSA/${fileName}_Check.csv`;

    const resData = {
      name: fileName,
      Key: [],
      Require: [],
      Estimated: [],
    };
    if (fs.existsSync(csvFilePath)) {
      try {
        const dataFile = fs.createReadStream(csvFilePath, "utf8");
        dataFile
          .pipe(stripBomStream())
          .pipe(csv())
          .on("data", (row) => {
            resData.Key.push(row.Ref);
            resData.Require.push(row.Require);
            resData.Estimated.push(row.Estimated);
          })
          .on("end", () => {
            resForm.successRes(res, resData);
          })
          .on("error", (error) => {
            next(createError.Conflict(error.message));
          });
      } catch (error) {
        next(createError.InternalServerError(error.message));
      }
    } else {
      next(createError.NotFound(`File not found: ${fileName}`));
    }
  },

  detailGTTH: async (req, res, next) => {
    const fileName = req.params._gtth;
    const csvFilePath = `File/TSA/${fileName}.csv`;

    const resData = {
      name: fileName,
      Key: [],
      "NhoQuan-HaTinh": [],
      "DaNang-Pleiku": [],
    };
    if (fs.existsSync(csvFilePath)) {
      try {
        const dataFile = fs.createReadStream(csvFilePath, "utf8");
        dataFile
          .pipe(stripBomStream())
          .pipe(csv())
          .on("data", (row) => {
            resData.Key.push(row.Ref);
            resData["NhoQuan-HaTinh"].push(row["NhoQuan-HaTinh"]);
            resData["DaNang-Pleiku"].push(row["DaNang-Pleiku"]);
          })
          .on("end", () => {
            resForm.successRes(res, resData);
          })
          .on("error", (error) => {
            console.log(error, "error");
            next(createError.Conflict(error.message));
          });
      } catch (error) {
        next(createError.InternalServerError(error.message));
      }
    } else {
      console.log("Av");
      next(createError.NotFound(`File not found: ${fileName}`));
    }
  },

  detailLine: async (req, res, next) => {
    const fileName = req.params._lineName;
    const csvFilePath = `File/TSA/chart/${fileName}.csv`;

    const resData = {
      name: fileName,
      time: [],
      value: [],
      PowerTranfer: [],
      peak: [],
      mean: [],
      t_stablility: [],
      stability: [],
    };
    if (fs.existsSync(csvFilePath)) {
      try {
        const dataFile = fs.createReadStream(csvFilePath, "utf8");
        dataFile
          .pipe(stripBomStream())
          .pipe(csv())
          .on("data", (row) => {
            resData.time.push(row.time);
            resData.value.push(row.value);
            resData.PowerTranfer.push(row.PowerTranfer);
            if (row.peak != "") {
              resData.peak.push(row.peak);
              resData.mean.push(row.mean);
              resData.t_stablility.push(row.t_stablility);
              resData.stability.push(row.stability);
            }
          })
          .on("end", () => {
            resForm.successRes(res, resData);
          })
          .on("error", (error) => {
            console.log(error, "error");
            next(createError.Conflict(error.message));
          });
      } catch (error) {
        next(createError.InternalServerError(error.message));
      }
    } else {
      console.log("Av");
      next(createError.NotFound(`File not found: ${fileName}`));
    }
  },

  listlLine: async (req, res, next) => {
    const fileName = req.params._lineName;
    const csvFilePath = `File/TSA/chart/results.csv`;

    const resData = {
      NQHT: [],
      DNPK: [],
    };
    if (fs.existsSync(csvFilePath)) {
      try {
        const dataFile = fs.createReadStream(csvFilePath, "utf8");
        dataFile
          .pipe(stripBomStream())
          .pipe(csv())
          .on("data", (row) => {
            if (row.line === "NhoQuan-HaTinh") {
              resData.NQHT.push({ name: row.Load_scale });
            }
            if (row.line === "DaNang-Pleiku") {
              resData.DNPK.push({ name: row.Load_scale });
            }
          })
          .on("end", () => {
            resForm.successRes(res, resData);
          })
          .on("error", (error) => {
            console.log(error, "error");
            next(createError.Conflict(error.message));
          });
      } catch (error) {
        next(createError.InternalServerError(error.message));
      }
    } else {
      console.log("Av");
      next(createError.NotFound(`File not found: ${fileName}`));
    }
  },
};

export default TSA_Contrl;
