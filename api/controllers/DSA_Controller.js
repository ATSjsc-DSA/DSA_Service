"use strict";
import stripBomStream from "strip-bom-stream";
import fs from "fs";
import csv from "csv-parser";
import resForm from "../../common/response.js";
import createError from "http-errors";
import { createObjectCsvWriter } from "csv-writer"; // Thêm thư viện csv-writer
import getFileModificationTimeUtc from "../../common/fileHandler.js";

const DSA_Contrl = {
  logs: async (req, res, next) => {
    const fileName = req.params._sps;
    const csvFilePath = `File/Notification.csv`;
    if (!fs.existsSync(csvFilePath)) {
      return next(createError.NotFound("File not found"));
    }
    const resData = [];

    if (fs.existsSync(csvFilePath)) {
      try {
        const dataFile = fs.createReadStream(csvFilePath, "utf8");
        dataFile
          .pipe(stripBomStream())
          .pipe(csv())
          .on("data", (data) => {
            data.Timestamp = parseFloat(data.Timestamp * 1000);
            resData.push(data);
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
      data: {
        Rate1: [],
        Rate2: [],
        Rate3: [],
        CurentState: [],
      },
      modificationTime: null,
    };

    try {
      resData.modificationTime = await getFileModificationTimeUtc(csvFilePath);

      const dataFile = fs.createReadStream(csvFilePath, "utf8");
      dataFile
        .pipe(stripBomStream())
        .pipe(csv())
        .on("data", (row) => {
          resData.Key.push(row["Unnamed: 0"]);
          resData.data.Rate1.push(parseFloat(row["Rate 1 (Green)"]));
          resData.data.Rate2.push(parseFloat(row["Rate 2 (Yellow)"]));
          resData.data.Rate3.push(parseFloat(row["Rate 3 (Red)"]));
          resData.data.CurentState.push(parseFloat(row["Curent State"]));
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
      const data = {};
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
              const key = row.Substation;
              const voltage = parseFloat(row.Voltage);

              if (!data[key] || voltage > data[key].Voltage) {
                data[key] = {
                  Voltage: voltage,
                  Busbar: row.Busbar,
                  Substation: row.Substation,
                  kV: row.kV,
                };
              }
            })
            .on("end", () => {
              resData.value = Object.values(data);
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
                Line: row.Line,
                Loading: parseFloat(row.Loading),
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
  transStandards: async (req, res, next) => {
    const csvFileEvaluation =
      "File/standards/tranformer_loading/evaluation.csv";
    const csvFileValue = "File/standards/tranformer_loading/value.csv";
    if (!fs.existsSync(csvFileEvaluation) && !fs.existsSync(csvFileValue)) {
      return next(createError.NotFound("File not found"));
    }
    const resData = {
      evaluation: {},
      value: [],
    };

    try {
      const data = {};
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
              const key = row.Substation;
              const loading = parseFloat(row.Loading);

              if (!data[key] || loading > data[key].loading) {
                data[key] = {
                  Loading: loading,
                  Trans: row.Trans,
                  Substation: row.Substation,
                };
              }
            })
            .on("end", () => {
              resData.value = Object.values(data);
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
  geneStandards: async (req, res, next) => {
    const csvFileEvaluation = "File/standards/generator_loading/evaluation.csv";
    const csvFileValue = "File/standards/generator_loading/value.csv";
    if (!fs.existsSync(csvFileEvaluation) && !fs.existsSync(csvFileValue)) {
      return next(createError.NotFound("File not found"));
    }
    const resData = {
      evaluation: {},
      value: [],
    };
    try {
      const data = {};
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
              const key = row.Substation;
              const loading = parseFloat(row.Loading);

              if (!data[key] || loading > data[key].loading) {
                data[key] = {
                  Loading: loading,
                  Gen: row.Gen,
                  Substation: row.Substation,
                };
              }
            })
            .on("end", () => {
              resData.value = Object.values(data);
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
  exciStandards: async (req, res, next) => {
    const csvFileEvaluation =
      "File/standards/excitation_limiter/evaluation.csv";
    const csvFileValue = "File/standards/excitation_limiter/value.csv";
    if (!fs.existsSync(csvFileEvaluation) && !fs.existsSync(csvFileValue)) {
      return next(createError.NotFound("File not found"));
    }
    const resData = {
      evaluation: {},
      value: [],
    };

    try {
      const data = {};
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
              const key = row.Substation;
              const loading = parseFloat(row.Loading);

              if (!data[key] || loading > data[key].loading) {
                data[key] = {
                  Loading: loading,
                  Gen: row.Gen,
                  Substation: row.Substation,
                };
              }
            })
            .on("end", () => {
              resData.value = Object.values(data);
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
      const data = {};

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
              const key = row.Substation;
              const value = parseFloat(row.SSR);

              if (!data[key] || loading > data[key].loading) {
                data[key] = {
                  Value: value,
                  Gen: row.Gen,
                  Substation: row.Substation,
                };
              }
            })
            .on("end", () => {
              resData.value = Object.values(data);
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
  tsaStandards: async (req, res, next) => {
    const csvFileEvaluation = "File/standards/TSA_module/evaluation.csv";
    const csvFileValue = "File/standards/TSA_module/value.csv";
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
  vsaStandards: async (req, res, next) => {
    const csvFileEvaluation = "File/standards/VSA_module/evaluation.csv";
    const csvFileValue = "File/standards/VSA_module/value.csv";
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
};

export default DSA_Contrl;
