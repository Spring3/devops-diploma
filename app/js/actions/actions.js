import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createMemoryHistory';

import Docker from './dockerAction';
import combinedReducer from './../reducers/reducers';

import Action from './action';

const path = require('path');
const YML = require('yamljs');

// react-router-redux setup
const history = createHistory();
const middleware = routerMiddleware(history);
const store = createStore(combinedReducer, applyMiddleware(middleware));

class Actions extends Action {
  constructor() {
    super();
    this.store = store;
    this.docker = new Docker(store);
    this.toggleSidebar = this.toggleSidebar.bind(this);
  }

  toggleSidebar() {
    this.store.dispatch({ type: 'TOGGLE_SIDEBAR' });
  }

  lookupDockerfile(directory, allKeys) {
    // trying to find Dockerifle inside
    const possibleDockerfile = `${directory.path}${path.sep}Dockerfile`;
    return this.readFile(possibleDockerfile).then((contents) => {
      const contentsArray = contents.split('\n');
      let previousKey;
      const result = allKeys.map(key => ({ [key]: '' })).reduce((sum, next) => Object.assign(sum, next));
      for (const contentsLine of contentsArray) {
        if (contentsLine) {
          const keyMatch = contentsLine.match(/^[a-zA-Z]+\s/);
          const valueMatch = contentsLine.match(/\s.+/);
          const key = Array.isArray(keyMatch) ? keyMatch[0].trim() : previousKey;
          let value = Array.isArray(valueMatch) ? valueMatch[0].trim() : null;
          if (key === 'ENV' && value) {
            const regex = /\\$/;
            if (value.match(regex)) {
              value = value.replace(regex, '');
            }
          }
          if (allKeys.includes(key) && value) {
            result[key] += `${value.trim()}\n`;
          }
          previousKey = key;
        }
      }
      for (const key of Object.keys(result)) {
        if (!result[key]) {
          delete result[key];
        }
      }
      this.store.dispatch({ type: 'IMPORT_DOCKERFILE', data: result });
      return possibleDockerfile;
    });
  }

  lookupComposeFile(directory) {
    const possibleComposeFile = `${directory.path}${path.sep}docker-compose.yml`;
    console.log(possibleComposeFile);
    return this.readFile(possibleComposeFile).then((contents) => {
      console.log(contents);
      const content = YML.parse(contents);
      console.log(content);
      return possibleComposeFile;
    });
  }
}

module.exports = new Actions();
module.exports.history = history;
