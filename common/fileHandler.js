import fs from "fs";

function getFileModificationTimeUtc(filePath) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        reject(err);
        return;
      }

      const modificationTimeUtc = Date.parse(stats.mtime);
      resolve(modificationTimeUtc);
    });
  });
}

export default getFileModificationTimeUtc;
