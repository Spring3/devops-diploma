import React from 'react';
import { LoadingBar } from 'react-redux-loading-bar';

class Header extends React.Component {
  render() {
    return (
      <header>
        <LoadingBar />
      </header>
    );
  }
}

module.exports = Header;
