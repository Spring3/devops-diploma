import { combineReducers } from 'redux';
import { loadingBarReducer } from 'react-redux-loading-bar';
import { routerReducer } from 'react-router-redux';
import main from './main';
import docker from './docker';

const reducers = combineReducers({
  loadingBar: loadingBarReducer,
  router: routerReducer,
  main,
  docker
});

module.exports = reducers;
