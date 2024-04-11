"use strict";
import stripBomStream from "strip-bom-stream";
import fs from "fs";
import csv from "csv-parser";
import resForm from "../../common/response.js";
import createError from "http-errors";
import getFileModificationTimeUtc from "../../common/fileHandler.js";

const processCsvFile = async (filePath, lineName, resData) => {
  if (fs.existsSync(filePath)) {
    const dataFile = fs.createReadStream(filePath, "utf8");
    await new Promise((resolve, reject) => {
      dataFile
        .pipe(stripBomStream())
        .pipe(csv())
        .on("data", (row) => {
          resData.Key.push(row.Ref);
          resData.data.value.push(parseFloat(row[lineName]));
        })
        .on("end", resolve)
        .on("error", reject);
    });
  }
};

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
    const baseFilePath = "File/TSA/";
    const csvFilePath = `${baseFilePath}TransferCapacity.csv`;
    const csvFileCurrentPath = `${baseFilePath}TransferCurrent.csv`;

    try {
      const filesExist = [csvFilePath, csvFileCurrentPath].every((filePath) =>
        fs.existsSync(filePath)
      );

      if (!filesExist) {
        return next(createError.NotFound("File not found"));
      }

      const resData = {
        name: lineName,
        Key: [],
        data: { value: [] },
        modificationTime: 0,
      };

      resData.modificationTime = await getFileModificationTimeUtc(csvFilePath);

      await processCsvFile(csvFilePath, lineName, resData);
      await processCsvFile(csvFileCurrentPath, lineName, resData);

      resForm.successRes(res, resData);
    } catch (error) {
      next(createError.InternalServerError(error.message));
    }
  },
  transferCapacity: async (req, res, next) => {
    const lineName = req.params._line;
    const baseFilePath = "File/TSA/";
    const csvFilePath = `${baseFilePath}TransferCapacity.csv`;

    try {
      if (!fs.existsSync(csvFilePath)) {
        return next(createError.NotFound("File not found"));
      }

      const resData = {
        zone1: {
          curent: "",
          pv: "",
          tsat: "",
        },
        zone2: { curent: "", pv: "", tsat: "" },
      };

      const dataFile = fs.createReadStream(csvFilePath, "utf8");
      dataFile
        .pipe(stripBomStream())
        .pipe(csv())
        .on("data", (row) => {
          if (row.Ref === "Current") {
            resData.zone1.curent = parseFloat(row["Area1-Area2"]);
            resData.zone2.curent = parseFloat(row["Area2-Area3"]);
          }
          if (row.Ref === "PV_Limitation") {
            resData.zone1.pv = parseFloat(row["Area1-Area2"]);
            resData.zone2.pv = parseFloat(row["Area2-Area3"]);
          }
          if (row.Ref === "TSAT_Limitation") {
            resData.zone1.tsat = parseFloat(row["Area1-Area2"]);
            resData.zone2.tsat = parseFloat(row["Area2-Area3"]);
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
  },
  listTypeLine: async (req, res, next) => {
    const csvFilePath = `File/TSA/TransferCapacity.csv`;
    if (!fs.existsSync(csvFilePath)) {
      return next(createError.NotFound("File not found"));
    }
    let resData = [];
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
          next(createError.Conflict(error.message));
        });
    } catch (error) {
      next(createError.InternalServerError(error.message));
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
            resData.data.time.push(parseFloat(row.time));
            resData.data.value.push(parseFloat(row.value));
            resData.data.PowerTranfer.push(parseFloat(row.PowerTranfer));
            if (row.peak != "") {
              resData.data.peak.push(parseFloat(row.peak));
              resData.data.mean.push(parseFloat(row.mean));
              resData.data.t_stablility.push(parseFloat(row.t_stablility));
              resData.data.stability.push(parseFloat(row.stability));
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

  listlLineWithType: async (req, res, next) => {
    const csvFilePath = `File/TSA/chart/results.csv`;
    if (!fs.existsSync(csvFilePath)) {
      return next(createError.NotFound("File not found"));
    }
    try {
      const typeLine = req.params._typeLine;
      const resData = {
        name: typeLine,
        data: [],
      };
      const dataFile = fs.createReadStream(csvFilePath, "utf8");
      dataFile
        .pipe(stripBomStream())
        .pipe(csv())
        .on("data", (row) => {
          if (row.line === typeLine) {
            resData.data.push({ name: row.Load_scale });
          }
        })
        .on("end", () => {
          resData.data.sort(function (a, b) {
            return parseFloat(a.name) - parseFloat(b.name);
          });
          resForm.successRes(res, resData);
        })
        .on("error", (error) => {
          next(createError.Conflict(error.message));
        });
    } catch (error) {
      next(createError.InternalServerError(error.message));
    }
  },
};

export default TSA_Contrl;
