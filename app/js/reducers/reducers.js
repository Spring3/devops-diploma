import { combineReducers } from 'redux';
import { loadingBarReducer } from 'react-redux-loading-bar';
import { routerReducer } from 'react-router-redux';
import main from './main';
import docker from './docker';
import vagrant from './vargant';

const reducers = combineReducers({
  router: routerReducer,
  loadingBarReducer,
  main,
  docker,
  vagrant
});

module.exports = reducers;
