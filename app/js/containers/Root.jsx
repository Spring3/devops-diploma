import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import { createStore, applyMiddleware } from 'redux';
import createHistory from 'history/createMemoryHistory';
import { loadingBarMiddleware } from 'react-redux-loading-bar';
import App from './App.jsx';

import combinedReducer from '../reducers/reducers.js';
import Worker from '../modules/worker.js';

// react-router-redux setup
const history = createHistory();
const middleware = routerMiddleware(history);

const store = createStore(combinedReducer, applyMiddleware(middleware));

// docker status worker
const worker = Worker.start(store);

class Root extends React.Component {
  componentWillUnmount() {
    worker.stop();
  }

  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </Provider>
    );
  }
}

module.exports = Root;
