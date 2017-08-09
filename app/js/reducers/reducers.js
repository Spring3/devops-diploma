import { combineReducers } from 'redux';
import { loadingBarReducer } from 'react-redux-loading-bar';
import main from './main';
import docker from './docker';

const reducers = combineReducers({
  loadingBar: loadingBarReducer,
  main,
  docker
});

module.exports = reducers;
