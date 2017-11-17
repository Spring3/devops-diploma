const fs = require('fs');

let authConfig = {};

class Action {
  checkFile(filePath) {
    return new Promise((resolve, reject) => {
      fs.access(filePath, fs.constants.F_OK, (e) => {
        if (e) {
          console.log(e);
          return reject(e);
        }
        return resolve();
      });
    });
  }

  writeFile(filePath, contents) {
    return this.checkFile(filePath)
      .then(() => {
        const stream = fs.createWriteStream(filePath);
        stream.write(contents);
        stream.end();
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

  set credentials(value) {
    authConfig = value;
  }

  get credentials() {
    const result = authConfig;
    try {
      result.password = result.password instanceof Buffer ? result.password.toString('utf8') : result.password;
    } catch (e) {
      result.password = undefined;
    }
    return result;
  }
}

module.exports = Action;
