import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createMemoryHistory';

import Docker from './dockerAction';
import combinedReducer from './../reducers/reducers';

import Action from './action';

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
}

module.exports = new Actions();
module.exports.history = history;
