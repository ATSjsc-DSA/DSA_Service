"use strict";
import stripBomStream from "strip-bom-stream";
import fs from "fs";
import csv from "csv-parser";
import resForm from "../../common/response.js";
import createError from "http-errors";
import getFileModificationTimeUtc from "../../common/fileHandler.js";
import { log } from "console";
const getDataFromFile = (filePath, filterKey, filterValue) => {
  return new Promise((resolve, reject) => {
    const data = [];

    const readStream = fs.createReadStream(filePath, "utf8");
    readStream
      .pipe(stripBomStream())
      .pipe(csv({ bom: true }))
      .on("data", (row) => {
        if (row[filterKey] === filterValue) {
          data.push(row);
        }
      })
      .on("end", () => {
        resolve(data);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};

const SSR_Contrl = {
  get: (req, res, next) => {
    res.send("Hello World!");
  },
  detail: async (req, res, next) => {
    const csvFilePath = "File/SSR/Dm.csv";
    if (!fs.existsSync(csvFilePath)) {
      return next(createError.NotFound("File not found"));
    }
    const genName = req.params._genName;
    const csvDataFilePath = `File/SSR/${genName}.csv`;

    const resData = {
      name: "",
      dm: [],
      freq: [],
      base: [],
      lne_4001_8001_1: [],
      lne_4001_4204_1: [],
      lne_4001_4097_1: [],
      lne_4001_4094_1: [],
      lne_4001_4090_1: [],
      lne_3906_4001_2: [],
      lne_3906_4001_1: [],
      modificationTime: null,
    };

    try {
      const dmData = await getDataFromFile(csvFilePath, "Gen", genName);
      if (dmData.length === 0) {
        throw new Error("Name data not found");
      }
      dmData.forEach((row) => {
        const x = String(row.f / 50);
        resData.dm.push(
          { x: parseFloat(x * 50), y: parseFloat(row.dmin) },
          { x: parseFloat(x * 50), y: parseFloat(row.dmax) }
        );
      });
      resData.name = genName;
      resData.modificationTime = await getFileModificationTimeUtc(
        csvDataFilePath
      );

      const dataFile = fs.createReadStream(csvDataFilePath, "utf8");
      dataFile
        .pipe(stripBomStream())
        .pipe(csv())
        .on("data", (row) => {
          resData.freq.push(parseFloat((row.freq * 50).toFixed(2)));
          resData.base.push(parseFloat(row.Base));
          resData.lne_4001_8001_1.push(parseFloat(row.lne_4001_8001_1));
          resData.lne_4001_4204_1.push(parseFloat(row.lne_4001_4204_1));
          resData.lne_4001_4097_1.push(parseFloat(row.lne_4001_4097_1));
          resData.lne_4001_4094_1.push(parseFloat(row.lne_4001_4094_1));
          resData.lne_4001_4090_1.push(parseFloat(row.lne_4001_4090_1));
          resData.lne_3906_4001_2.push(parseFloat(row.lne_3906_4001_2));
          resData.lne_3906_4001_1.push(parseFloat(row.lne_3906_4001_1));
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
  listArea: (req, res, next) => {
    const csvFilePath = "File/VSA/results.csv";
    if (!fs.existsSync(csvFilePath)) {
      return next(createError.NotFound("File not found"));
    }
    const resData = [];
    try {
      const dataFile = fs.createReadStream(csvFilePath, "utf8");
      dataFile
        .pipe(stripBomStream())
        .pipe(csv())
        .on("data", (row) => {
          for (const key in row) {
            if (Object.prototype.hasOwnProperty.call(row, key)) {
              const value = row[key];
              const floatValue = parseFloat(value);
              if (!isNaN(floatValue)) {
                row[key] = floatValue;
              }
            }
          }
          resData.push(row);
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
  listBusbar: (req, res, next) => {
    const area = req.params._area;
    const csvFilePath = `File/VSA/${area}.csv`;
    if (!fs.existsSync(csvFilePath)) {
      return next(createError.NotFound("File not found"));
    }
    try {
      const resData = [];

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
        .on("data", (row) => {})
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
  detailBusbar: (req, res, next) => {
    try {
      const area = req.params._area;
      const busbars = req.body.payload;
      const csvFilePath = `File/VSA/${area}.csv`;

      if (!fs.existsSync(csvFilePath)) {
        return next(createError.NotFound("File not found"));
      }

      const resData = {
        power: [],
        data: {},
      };

      busbars.forEach((busbar) => {
        resData.data[busbar] = [];
      });

      const dataFile = fs.createReadStream(csvFilePath, "utf8");
      let columnNames = [];

      dataFile
        .pipe(stripBomStream())
        .pipe(csv())
        .on("headers", (headers) => {
          columnNames = headers;
        })
        .on("data", (row) => {
          resData.power.push(parseFloat(row[columnNames[0]]));

          busbars.forEach((busbar) => {
            resData.data[busbar].push(parseFloat(row[busbar]));
          });
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

  store: (req, res, next) => {
    res.send("Hello store!");
  },
  delete: (req, res, next) => {
    res.send("Hello delete!");
  },
};

export default SSR_Contrl;
