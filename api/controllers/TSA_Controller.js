"use strict";
import stripBomStream from "strip-bom-stream";
import fs from "fs";
import csv from "csv-parser";
import resForm from "../../common/response.js";
import createError from "http-errors";
import getFileModificationTimeUtc from "../../common/fileHandler.js";

const TSA_Contrl = {
  get: (req, res, next) => {
    res.send("Hello World!");
  },
  detailSPS: async (req, res, next) => {
    const fileName = req.params._sps;
    const csvFilePath = `File/TSA/${fileName}_Check.csv`;
    if (!fs.existsSync(csvFilePath)) {
      return next(createError.NotFound("File not found"));
    }
    const resData = {
      name: fileName,
      Key: [],
      data: {
        Require: [],
        Estimated: [],
      },
      modificationTime: null,
    };

    if (fs.existsSync(csvFilePath)) {
      try {
        resData.modificationTime = await getFileModificationTimeUtc(
          csvFilePath
        );

        const dataFile = fs.createReadStream(csvFilePath, "utf8");
        dataFile
          .pipe(stripBomStream())
          .pipe(csv())
          .on("data", (row) => {
            if (fileName === "PowerTransfer") {
              if (row.Estimated > 0) {
                resData.Key.push(row.Ref);
                resData.data.Require.push(row.Require);
                resData.data.Estimated.push(row.Estimated);
              }
            } else {
              resData.Key.push(row.Ref);
              resData.data.Require.push(row.Require);
              resData.data.Estimated.push(row.Estimated);
            }
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

  detailTTTG: async (req, res, next) => {
    const lineName = req.params._line;
    const csvFilePath = `File/TSA/TransferCapacity.csv`;
    if (!fs.existsSync(csvFilePath)) {
      return next(createError.NotFound("File not found"));
    }
    const resData = {
      name: lineName,
      Key: [],
      data: {
        value: [],
      },
      modificationTime: 0,
    };
    if (fs.existsSync(csvFilePath)) {
      try {
        resData.modificationTime = await getFileModificationTimeUtc(
          csvFilePath
        );
        const dataFile = fs.createReadStream(csvFilePath, "utf8");
        dataFile
          .pipe(stripBomStream())
          .pipe(csv())
          .on("data", (row) => {
            resData.Key.push(row.Ref);
            resData.data.value.push(row[lineName]);
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
      next(createError.NotFound(`File not found: ${fileName}`));
    }
  },
  listTypeLine: async (req, res, next) => {
    const csvFilePath = `File/TSA/TransferCapacity.csv`;
    if (!fs.existsSync(csvFilePath)) {
      return next(createError.NotFound("File not found"));
    }
    let resData = [];
    if (fs.existsSync(csvFilePath)) {
      try {
        const dataFile = fs.createReadStream(csvFilePath, "utf8");
        dataFile
          .pipe(stripBomStream())
          .pipe(csv())
          .on("headers", (headers) => {
            if (headers.length > 0) {
              headers.shift();
            }
            headers.forEach((element) => {
              resData.push({ name: element });
            });
          })
          .on("data", (data) => {})
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
      next(createError.NotFound(`File not found`));
    }
  },

  detailLine: async (req, res, next) => {
    const fileName = req.params._lineName;
    const csvFilePath = `File/TSA/chart/${fileName}.csv`;
    if (!fs.existsSync(csvFilePath)) {
      return next(createError.NotFound("File not found"));
    }
    const resData = {
      name: fileName,
      data: {
        time: [],
        value: [],
        PowerTranfer: [],
        peak: [],
        mean: [],
        t_stablility: [],
        stability: [],
      },
      modificationTime: null,
    };
    if (fs.existsSync(csvFilePath)) {
      try {
        resData.modificationTime = await getFileModificationTimeUtc(
          csvFilePath
        );
        const dataFile = fs.createReadStream(csvFilePath, "utf8");
        dataFile
          .pipe(stripBomStream())
          .pipe(csv())
          .on("data", (row) => {
            resData.data.time.push(row.time);
            resData.data.value.push(row.value);
            resData.data.PowerTranfer.push(row.PowerTranfer);
            if (row.peak != "") {
              resData.data.peak.push(row.peak);
              resData.data.mean.push(row.mean);
              resData.data.t_stablility.push(row.t_stablility);
              resData.data.stability.push(row.stability);
            }
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

  listlLine: async (req, res, next) => {
    const fileName = req.params._lineName;
    const csvFilePath = `File/TSA/chart/results.csv`;
    if (!fs.existsSync(csvFilePath)) {
      return next(createError.NotFound("File not found"));
    }
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
            next(createError.Conflict(error.message));
          });
      } catch (error) {
        next(createError.InternalServerError(error.message));
      }
    } else {
      next(createError.NotFound(`File not found: ${fileName}`));
    }
  },
};

export default TSA_Contrl;
