import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createMemoryHistory';

import Docker from './dockerAction';
import combinedReducer from './../reducers/reducers';

const fs = require('fs');

// react-router-redux setup
const history = createHistory();
const middleware = routerMiddleware(history);
const store = createStore(combinedReducer, applyMiddleware(middleware));

class Actions {
  constructor() {
    this.store = store;
    this.docker = new Docker(store);
    this.toggleSidebar = this.toggleSidebar.bind(this);
  }

  toggleSidebar() {
    this.store.dispatch({ type: 'TOGGLE_SIDEBAR' });
  }

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
        console.log(e);
        return resolve();
      })
    );
  }
}

module.exports = new Actions();
module.exports.history = history;
