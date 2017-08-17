import React from 'react';
import { LoadingBar } from 'react-redux-loading-bar';

class LoadingBarComponent extends React.Component {
  render() {
    return (
      <header>
        <LoadingBar />
      </header>
    );
  }
}

module.exports = LoadingBarComponent;
