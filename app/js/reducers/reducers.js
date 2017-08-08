import { combineReducers } from 'redux';
import { loadingBarReducer } from 'react-redux-loading-bar';
import main from './main';

const reducers = combineReducers({
  loadingBar: loadingBarReducer,
  main
});

module.exports = reducers;
