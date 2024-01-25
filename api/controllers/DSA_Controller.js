"use strict";
import stripBomStream from "strip-bom-stream";
import fs from "fs";
import csv from "csv-parser";
import resForm from "../../common/response.js";
import createError from "http-errors";
import { createObjectCsvWriter } from "csv-writer"; // Thêm thư viện csv-writer

const DSA_Contrl = {
  get: (req, res, next) => {
    res.send("Hello World!");
  },
  detailSubs: async (req, res, next) => {
    const csvFilePath = "File/mp_sub.csv";
    if (!fs.existsSync(csvFilePath)) {
      return next(createError.NotFound("File not found"));
    }
    const resData = {
      sub500kV: [],
      sub345kV: [],
      sub287kV: [],
      sub230kV: [],
      sub138kV: [],
      sub115kV: [],
      sub20kV: [],
    };

    try {
      const dataFile = fs.createReadStream(csvFilePath, "utf8");
      dataFile
        .pipe(stripBomStream())
        .pipe(csv())
        .on("data", (row) => {
          const subData = {
            name: row.Name,
            Id: row.Code,
            geo: [parseFloat(row.Longitude), parseFloat(row.Latitude)],
          };
          switch (row.Type) {
            case "500":
              resData.sub500kV.push(subData);
              break;
            case "345":
              resData.sub345kV.push(subData);
              break;
            case "287":
              resData.sub287kV.push(subData);
              break;
            case "230":
              resData.sub230kV.push(subData);
              break;
            case "138":
              resData.sub138kV.push(subData);
              break;
            case "115":
              resData.sub115kV.push(subData);
              break;
            case "20":
              resData.sub20kV.push(subData);
              break;
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
  detailLines: async (req, res, next) => {
    const csvFilePath = "File/mp_line.csv";

    if (!fs.existsSync(csvFilePath)) {
      return next(createError.NotFound("File not found"));
    }
    const resData = {
      line500kV: [],
      line345kV: [],
      line287kV: [],
      line220kV: [],
      line138kV: [],
      line115kV: [],
      line20kV: [],
    };

    try {
      const dataFile = fs.createReadStream(csvFilePath, "utf8");
      dataFile
        .pipe(stripBomStream())
        .pipe(csv())
        .on("data", (row) => {
          const dataLine = {
            name: row.line,
            desc: row.SubStart + "-" + row.SubEnd,
            geo: [
              [parseFloat(row.longstart), parseFloat(row.latstart)],
              [parseFloat(row.longend), parseFloat(row.latend)],
            ],
          };
          switch (row.Type) {
            case "500":
              resData.line500kV.push(dataLine);
              break;
            case "345":
              resData.line345kV.push(dataLine);
              break;
            case "287":
              resData.line287kV.push(dataLine);
              break;
            case "220":
              resData.line220kV.push(dataLine);
              break;
            case "138":
              resData.line138kV.push(dataLine);
              break;
            case "115":
              resData.line138kV.push(dataLine);
              break;
            case "20":
              resData.line20kV.push(dataLine);
              break;
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
  infoSub: async (req, res, next) => {
    const csvFilePath = "File/Radarchart.csv";
    if (!fs.existsSync(csvFilePath)) {
      return next(createError.NotFound("File not found"));
    }
    const resData = {
      Key: [],
      Rate1: [],
      Rate2: [],
      Rate3: [],
      CurentState: [],
    };

    try {
      const dataFile = fs.createReadStream(csvFilePath, "utf8");
      dataFile
        .pipe(stripBomStream())
        .pipe(csv())
        .on("data", (row) => {
          resData.Key.push(row[""]);
          resData.Rate1.push(row["Rate 1 (Green)"]);
          resData.Rate2.push(row["Rate 2 (Yellow)"]);
          resData.Rate3.push(row["Rate 3 (Red)"]);
          resData.CurentState.push(row["Curent State"]);
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
  voltageStandards: async (req, res, next) => {
    const csvFileEvaluation = "File/standards/lowhight_voltage/evaluation.csv";
    const csvFileValue = "File/standards/lowhight_voltage/value.csv";
    if (!fs.existsSync(csvFileEvaluation) && !fs.existsSync(csvFileValue)) {
      return next(createError.NotFound("File not found"));
    }
    const resData = {
      evaluation: {},
      value: [],
    };

    try {
      const dataFileEvaluation = fs.createReadStream(csvFileEvaluation, "utf8");
      dataFileEvaluation
        .pipe(stripBomStream())
        .pipe(csv())
        .on("data", (row) => {
          const key = row.value;
          const value = parseFloat(row.ref);

          resData.evaluation[key] = value;
        })
        .on("end", () => {
          const dataFileValue = fs.createReadStream(csvFileValue, "utf8");
          dataFileValue
            .pipe(stripBomStream())
            .pipe(csv())
            .on("data", (row) => {
              const subDetail = {
                name: row.name,
                value: parseFloat(row.value),
              };
              resData.value.push(subDetail);
            })
            .on("end", () => {
              resForm.successRes(res, resData);
            })
            .on("error", (error) => {
              next(createError.Conflict(error.message));
            });
        })
        .on("error", (error) => {
          next(createError.Conflict(error.message));
        });
    } catch (error) {
      next(createError.InternalServerError(error.message));
    }
  },
  lineLoadingStandards: async (req, res, next) => {
    const csvFileEvaluation = "File/standards/line_loading/evaluation.csv";
    const csvFileValue = "File/standards/line_loading/value.csv";
    if (!fs.existsSync(csvFileEvaluation) && !fs.existsSync(csvFileValue)) {
      return next(createError.NotFound("File not found"));
    }
    const resData = {
      evaluation: {},
      value: [],
    };

    try {
      const dataFileEvaluation = fs.createReadStream(csvFileEvaluation, "utf8");
      dataFileEvaluation
        .pipe(stripBomStream())
        .pipe(csv())
        .on("data", (row) => {
          const key = row.value;
          const value = parseFloat(row.ref);

          resData.evaluation[key] = value;
        })
        .on("end", () => {
          const dataFileValue = fs.createReadStream(csvFileValue, "utf8");
          dataFileValue
            .pipe(stripBomStream())
            .pipe(csv())
            .on("data", (row) => {
              const subDetail = {
                name: row.name,
                value: parseFloat(row.value),
              };
              resData.value.push(subDetail);
            })
            .on("end", () => {
              resForm.successRes(res, resData);
            })
            .on("error", (error) => {
              next(createError.Conflict(error.message));
            });
        })
        .on("error", (error) => {
          next(createError.Conflict(error.message));
        });
    } catch (error) {
      next(createError.InternalServerError(error.message));
    }
  },
  ssrStandards: async (req, res, next) => {
    const csvFileEvaluation = "File/standards/SSR_module/evaluation.csv";
    const csvFileValue = "File/standards/SSR_module/value.csv";
    if (!fs.existsSync(csvFileEvaluation) && !fs.existsSync(csvFileValue)) {
      return next(createError.NotFound("File not found"));
    }
    const resData = {
      evaluation: {},
      value: [],
    };

    try {
      const dataFileEvaluation = fs.createReadStream(csvFileEvaluation, "utf8");
      dataFileEvaluation
        .pipe(stripBomStream())
        .pipe(csv())
        .on("data", (row) => {
          const key = row.value;
          const value = row.ref;

          resData.evaluation[key] = value;
        })
        .on("end", () => {
          const dataFileValue = fs.createReadStream(csvFileValue, "utf8");
          dataFileValue
            .pipe(stripBomStream())
            .pipe(csv())
            .on("data", (row) => {
              const subDetail = {
                name: row.name,
                value: row.value,
              };
              resData.value.push(subDetail);
            })
            .on("end", () => {
              resForm.successRes(res, resData);
            })
            .on("error", (error) => {
              next(createError.Conflict(error.message));
            });
        })
        .on("error", (error) => {
          next(createError.Conflict(error.message));
        });
    } catch (error) {
      next(createError.InternalServerError(error.message));
    }
  },
};

export default DSA_Contrl;
