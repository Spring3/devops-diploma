import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';
import App from './App.jsx';

import actions from '../actions.js';
import Worker from '../modules/worker.js';
// docker status worker
const worker = Worker.start();

class Root extends React.Component {
  componentWillUnmount() {
    worker.stop();
  }

  render() {
    return (
      <Provider store={actions.store}>
        <ConnectedRouter history={actions.history}>
          <App />
        </ConnectedRouter>
      </Provider>
    );
  }
}

module.exports = Root;
