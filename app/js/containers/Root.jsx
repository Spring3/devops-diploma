import React from 'react';
import { Provider } from 'react-redux';
import { loadingBarMiddleware } from 'react-redux-loading-bar';
import { createStore, applyMiddleware } from 'redux';
import reducer from '../reducers/reducers.js';
import App from './App.jsx';

const store = createStore(reducer, applyMiddleware(loadingBarMiddleware())); 

class Root extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

module.exports = Root;
