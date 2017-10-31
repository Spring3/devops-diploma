const fs = require('fs');

class Action {
  checkFile(filePath) {
    return new Promise((resolve, reject) => {
      fs.access(filePath, fs.constants.F_OK, (e) => {
        if (e) {
          return reject(e);
        }
        return resolve();
      });
    });
  }

  readFile(filePath) {
    return new Promise((resolve, reject) =>
      this.checkFile(filePath)
        .then(() => resolve(fs.readFileSync(filePath, { encoding: 'utf-8' })))
        .catch(reject)
    );
  }

  deleteFile(filePath) {
    return new Promise(resolve =>
      this.checkFile(filePath).then(() =>
        fs.unlink(filePath, resolve)
      ).catch((e) => {
        console.error(e);
        return resolve();
      })
    );
  }
}

module.exports = Action;
