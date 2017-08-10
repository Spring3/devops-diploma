import React from 'react';
import { Provider } from 'react-redux';
import { loadingBarMiddleware } from 'react-redux-loading-bar';
import { createStore, applyMiddleware } from 'redux';
import App from './App.jsx';

import combinedReducer from '../reducers/reducers.js';
const store = createStore(combinedReducer);

import Worker from '../modules/worker.js';

const worker = Worker.start(store);

class Root extends React.Component {
  componentWillUnmount() {
    worker.stop();
  }
  
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

module.exports = Root;
